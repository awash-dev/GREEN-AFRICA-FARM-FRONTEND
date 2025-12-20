import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Leaf } from 'lucide-react';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    // Close menu when clicking outside (optional enhancement)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMenuOpen && !target.closest('nav')) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    const navLinks = [
        { to: '/', label: 'Marketplace' },
        { to: '/admin', label: 'Farm Admin' },
    ];

    // Close menu on Escape key press
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isMenuOpen]);

    return (
        <nav className="sticky top-0 z-50 border-b border-white/20 shadow-xl overflow-hidden bg-white/60 backdrop-blur-md">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo & Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <img
                            src="/logo.jpg"
                            alt="Green Africa Farm"
                            className="w-12 h-12 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300 border-2 border-primary/20"
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/48x48/1a3c18/ffffff?text=GA';
                            }}
                        />
                        <div className="absolute -bottom-1 -right-1 bg-[#eec90d] p-1 rounded-md shadow-sm">
                            <Leaf className="h-3 w-3 text-[#1a3c18]" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-[#1a3c18] tracking-tighter leading-none">GREEN AFRICA</span>
                        <span className="text-[10px] font-bold text-[#2d5a27] tracking-widest uppercase">Organic Farm</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`relative text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#2d5a27] py-2 ${
                                location.pathname === link.to ? 'text-[#2d5a27]' : 'text-[#1a3c18]/60'
                            }`}
                        >
                            {link.label}
                            {location.pathname === link.to && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#eec90d] rounded-full" />
                            )}
                        </Link>
                    ))}
                    <Button className="rounded-full bg-[#1a3c18] hover:bg-[#2d5a27] text-white px-8 h-12 uppercase font-black tracking-widest text-xs shadow-lg hover:shadow-xl transition-all">
                        Support Us
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    className="md:hidden text-[#1a3c18] hover:bg-[#2d5a27]/10 h-12 w-12 rounded-xl flex items-center justify-center"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <div
                className={`md:hidden fixed inset-0 top-20 bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out ${
                    isMenuOpen
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-4 pointer-events-none'
                }`}
            >
                <div className="container mx-auto px-6 py-8 flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`text-sm font-black uppercase tracking-widest py-4 px-6 rounded-2xl transition-all ${
                                location.pathname === link.to
                                    ? 'bg-[#2d5a27] text-white shadow-xl'
                                    : 'text-[#1a3c18] hover:bg-[#2d5a27]/10'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Button className="mt-4 rounded-full bg-[#1a3c18] hover:bg-[#2d5a27] text-white py-4 px-6 uppercase font-black tracking-widest text-xs shadow-lg">
                        Support Us
                    </Button>
                </div>
            </div>
        </nav>
    );
}