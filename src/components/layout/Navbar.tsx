import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export function Navbar() {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { totalItems } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/products", label: "Harvest" },
        { to: "/about", label: "Our Story" },
    ];

    return (
        <nav className="sticky top-0 z-50">
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={cn(
                    "transition-all duration-500",
                    isScrolled
                        ? "bg-[#FAF8F3]/95 backdrop-blur-xl border-b border-stone-200/50 shadow-sm"
                        : "bg-transparent py-2 md:py-4"
                )}
            >
                <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                    {/* Logo & Brand */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="z-50 shrink-0 scale-90 md:scale-100 origin-left"
                    >
                        <Logo />
                    </motion.div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-12">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={cn(
                                        "text-sm font-bold uppercase tracking-[0.2em] transition-all relative group py-2",
                                        isActive ? "text-[#0F2E1C]" : "text-[#0F2E1C]/60 hover:text-[#2E7D32]"
                                    )}
                                >
                                    {link.label}
                                    <motion.span
                                        className={cn(
                                            "absolute bottom-0 left-0 h-0.5 bg-[#2E7D32] rounded-full",
                                            isActive ? "w-full" : "w-0 group-hover:w-full"
                                        )}
                                        transition={{ duration: 0.4 }}
                                    />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-6 z-50">
                        <Link
                            to="/cart"
                            className="relative p-2.5 md:p-3 rounded-full bg-white border border-stone-200 text-[#0F2E1C] hover:bg-[#F5F1E8] transition-all group overflow-visible shadow-sm"
                        >
                            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
                            <AnimatePresence>
                                {totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{
                                            scale: 1,
                                            y: [0, -2, 0]
                                        }}
                                        transition={{
                                            y: {
                                                repeat: Infinity,
                                                duration: 2,
                                                ease: "easeInOut"
                                            }
                                        }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 h-4 w-4 md:h-5 md:w-5 bg-[#2E7D32] text-white text-[9px] md:text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2.5 md:p-3 rounded-full bg-[#0F2E1C] text-white hover:bg-[#2E7D32] transition-all shadow-md active:scale-95 touch-manipulation"
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute inset-0 bg-[#0F2E1C]/40 backdrop-blur-md"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-[#FAF8F3] flex flex-col p-6 overflow-hidden shadow-2xl h-full border-l border-stone-200"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between mb-12">
                                <div className="scale-90 origin-left">
                                    <Logo />
                                </div>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2.5 rounded-full bg-[#0F2E1C] text-white active:scale-90 transition-transform shadow-lg"
                                    aria-label="Close Menu"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Background Leaf Illustration */}
                            <motion.div
                                initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                                animate={{ opacity: 0.03, rotate: 0, scale: 1 }}
                                className="absolute bottom-20 -left-10 pointer-events-none"
                            >
                                <Leaf className="w-80 h-80 text-[#2E7D32]" />
                            </motion.div>

                            <div className="flex flex-col gap-6 relative z-10">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.to}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            to={link.to}
                                            className={cn(
                                                "text-4xl font-serif font-medium transition-all block py-2",
                                                location.pathname === link.to ? "text-[#2E7D32]" : "text-[#0F2E1C]"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Mobile Cart Link */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Link
                                        to="/cart"
                                        className="flex items-center gap-4 py-4 border-t border-stone-200/60 mt-4 group"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="relative h-12 w-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
                                            <ShoppingCart className="h-5 w-5 text-[#0F2E1C]" />
                                            {totalItems > 0 && (
                                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#2E7D32] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                                    {totalItems}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-[#0F2E1C]">Your Basket</span>
                                            <span className="text-xs text-[#6D4C41] opacity-60">{totalItems} Items Ready</span>
                                        </div>
                                    </Link>
                                </motion.div>

                            </div>

                            <div className="mt-auto pb-8 text-center relative z-10">
                                <p className="text-[10px] font-black text-[#6D4C41]/30 uppercase tracking-[0.4em]">Green Africa Farm 2026</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav>
    );
}
