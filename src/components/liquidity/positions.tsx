'use client'

import React from 'react';
import { Plus, Percent } from 'lucide-react';
import Link from 'next/link';
import { useAccount, useReadContract } from 'wagmi';
import { abi, liquidityPoolAddress } from '@/utils/constants';
import { Address, formatEther } from 'viem';

export const Positions: React.FC = () => {
    const { isConnected, address } = useAccount();
    const { data: userLiquidity } = useReadContract({
        abi,
        address: liquidityPoolAddress,
        functionName: 'getUserLiquidity',
        args: [address as Address],
    }) as { data: { tokenAAmount: bigint; tokenBAmount: bigint } };

    return (
        <div className="space-y-6">
            {isConnected && (
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Your Liquidity Position</h3>
                </div>
            )}

            {!isConnected ? (
                <h3 className="text-xl font-medium mb-2 text-center">Connect wallet to see your position</h3>
            ) : (
                userLiquidity?.tokenAAmount.toString() === '0' ? (
                    <div className="glass-card p-10 text-center rounded-xl">
                        <h3 className="text-xl font-medium mb-2">No Positions Found</h3>
                        <p className="text-muted-foreground mb-6">You don&apos;t have any liquidity positions yet.</p>
                        <Link
                            href="/liquidity?tab=add"
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 animate-hover inline-flex items-center space-x-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Liquidity</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">

                        {/* Position header */}
                        <div
                            className="p-4 flex flex-wrap justify-between items-center cursor-pointer"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <span className="text-2xl">🔷</span>
                                    <span className="text-2xl absolute -bottom-1 -right-2">💵</span>
                                </div>
                                <div>
                                    <div className="font-medium">TETH/TUSDC</div>
                                    <div className="text-xs text-muted-foreground">0.3 Fee Tier</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 md:mt-0">
                                {/* <div className="text-center">
                                            <div className="text-xs text-muted-foreground">TVL</div>
                                            <div className="font-medium">{position.tvl}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-muted-foreground">APR</div>
                                            <div className="font-medium">{position.apr}</div>
                                        </div> */}
                                {/* <div className="text-center">
                                            <div className="text-xs text-muted-foreground">My Liquidity</div>
                                            <div className="font-medium">{position.myLiquidity}</div>
                                        </div> */}
                                {/* <div className="text-center">
                                            <div className="text-xs text-muted-foreground">My Fees</div>
                                            <div className="font-medium">{position.myFees}</div>
                                        </div> */}
                            </div>
                        </div>

                        <div className="p-4 border-t border-border animate-fade-in">
                            <div>
                                {/* <div>
                                            <h4 className="text-sm font-medium mb-2">Position Details</h4>
                                            <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Min Price:</span>
                                                    <span>$1,450.00</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Max Price:</span>
                                                    <span>$2,250.00</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Current Price:</span>
                                                    <span>$1,855.42</span>
                                                </div>
                                            </div>
                                        </div> */}

                                <div>
                                    <h4 className="text-sm font-medium mb-2">My Assets</h4>
                                    <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">TETH:</span>
                                            <span>{userLiquidity?.tokenAAmount != undefined ? (Math.round(parseFloat(formatEther(userLiquidity.tokenAAmount)) * 1000) / 1000).toString() : ""} TETH</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">TUSDC:</span>
                                            <span>{userLiquidity?.tokenBAmount != undefined ? (Math.round(parseFloat(formatEther(userLiquidity.tokenBAmount)) * 1000) / 1000).toString() : ""} TUSDC</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="mt-6 flex flex-wrap gap-3">
                                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 animate-hover flex items-center space-x-2">
                                            <Plus className="h-4 w-4" />
                                            <span>Add Liquidity</span>
                                        </button>
                                        <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 animate-hover flex items-center space-x-2">
                                            <span>Remove Liquidity</span>
                                        </button>
                                        <button className="text-foreground/70 hover:text-foreground px-4 py-2 rounded-lg animate-hover flex items-center space-x-2">
                                                <ExternalLink className="h-4 w-4" />
                                                <span>View on Explorer</span>
                                            </button>
                                    </div> */}
                        </div>
                    </div>
                )
            )}
        </div>
    );
};