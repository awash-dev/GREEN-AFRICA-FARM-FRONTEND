import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Leaf } from 'lucide-react';

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
        <nav className="glass sticky top-0 z-[999] border-b border-white/20 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-white/60 -z-10" />
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo & Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <img
                            src="/logo.jpg"
                            alt="Green Africa Farm"
                            className="w-12 h-12 rounded-xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-500 border-2 border-primary/20"
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
                            className={`relative text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#2d5a27] py-2 ${location.pathname === link.to ? 'text-[#2d5a27]' : 'text-[#1a3c18]/60'
                                }`}
                        >
                            {link.label}
                            {location.pathname === link.to && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#eec90d] rounded-full" />
                            )}
                        </Link>
                    ))}
                    <Button className="rounded-full bg-[#1a3c18] hover:bg-[#2d5a27] text-white px-8 h-12 uppercase font-black tracking-widest text-[10px] shadow-lg hover:shadow-[#2d5a27]/20 transition-all">
                        Support Us
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-[#1a3c18] hover:bg-[#2d5a27]/10 h-12 w-12 rounded-xl"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                >
                    {isMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </Button>
            </div>

            {/* Mobile Navigation Menu - Enhanced Glass */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 glass border-b border-white/20 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isMenuOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-4'
                    }`}
            >
                <div className="container mx-auto px-6 py-8 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`text-sm font-black uppercase tracking-widest py-4 px-6 rounded-2xl transition-all ${location.pathname === link.to
                                ? 'bg-[#2d5a27] text-white shadow-xl'
                                : 'text-[#1a3c18] hover:bg-[#2d5a27]/5'
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}