import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function Navbar() {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/80 backdrop-blur-lg border-b border-emerald-100 shadow-md py-0"
                    : "bg-white border-b border-transparent py-2"
            )}
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo & Brand */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Logo />
                </motion.div>

                {/* Navigation Links */}
                <div className="hidden lg:flex items-center gap-10">
                    {[
                        { to: "/", label: "Home" },
                        { to: "/products", label: "Our Products" },
                        { to: "/about", label: "About Us" },
                    ].map((link) => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={cn(
                                    "text-sm font-bold transition-all relative group py-2",
                                    isActive ? "text-emerald-600" : "text-stone-600 hover:text-emerald-500"
                                )}
                            >
                                {link.label}
                                <motion.span
                                    className={cn(
                                        "absolute bottom-0 left-0 h-0.5 bg-emerald-500 rounded-full",
                                        isActive ? "w-full" : "w-0 group-hover:w-full"
                                    )}
                                    transition={{ duration: 0.3 }}
                                />
                            </Link>
                        );
                    })}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-8">
                    <Link
                        to="/admin"
                        className="flex items-center gap-2 text-sm font-bold text-stone-700 hover:text-emerald-600 transition-colors bg-stone-50 px-5 py-2.5 rounded-full border border-stone-100 hover:border-emerald-100 hover:shadow-sm"
                    >
                        <User className="h-4 w-4" />
                        <span>Admin Portal</span>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
