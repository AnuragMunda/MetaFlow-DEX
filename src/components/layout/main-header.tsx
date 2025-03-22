'use client'

import Link from 'next/link'
import Logo from './logo'
import { LucideMenu, X } from 'lucide-react'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useState } from 'react'


const MainHeader = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="bg-transparent fixed top-3 left-0 right-0 z-50 transition-all duration-300 flex justify-center py-2">
            <div className='w-[94%] border bg-white opacity-95 px-4 py-2 flex justify-between items-center rounded-full'>
                <div>
                    <Logo />
                </div>
                <NavigationMenu className={`${!isOpen ? 'hidden' : ''} absolute md:relative md:block bg-white top-35 s sm:top-37 right-0 z-50 md:translate-0 md:top-0 md:left-0 -translate-x-1/2 -translate-y-1/2 left-1/2 min-w-[94%] md:min-w-auto py-3 md:py-0 rounded-4xl border md:border-none`}>
                    <NavigationMenuList className='flex flex-col md:flex-row gap-6 items-center'>
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Home
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/swap" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Swap
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/pool" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Pool
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className='flex items-center gap-4'>
                    <appkit-button />
                    {isOpen ? (
                        <X onClick={() => setIsOpen(!isOpen)} className='md:hidden' />
                    ) : (
                        <LucideMenu onClick={() => setIsOpen(!isOpen)} className='md:hidden' />
                    )}
                </div>
            </div>
        </header>
    )
}

export default MainHeader