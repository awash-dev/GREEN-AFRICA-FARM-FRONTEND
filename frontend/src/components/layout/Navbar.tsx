import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function Navbar() {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        { to: "/contact", label: "Contact" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full">
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={cn(
                    "transition-all duration-500",
                    isScrolled
                        ? "bg-[#FAF8F3]/95 backdrop-blur-xl border-b border-stone-200/50 shadow-sm"
                        : "bg-[#FAF8F3]/80 backdrop-blur-md"
                )}
            >
                <div className="container mx-auto px-4 md:px-6 h-[90px] flex items-center justify-between">
                    {/* Logo & Brand */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="z-50 shrink-0 scale-75 md:scale-90 origin-left"
                    >
                        <Logo variant="dark" />
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
                                    <Logo variant="dark" />
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



                            </div>

                            <div className="mt-auto pb-8 text-center relative z-10">
                                <p className="text-[10px] font-black text-[#6D4C41]/30 uppercase tracking-[0.4em]">Green Ethiopia Farm 2026</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav>
    );
}
