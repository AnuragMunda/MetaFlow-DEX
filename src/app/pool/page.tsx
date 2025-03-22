import { LiquidityTabs } from '@/components/liquidity/liquidity-tabs';

const Liquidity = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 pt-24 md:pt-32 px-4">
                <section className="max-w-6xl mx-auto mb-24">
                    <div className="relative animate-fade-in">
                        <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-pulse-light"></div>

                        <div className="mb-12 max-w-xl mx-auto text-center">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">Liquidity</span> Pools
                            </h1>
                            <p className="text-muted-foreground">
                                Add liquidity to earn fees and participate in the MetaFlow ecosystem. Your liquidity provider tokens represent your position in the pool.
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <LiquidityTabs />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Liquidity;