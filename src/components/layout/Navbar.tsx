import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const navLinks = [
        { to: '/', label: 'Marketplace' },
        { to: '/admin', label: 'Farm Admin' },
    ];

    return (
        <nav className="border-b bg-[#2d5a27] shadow-2xl sticky top-0 z-[999] text-white">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img
                        src="/logo.jpg"
                        alt="Logo"
                        className="w-10 h-10 rounded hover:opacity-90 transition-opacity"
                    />
                    {/* add text */}
                    <span className="text-xl font-bold">Farm Marketplace</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`text-sm font-medium hover:text-yellow-300 transition-colors ${location.pathname === link.to ? 'text-yellow-300' : 'text-white'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-white hover:bg-white/10"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                >
                    {isMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Mobile Navigation Menu */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 bg-[#2d5a27] border-b border-white/20 shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2'
                    }`}
            >
                <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`text-sm font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-colors ${location.pathname === link.to
                                ? 'bg-white/10 text-yellow-300'
                                : 'text-white'
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile Menu Backdrop */}
            {isMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 top-[calc(4rem+8px)] bg-black/50 z-[-1]"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </nav>
    );
}