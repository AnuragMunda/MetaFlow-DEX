import Link from "next/link"
import { Github, Twitter, DiscIcon as Discord } from "lucide-react"
import Logo from "./logo"

export default function MainFooter() {
    return (
        <footer className="bg-background border-t border-border/40 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-15">
                    {/* Logo and Description */}
                    <div className="col-span-1 md:col-span-1">
                        <Logo />
                        <p className="text-muted-foreground text-sm mt-4">
                            The next generation decentralized exchange platform for seamless token swaps and liquidity provision.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Discord className="h-5 w-5" />
                                <span className="sr-only">Discord</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="text-center md:text-left">
                        <h3 className="font-semibold text-foreground mb-4">Products</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                    Swap
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                    Pool
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                    Farm
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                    Analytics
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="text-center md:text-left">
                        <h3 className="font-semibold text-foreground mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                    Tutorials
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="text-center md:text-left">
                        <h3 className="font-semibold text-foreground mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/40 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MetaFlow. All rights reserved.</p>
                    <div className="mt-4 md:mt-0">
                        <p className="text-xs text-muted-foreground">Built with ❤️ for the decentralized web</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

