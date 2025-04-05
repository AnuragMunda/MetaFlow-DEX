'use client'

import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAccount, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi, liquidityPoolAddress } from '@/utils/constants';
import { Address, erc20Abi, formatEther, parseUnits } from 'viem';
import toast from 'react-hot-toast';
import { type BaseError, waitForTransactionReceipt, writeContract as writeToContract } from '@wagmi/core';
import { wagmiConfig } from '@/lib/config';
import { useWriteContract } from 'wagmi';

export const RemoveLiquidity: React.FC = () => {
    const [percentage, setPercentage] = useState(50);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isConnected, address } = useAccount();
    const { data: hash, writeContract } = useWriteContract()
    const { isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    const { data: userLiquidity } = useReadContract({
        abi,
        address: liquidityPoolAddress,
        functionName: 'getUserLiquidity',
        args: [address as Address],
    }) as { data: { tokenAAmount: bigint; tokenBAmount: bigint } }

    const { data: allowance } = useReadContract({
        abi: erc20Abi,
        address: liquidityPoolAddress,
        functionName: 'allowance',
        args: [address as Address, liquidityPoolAddress],
    }) as { data: bigint }

    const { data: balance } = useReadContract({
        abi,
        address: liquidityPoolAddress,
        functionName: 'balanceOf',
        args: [address as Address],
    }) as { data: bigint }


    const [lpAmount, setLpAmount] = useState(balance !== undefined ? (parseFloat(formatEther(BigInt(balance))) * 50 / 100).toString() : '0');

    const { data: totalSupply } = useReadContract({
        abi,
        address: liquidityPoolAddress,
        functionName: 'totalSupply',
    }) as { data: bigint }

    const handleRemove = async () => {
        if (!isConnected) {
            toast("Please connect wallet")
            return
        }

        setIsSubmitting(true);
        let id: string = ""
        try {
            if (allowance < parseUnits(lpAmount, 18)) {
                id = toast.loading("Getting approval for LP Token...")
                const result = await writeToContract(wagmiConfig, {
                    abi,
                    address: liquidityPoolAddress,
                    functionName: 'approve',
                    args: [
                        liquidityPoolAddress,
                        BigInt(parseUnits(lpAmount, 18))
                    ]
                })

                await waitForTransactionReceipt(wagmiConfig, {
                    hash: result,
                })
                toast.success("Approved TETH", { id })
            }
            id = toast.loading("Intiating transaction...")
            writeContract({
                abi,
                address: liquidityPoolAddress,
                functionName: 'removeLiquidity',
                args: [
                    BigInt(parseUnits(lpAmount, 18)),
                ],
            }, {
                onSuccess() {
                    toast("Transaction initiated", { id, duration: 4000 })
                },
                onError() {
                    toast.error("User denied transaction", { id })
                    setLpAmount('')
                    setPercentage(50)
                }
            })
        } catch (err) {
            const error = err as BaseError
            console.log("Error while removing liquidity", error.shortMessage)
            setIsSubmitting(false)
            setLpAmount('')
            if (error.shortMessage === "User rejected the request.") {
                toast.error('User denied transaction', { id })
            } else {
                toast.error('Removing Liquidity failed', { id })
            }
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setIsSubmitting(false)
            setLpAmount('')
            setPercentage(50)
            toast.success("Liquidity removed", { duration: 4000 })
        }
    }, [isSuccess])

    useEffect(() => {
        if (balance != undefined) {
            setLpAmount(balance !== undefined ? (parseFloat(formatEther(BigInt(balance))) * 50 / 100).toString() : '0')
        }
    }, [balance])

    return (
        <div className="glass-card rounded-3xl overflow-hidden transition-all duration-500 shadow-lg hover:shadow-xl max-w-xl mx-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-medium">Remove Liquidity</h2>
                <div className="flex items-center space-x-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="h-8 w-8 rounded-full flex-center text-foreground/70 hover:text-foreground animate-hover">
                                <Info className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs max-w-xs">
                                Removing liquidity will return the tokens back to your wallet based on the current pool price.
                                Any unclaimed fees will also be collected.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <div className="p-5 space-y-4">
                <div>
                    <div className="space-y-2">
                        {userLiquidity?.tokenAAmount.toString() === '0' ? (
                            <div className="p-8 text-center border border-dashed border-border rounded-xl">
                                <p className="text-muted-foreground">You don&apos;t have any liquidity positions</p>
                            </div>
                        ) : (
                            <div
                                className={cn(
                                    "w-full p-3 border rounded-xl flex items-center justify-between transition-all"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <span className="text-2xl">🔷</span>
                                        <span className="text-2xl absolute -bottom-1 -right-2">💵</span>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium">TETH/TUSDC</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-border my-4 pt-4">
                    <label className="text-sm text-muted-foreground mb-2 block">Amount to Remove</label>
                    <div className="space-y-4">
                        <Slider
                            value={[percentage]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(values) => {
                                setPercentage(values[0])
                                setLpAmount(balance !== undefined ? (parseFloat(formatEther(BigInt(balance))) * values[0] / 100).toString() : '0')
                            }}
                        />

                        <div className="flex justify-between">
                            {[25, 50, 75, 100].map((value) => (
                                <button
                                    key={value}
                                    onClick={() => {
                                        setPercentage(value)
                                        setLpAmount(balance !== undefined ? (parseFloat(formatEther(BigInt(balance))) * value / 100).toString() : '0')
                                    }}
                                    className={cn(
                                        "px-3 py-1 rounded-lg text-xs font-medium",
                                        percentage === value
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                                    )}
                                >
                                    {value}%
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* You will receive */}
                <div className="bg-secondary/30 rounded-xl p-4">
                    <div className="text-sm font-medium mb-3">You will receive:</div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <span className="text-xl">🔷</span>
                                <span>TETH</span>
                            </div>
                            <span className="font-medium">
                                {(parseFloat(formatEther(userLiquidity?.tokenAAmount)) * percentage / 100).toFixed(3)} TETH
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <span className="text-xl">💵</span>
                                <span>TUSDC</span>
                            </div>
                            <span className="font-medium">
                                {(parseFloat(formatEther(userLiquidity?.tokenBAmount)) * percentage / 100).toFixed(3)} TUSDC
                            </span>
                        </div>
                        {/* <div className="mt-2 pt-2 border-t border-border">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">+ Accumulated fees</span>
                                <span className="text-gradient">{position?.myFees}</span>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Remove liquidity button */}
                <button
                    onClick={handleRemove}
                    disabled={isSubmitting || !isConnected || lpAmount === '0'}
                    className={`w-full py-4 rounded-xl font-medium ${isSubmitting || !isConnected || lpAmount === '0'
                        ? 'bg-primary/70 text-primary-foreground cursor-not-allowed'
                        : 'bg-linear-to-t from-sky-500 to-indigo-500 text-primary-foreground hover:bg-primary/90'
                        } transition-all duration-300 relative overflow-hidden group cursor-pointer`}
                >
                    <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <span className="relative">
                        {isSubmitting ? 'Removing Liquidity...' : 'Remove Liquidity'}
                    </span>
                    {isSubmitting && (
                        <div className="absolute top-0 left-0 h-1 bg-white/30 animate-pulse-light w-full"></div>
                    )}
                </button>
            </div>
        </div>
    );
};