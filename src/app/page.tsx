import { ArrowRight, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SideImage from "@/assets/SideImage.png"

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="flex-grow pt-20 pb-16">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block border-2 border-slate-300 px-3 py-1 mb-6 rounded-full glass text-xs font-semibold animate-fade-in">
                Now live on mainnet
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-balance animate-slide-up">
                Trade crypto with confidence on MetaFlow
              </h1>
              <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto text-balance animate-slide-up" style={{ animationDelay: '100ms' }}>
                Experience the most intuitive decentralized exchange with lightning-fast swaps and minimal fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
                <Link
                  href="/swap"
                  className="bg-linear-to-t from-sky-500 to-indigo-500 px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:bg-linear-to-t hover:from-indigo-500 hover:to-sky-500 transition-all duration-500"
                >
                  <span>Start trading</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="#features"
                  className="bg-slate-100 shadow-2xl px-6 py-3 rounded-xl glass-card font-medium flex items-center justify-center gap-2 hover:bg-secondary/30 transition-all duration-300"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-linear-to-r from-sky-600 to-indigo-700 to-bs py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Why choose MetaFlow?</h2>
              <p className="text-lg text-slate-200">
                Designed with simplicity and efficiency in mind, MetaFlow provides a seamless trading experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                  title: 'Security First',
                  description: 'Battle-tested smart contracts with regular security audits to keep your assets safe.'
                },
                {
                  icon: <Zap className="h-8 w-8 text-primary" />,
                  title: 'Lightning Fast',
                  description: 'Experience minimal latency with our optimized routing and execution engine.'
                },
                {
                  icon: <RefreshCw className="h-8 w-8 text-primary" />,
                  title: 'Low Fees',
                  description: "Trade with confidence knowing you're getting the best rates with minimal slippage."
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-slate-100 p-6 rounded-2xl glass-card hover:translate-y-[-5px] transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-foreground/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="animate-slide-in-left">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Start trading in seconds</h2>
                  <p className="text-lg text-foreground/70 mb-6">
                    Connect your wallet, select your tokens, and start trading immediately. No registration or KYC required.
                  </p>
                  <Link
                    href="/swap"
                    className="px-6 py-3 rounded-xl text-white font-medium inline-flex items-center gap-2 transition-all duration-300 bg-linear-to-t from-sky-500 to-indigo-500 hover:bg-linear-to-t hover:from-indigo-500 hover:to-sky-500"
                  >
                    <span>Launch app</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="relative rounded-2xl overflow-hidden animate-slide-in-right">
                  <div className="flex items-center justify-center h-64 md:h-80">
                    <div className="font-medium text-xl text-foreground/70">
                      <Image src={SideImage} alt="side image" className="rounded-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
