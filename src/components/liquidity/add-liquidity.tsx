'use client'

import React, { useState } from 'react';
import { Info, Plus} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const AddLiquidity: React.FC = () => {
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
        }, 1500);
    };

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
                        <span className="text-sm text-muted-foreground">Token A</span>
                        <span className="text-xs text-muted-foreground">Balance: 1.234 ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            className="w-2/3 text-2xl font-medium bg-transparent border-none outline-none"
                            placeholder="0.0"
                        />
                        <div className='flex items-center space-x-2 px-3 py-2 rounded-full border bg-secondary/50'>
                            <span className="text-lg">💰</span>
                            <span className="font-medium">TOKEN1</span>
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
                        <span className="text-sm text-muted-foreground">Token B</span>
                        <span className="text-xs text-muted-foreground">Balance: 500 USDT</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            value={toAmount}
                            onChange={(e) => setToAmount(e.target.value)}
                            className="w-2/3 text-2xl font-medium bg-transparent border-none outline-none"
                            placeholder="0.0"
                        />
                        <div className='flex items-center space-x-2 px-3 py-2 rounded-full border bg-secondary/50'>
                            <span className="text-lg">💵</span>
                            <span className="font-medium">TOKEN2</span>
                        </div>
                    </div>
                </div>

                {/* Pool information */}
                <div className="p-4 border border-border rounded-xl">
                    <h4 className="text-sm font-medium mb-2">Pool Information</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Current Price:</span>
                            <span>1 ETH = 1855.42 USDT</span>
                        </div>
                        <div className="flex justify-between">
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
                        </div>
                    </div>
                </div>

                {/* Add liquidity button */}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !fromAmount || !toAmount}
                    className={`w-full py-4 rounded-xl font-medium ${isSubmitting || !fromAmount || !toAmount
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