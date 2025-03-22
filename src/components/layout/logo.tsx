import React from 'react';
import Link from 'next/link';

const Logo = () => {

    return (
        <Link href="/" className="flex items-center gap-2 group">
            <div className=" bg-linear-to-t from-sky-500 to-indigo-500 relative h-8 w-8 rounded-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-70"></div>
                <div className="font-bold text-white text-sm">M</div>
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 dark:from-foreground dark:to-foreground/80">
                MetaFlow
            </span>
        </Link>
    );
};

export default Logo;