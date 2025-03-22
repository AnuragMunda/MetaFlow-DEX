'use client'

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
];

export const RemoveLiquidity: React.FC = () => {
    const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
    const [percentage, setPercentage] = useState(50);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const position = selectedPosition ? positions.find(p => p.id === selectedPosition) : null;

    const handleRemove = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
        }, 1500);
    };

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
                {/* Position selector */}
                <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Select Position</label>
                    <div className="space-y-2">
                        {positions.length === 0 ? (
                            <div className="p-8 text-center border border-dashed border-border rounded-xl">
                                <p className="text-muted-foreground">You don&apos;t have any liquidity positions</p>
                            </div>
                        ) : (
                            positions.map((pos) => (
                                <button
                                    key={pos.id}
                                    onClick={() => setSelectedPosition(pos.id)}
                                    className={cn(
                                        "w-full p-3 border rounded-xl flex items-center justify-between transition-all",
                                        selectedPosition === pos.id
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/50"
                                    )}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <span className="text-2xl">{pos.token0.icon}</span>
                                            <span className="text-2xl absolute -bottom-1 -right-2">{pos.token1.icon}</span>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium">{pos.token0.symbol}/{pos.token1.symbol}</div>
                                            <div className="text-xs text-muted-foreground">{pos.feeTier} • {pos.myLiquidity}</div>
                                        </div>
                                    </div>

                                    {pos.isOutOfRange && (
                                        <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs rounded-full">
                                            Out of Range
                                        </span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Amount to remove */}
                {selectedPosition && (
                    <>
                        <div className="border-t border-border my-4 pt-4">
                            <label className="text-sm text-muted-foreground mb-2 block">Amount to Remove</label>
                            <div className="space-y-4">
                                <Slider
                                    value={[percentage]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(values) => setPercentage(values[0])}
                                />

                                <div className="flex justify-between">
                                    {[25, 50, 75, 100].map((value) => (
                                        <button
                                            key={value}
                                            onClick={() => setPercentage(value)}
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
                                        <span className="text-xl">{position?.token0.icon}</span>
                                        <span>{position?.token0.symbol}</span>
                                    </div>
                                    <span className="font-medium">
                                        {(0.658 * percentage / 100).toFixed(4)} {position?.token0.symbol}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xl">{position?.token1.icon}</span>
                                        <span>{position?.token1.symbol}</span>
                                    </div>
                                    <span className="font-medium">
                                        {(1205.32 * percentage / 100).toFixed(2)} {position?.token1.symbol}
                                    </span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-border">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">+ Accumulated fees</span>
                                        <span className="text-gradient">{position?.myFees}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Remove liquidity button */}
                        <button
                            onClick={handleRemove}
                            disabled={isSubmitting || !selectedPosition}
                            className={`w-full py-4 rounded-xl font-medium ${isSubmitting || !selectedPosition
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
                    </>
                )}
            </div>
        </div>
    );
};