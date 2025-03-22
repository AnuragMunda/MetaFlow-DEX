'use client'

import React, { useState } from 'react';
import { ExternalLink, Plus, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Sample position data
const positions = [
    {
        id: '1',
        token0: { symbol: 'ETH', icon: '🔷' },
        token1: { symbol: 'USDT', icon: '💵' },
        feeTier: '0.3%',
        tvl: '$24,500',
        apr: '12.5%',
        range: 'In range',
        myLiquidity: '$2,450',
        myFees: '$125',
    },
    {
        id: '2',
        token0: { symbol: 'BTC', icon: '🔶' },
        token1: { symbol: 'USDC', icon: '🔵' },
        feeTier: '0.05%',
        tvl: '$156,800',
        apr: '8.2%',
        range: 'In range',
        myLiquidity: '$3,120',
        myFees: '$89',
    },
    {
        id: '3',
        token0: { symbol: 'ETH', icon: '🔷' },
        token1: { symbol: 'DAI', icon: '🟡' },
        feeTier: '1%',
        tvl: '$18,200',
        apr: '15.3%',
        range: 'Out of range',
        myLiquidity: '$920',
        myFees: '$45',
        isOutOfRange: true,
    }
];

export const Positions: React.FC = () => {
    const [expandedPositions, setExpandedPositions] = useState<string[]>([]);

    const togglePosition = (id: string) => {
        if (expandedPositions.includes(id)) {
            setExpandedPositions(expandedPositions.filter(pid => pid !== id));
        } else {
            setExpandedPositions([...expandedPositions, id]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Your Liquidity Position</h3>
            </div>

            {positions.length === 0 ? (
                <div className="glass-card p-10 text-center rounded-xl">
                    <div className="flex-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-secondary/50 flex-center">
                            <Percent className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </div>
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
                    {positions.map((position) => (
                        <div
                            key={position.id}
                            className={cn(
                                "glass-card rounded-xl overflow-hidden transition-all duration-300",
                                position.isOutOfRange && "border-destructive/30 bg-destructive/5"
                            )}
                        >
                            {/* Position header */}
                            <div
                                className="p-4 flex flex-wrap justify-between items-center cursor-pointer"
                                onClick={() => togglePosition(position.id)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <span className="text-2xl">{position.token0.icon}</span>
                                        <span className="text-2xl absolute -bottom-1 -right-2">{position.token1.icon}</span>
                                    </div>
                                    <div>
                                        <div className="font-medium">{position.token0.symbol}/{position.token1.symbol}</div>
                                        <div className="text-xs text-muted-foreground">{position.feeTier} Fee Tier</div>
                                    </div>
                                    {position.isOutOfRange && (
                                        <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs rounded-full">
                                            Out of Range
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 md:mt-0">
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">TVL</div>
                                        <div className="font-medium">{position.tvl}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">APR</div>
                                        <div className="font-medium">{position.apr}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">My Liquidity</div>
                                        <div className="font-medium">{position.myLiquidity}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">My Fees</div>
                                        <div className="font-medium">{position.myFees}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded content */}
                            {expandedPositions.includes(position.id) && (
                                <div className="p-4 border-t border-border animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
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
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-2">My Assets</h4>
                                            <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{position.token0.symbol}:</span>
                                                    <span>0.658 {position.token0.symbol}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{position.token1.symbol}:</span>
                                                    <span>1,205.32 {position.token1.symbol}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-3">
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
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};