'use client'

import React, { useEffect, useState } from 'react';
import { Info, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { abi, liquidityPoolAddress } from '@/utils/constants';
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Address, erc20Abi, formatEther, getContract, parseUnits } from 'viem';
import { publicClient, wagmiConfig } from '@/lib/config';
import toast from 'react-hot-toast';
import { type BaseError, waitForTransactionReceipt, writeContract as writeToContract } from '@wagmi/core';

export const AddLiquidity: React.FC = () => {
    const [fromToken, setFromToken] = useState<{
        name?: string;
        symbol?: string;
        decimals?: number;
        address?: Address;
    }>({});
    const [toToken, setToToken] = useState<{
        name?: string;
        symbol?: string;
        decimals?: number;
        address?: Address;
    }>({});
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditingFrom, setIsEditingFrom] = useState(false)
    const { isConnected, address } = useAccount()
    const { data: hash, writeContract } = useWriteContract()
    const { isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    const { data: outputToAmount } = useReadContract({
        abi,
        address: liquidityPoolAddress,
        functionName: 'getAmountOut',
        args: [
            parseUnits(fromAmount, 18),
            fromToken?.address
        ]
    }) as { data: bigint }

    const { data: outputFromAmount } = useReadContract({
        abi,
        address: liquidityPoolAddress,
        functionName: 'getAmountOut',
        args: [
            parseUnits(toAmount, 18),
            toToken?.address
        ]
    }) as { data: bigint }

    const { data: currentPrice } = useReadContract({
        abi,
        address: liquidityPoolAddress,
        functionName: 'getAmountOut',
        args: [
            parseUnits('1', 18),
            fromToken?.address
        ]
    }) as { data: bigint }

    const { data: tokenA } = useReadContract({
        abi,
        address: liquidityPoolAddress,
        functionName: "i_tokenA"
    }) as { data: Address }

    const { data: tokenB } = useReadContract({
        abi,
        address: liquidityPoolAddress,
        functionName: 'i_tokenB',
    }) as { data: Address }

    const { data: tokenABalance } = useReadContract({
        abi: erc20Abi,
        address: tokenA,
        functionName: 'balanceOf',
        args: [address as Address]
    })

    const { data: tokenBBalance } = useReadContract({
        abi: erc20Abi,
        address: tokenB,
        functionName: 'balanceOf',
        args: [address as Address]
    })

    const { data: FromAllowance } = useReadContract({
        abi: erc20Abi,
        address: fromToken.address,
        functionName: 'allowance',
        args: [address as Address, liquidityPoolAddress],
    }) as { data: bigint }

    const { data: ToAllowance } = useReadContract({
        abi: erc20Abi,
        address: toToken.address,
        functionName: 'allowance',
        args: [address as Address, liquidityPoolAddress],
    }) as { data: bigint }

    const handleSubmit = async () => {
        if (!isConnected) {
            toast("Please connect wallet")
            return
        }

        setIsSubmitting(true);
        let id: string = ""
        try {
            if (FromAllowance < parseUnits(fromAmount, 18)) {
                id = toast.loading("Getting approval for TETH...")
                const result = await writeToContract(wagmiConfig, {
                    abi: erc20Abi,
                    address: tokenA,
                    functionName: 'approve',
                    args: [
                        liquidityPoolAddress,
                        BigInt(parseUnits(fromAmount, 18))
                    ]
                })

                await waitForTransactionReceipt(wagmiConfig, {
                    hash: result,
                })
                toast.success("Approved TETH", { id })
            }
            if (ToAllowance < parseUnits(toAmount, 18)) {
                id = toast.loading("Getting approval for TUSDC...")
                const result = await writeToContract(wagmiConfig, {
                    abi: erc20Abi,
                    address: tokenB,
                    functionName: 'approve',
                    args: [
                        liquidityPoolAddress,
                        BigInt(parseUnits(toAmount, 18))
                    ]
                })

                await waitForTransactionReceipt(wagmiConfig, {
                    hash: result,
                })
                toast.success("Approved TUSDC", { id })
            }
            id = toast.loading("Intiating transaction...")
            writeContract({
                abi,
                address: liquidityPoolAddress,
                functionName: 'addLiquidity',
                args: [
                    BigInt(parseUnits(fromAmount, 18)),
                    BigInt(parseUnits(toAmount, 18))
                ],
            }, {
                onSuccess() {
                    toast("Liquidation initiated", { id, duration: 4000 })
                },
                onError() {
                    toast.error("User denied transaction", { id })
                    setFromAmount('')
                    setToAmount('')
                }
            })
        } catch (err) {
            const error = err as BaseError
            console.log("Error while adding liquidity", error.shortMessage)
            setIsSubmitting(false)
            setFromAmount('')
            setToAmount('')
            if (error.shortMessage === "User rejected the request.") {
                toast.error('User denied transaction', { id })
            } else {
                toast.error('Liquidation failed', { id })
            }
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setIsSubmitting(false)
            setFromAmount('')
            setToAmount('')
            toast.success("Liquidity added", { duration: 4000 })
        }
    }, [isSuccess])

    useEffect(() => {
        if (isEditingFrom) {
            if (outputToAmount != undefined) {
                setToAmount(formatEther(outputToAmount))
            }
        } else {
            if (outputFromAmount != undefined) {
                setFromAmount(formatEther(outputFromAmount))
            }
        }
    }, [fromAmount, isEditingFrom, outputFromAmount, outputToAmount, toAmount])

    useEffect(() => {
        const fetchTokenDetails = async () => {
            if (tokenA && tokenB) {
                const tokenAContract = getContract({
                    abi: erc20Abi,
                    address: tokenA,
                    client: publicClient
                })
                const tokenBContract = getContract({
                    abi: erc20Abi,
                    address: tokenB,
                    client: publicClient
                })
                const [
                    tokenAname,
                    tokenAsymbol,
                    tokenAdecimals,
                    tokenBname,
                    tokenBsymbol,
                    tokenBdecimals
                ] = await Promise.all([
                    tokenAContract.read.name(),
                    tokenAContract.read.symbol(),
                    tokenAContract.read.decimals(),
                    tokenBContract.read.name(),
                    tokenBContract.read.symbol(),
                    tokenBContract.read.decimals(),
                ]);

                setFromToken({ name: tokenAname, symbol: tokenAsymbol, decimals: tokenAdecimals, address: tokenA })
                setToToken({ name: tokenBname, symbol: tokenBsymbol, decimals: tokenBdecimals, address: tokenB })
            }
        }

        fetchTokenDetails()
    }, [tokenA, tokenB])

    return (
        <div className="glass-card rounded-3xl overflow-hidden transition-all duration-500 shadow-lg hover:shadow-xl max-w-xl mx-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-medium">Add Liquidity</h2>
                <div className="flex items-center space-x-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="h-8 w-8 rounded-full flex-center text-foreground/70 hover:text-foreground animate-hover">
                                <Info className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs max-w-xs">
                                When you add liquidity, you will receive LP tokens representing your position.
                                These tokens automatically earn fees proportional to your share of the pool.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <div className="p-5 space-y-4">

                {/* From token */}
                <div className="bg-secondary/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{fromToken.symbol}</span>
                        {isConnected && (
                            <span className="text-xs text-muted-foreground">Balance: {tokenABalance !== undefined ? (Math.round(parseFloat(formatEther(tokenABalance)) * 1000) / 1000).toString() : "Loading..."} {fromToken.symbol}</span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            value={!isEditingFrom ? (outputFromAmount !== undefined ? (Math.round(parseFloat(formatEther(outputFromAmount)) * 1000) / 1000).toString() : "") : fromAmount}
                            onChange={(e) => {
                                setIsEditingFrom(true)
                                setFromAmount(e.target.value)
                            }}
                            className="w-2/3 text-2xl font-medium bg-transparent border-none outline-none"
                            placeholder="0.0"
                        />
                        <div className='flex items-center space-x-2 px-3 py-2 rounded-full border bg-secondary/50'>
                            <span className="text-lg">💰</span>
                            <span className="font-medium">{fromToken.symbol}</span>
                        </div>
                    </div>
                </div>

                {/* Add icon in the middle */}
                <div className="flex justify-center items-center">
                    <div className="h-8 w-8 rounded-full border bg-background flex justify-center items-center">
                        <Plus className="h-4 w-4 text-foreground" />
                    </div>
                </div>

                {/* To token */}
                <div className="bg-secondary/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{toToken.symbol}</span>
                        {isConnected && (
                            <span className="text-xs text-muted-foreground">Balance: {tokenBBalance !== undefined ? (Math.round(parseFloat(formatEther(tokenBBalance)) * 1000) / 1000).toString() : "Loading..."} {toToken.symbol}</span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            value={isEditingFrom ? (outputToAmount !== undefined ? (Math.round(parseFloat(formatEther(outputToAmount)) * 1000) / 1000).toString() : "") : toAmount}
                            onChange={(e) => {
                                setIsEditingFrom(false)
                                setToAmount(e.target.value)
                            }}
                            className="w-2/3 text-2xl font-medium bg-transparent border-none outline-none"
                            placeholder="0.0"
                        />
                        <div className='flex items-center space-x-2 px-3 py-2 rounded-full border bg-secondary/50'>
                            <span className="text-lg">💵</span>
                            <span className="font-medium">{toToken.symbol}</span>
                        </div>
                    </div>
                </div>

                {/* Pool information */}
                {isConnected && (
                    <div className="p-4 border border-border rounded-xl">
                        <h4 className="text-sm font-medium mb-2">Pool Information</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Current Price:</span>
                                <span>1 {fromToken.symbol} = {currentPrice !== undefined ? (Math.round(parseFloat(formatEther(currentPrice)) * 1000) / 1000).toString() : "Loading..."} {toToken.symbol}</span>
                            </div>
                            {/* <div className="flex justify-between">
                            <span className="text-muted-foreground">TVL:</span>
                            <span>$24.5M</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">24h Volume:</span>
                            <span>$1.2M</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">APR:</span>
                            <span className="text-gradient font-medium">12.5%</span>
                        </div> */}
                        </div>
                    </div>
                )}

                {/* Add liquidity button */}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !fromAmount || !toAmount || !isConnected}
                    className={`w-full py-4 rounded-xl font-medium ${isSubmitting || !fromAmount || !toAmount || !isConnected
                        ? 'bg-primary/70 text-primary-foreground cursor-not-allowed'
                        : 'bg-linear-to-t from-sky-500 to-indigo-500 hover:bg-primary/90'
                        } transition-all duration-300 relative overflow-hidden group cursor-pointer`}
                >
                    <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <span className="relative text-white">
                        {isSubmitting ? 'Adding Liquidity...' : 'Add Liquidity'}
                    </span>
                    {isSubmitting && (
                        <div className="absolute top-0 left-0 h-1 bg-white/30 animate-pulse-light w-full"></div>
                    )}
                </button>
            </div>
        </div>
    );
};