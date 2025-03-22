'use client'

import React, { useEffect, useState } from 'react';
import { ArrowDown CircleHelp } from 'lucide-react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { abi, liquidityPoolAddress } from "@/utils/constants"
import toast from 'react-hot-toast'
import { getContract, Address, erc20Abi, formatEther, parseUnits } from 'viem';
import { publicClient, wagmiConfig } from '@/lib/config';
import { type BaseError, waitForTransactionReceipt, writeContract as writeToContract } from '@wagmi/core';

export const SwapCard: React.FC = () => {
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isConnected, address } = useAccount()
    const { writeContract } = useWriteContract()

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

    const { data: outputAmount } = useReadContract({
        abi,
        address: liquidityPoolAddress,
        functionName: 'getAmountOut',
        args: [
            parseUnits(fromAmount, 18),
            fromToken?.address
        ]
    }) as { data: bigint }

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
    const [fromTokenBalance, setFromTokenBalance] = useState(tokenABalance);

    const { data: allowance } = useReadContract({
        abi: erc20Abi,
        address: fromToken.address,
        functionName: 'allowance',
        args: [address as Address, liquidityPoolAddress],
    }) as { data: bigint }

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

    const handleSwap = async () => {
        if (!isConnected) {
            toast("Please connect wallet")
            return
        }

        setIsSubmitting(true)
        let id: string = ""
        try {
            if (allowance < parseUnits(fromAmount, 18)) {
                id = toast.loading("Approving...")
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
                    confirmations: 1
                })
                toast.success("Approved", { id })
            }
            id = toast.loading("getting swap confirmation...")
            writeContract({
                abi,
                address: liquidityPoolAddress,
                functionName: 'swap',
                args: [
                    fromToken?.address,
                    BigInt(parseUnits(fromAmount, 18))
                ],
            }, {
                onSuccess() {
                    toast.loading("Swapping...", { id })
                },
                onError() {
                    toast.error("User denied transaction", { id })
                }
            })
        } catch (err) {
            const error = err as BaseError
            console.log("Error while swapping", error.shortMessage)
            if (error.shortMessage === "User rejected the request.") {
                toast.error('User denied transaction', { id })
            } else {
                toast.error('Swap failed', { id })
            }
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <div className="min-h-screen w-[90%] max-w-md mx-auto mt-30 md:mt-36 text-white">
            <div className="glass-card bg-slate-900 rounded-3xl overflow-hidden transition-all duration-500 shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-b-slate-200 border-border">
                    <h2 className="font-medium">Swap</h2>
                    <div className="flex items-center">
                        <button className="h-8 w-8 rounded-full flex-center text-slate-400 hover:text-white animate-hover cursor-pointer">
                            <CircleHelp className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="p-5 space-y-4">
                    {/* From token */}
                    <div className="bg-slate-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-md text-slate-400">Sell</span>
                            <span className="text-xs text-slate-400">{`Balance: ${fromTokenBalance !== undefined ? (Math.round(parseFloat(formatEther(fromTokenBalance)) * 1000) / 1000).toString() : "Loading..."} ${fromToken?.symbol}`}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                value={fromAmount}
                                onChange={(e) => setFromAmount(e.target.value)}
                                className="w-2/3 text-2xl font-medium bg-transparent border-none outline-none"
                                placeholder="0"
                            />
                            <div className='flex items-center space-x-2 px-3 py-2 rounded-full border bg-secondary/50'>
                                <span className="text-lg">💰</span>
                                <span className="font-medium">{fromToken?.symbol}</span>
                            </div>
                        </div>
                    </div>

                    {/* Swap direction button */}
                    <div className="flex justify-center items-center">
                        <button
                            onClick={() => {
                                const tempToken = fromToken;
                                setFromToken(toToken);
                                setToToken(tempToken);
                                setFromAmount(outputAmount !== undefined ? (Math.round(parseFloat(formatEther(outputAmount)) * 1000) / 1000).toString() : "");
                                if (fromToken.symbol == "TUSDC") {
                                    setFromTokenBalance(tokenBBalance)
                                } else {
                                    setFromTokenBalance(tokenABalance)
                                }
                            }}
                            className="bg-slate-900 cursor-pointer h-8 w-8 rounded-full border border-slate-400 flex justify-center items-center transform transition-transform hover:rotate-180 duration-300"
                        >
                            <ArrowDown className="h-4 w-4 text-white" />
                        </button>
                    </div>

                    {/* To token */}
                    <div className="bg-slate-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-md text-slate-400">Buy</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                value={outputAmount !== undefined ? (Math.round(parseFloat(formatEther(outputAmount)) * 1000) / 1000).toString() : ""}
                                className="w-2/3 text-2xl font-medium bg-transparent border-none outline-none"
                                readOnly
                                placeholder="0"
                            />
                            <div className='flex items-center space-x-2 px-3 py-2 rounded-full border bg-secondary/50'>
                                <span className="text-lg">💵</span>
                                <span className="font-medium">{toToken?.symbol}</span>
                            </div>
                        </div>
                    </div>

                    {/* Swap button */}
                    <button
                        onClick={handleSwap}
                        disabled={isSubmitting || !isConnected || fromAmount == ""}
                        className={`w-full py-4 rounded-xl font-medium ${isSubmitting || !isConnected
                            ? 'bg-linear-to-t from-sky-500/90 to-indigo-500/90 text-primary-foreground cursor-not-allowed'
                            : 'bg-linear-to-t from-sky-500 to-indigo-500 text-primary-foreground hover:bg-primary/90 cursor-pointer'
                            } transition-all duration-300 relative overflow-hidden group`}
                    >
                        <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                        <span className="relative">
                            {isSubmitting ? 'Swapping...' : 'Swap Tokens'}
                        </span>
                        {isSubmitting && (
                            <div className="absolute top-0 left-0 h-1 bg-white/30 animate-pulse-light w-full"></div>
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
};