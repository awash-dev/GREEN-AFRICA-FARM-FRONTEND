import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export function Navbar() {
    const location = useLocation();

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

                {/* Navigation */}
                <div className="flex items-center gap-4 md:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`relative text-[10px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all duration-300 hover:text-[#2d5a27] py-2 ${location.pathname === link.to ? 'text-[#2d5a27]' : 'text-[#1a3c18]/60'
                                }`}
                        >
                            {link.label}
                            {location.pathname === link.to && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#eec90d] rounded-full" />
                            )}
                        </Link>
                    ))}
                    <Button className="hidden sm:flex rounded-full bg-[#1a3c18] hover:bg-[#2d5a27] text-white px-4 md:px-8 h-10 md:h-12 uppercase font-black tracking-widest text-[9px] md:text-[10px] shadow-lg hover:shadow-[#2d5a27]/20 transition-all">
                        Support Us
                    </Button>
                </div>
            </div>
        </nav>
    );
}
