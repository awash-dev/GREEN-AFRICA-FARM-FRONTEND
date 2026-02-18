import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

interface LogoProps {
    className?: string;
    variant?: 'dark' | 'light';
}

export function Logo({ className = "", variant = 'dark' }: LogoProps) {
    const textColor = variant === 'dark' ? 'text-stone-800' : 'text-white';
    const subTextColor = variant === 'dark' ? 'text-emerald-600' : 'text-emerald-400';

    return (
        <Link to="/" className={`flex items-center gap-3 group ${className}`}>
            <div className="relative shrink-0">
                {/* Logo Frame mimicking the reference image */}
                <div className="w-12 h-12 bg-[#e8e4db] rounded-xl flex items-center justify-center border-2 border-stone-200 overflow-hidden shadow-sm">
                    <img
                        src="/logo.jpg"
                        alt="Green Africa Farms"
                        className="w-10 h-10 object-contain rounded-md"
                    />
                </div>
                {/* Yellow Leaf Badge */}
                <div className="absolute -bottom-1.5 -right-1.5 bg-[#f5bc28] p-1.5 rounded-full shadow-md border border-white/20">
                    <Leaf className="h-4 w-4 text-stone-900 fill-stone-900/10" strokeWidth={2.5} />
                </div>
            </div>

            <div className="flex flex-col">
                <span className={`text-xl font-extrabold uppercase tracking-tight leading-none ${textColor}`}>
                    Green African
                </span>
                <span className={`text-[13px] font-black uppercase tracking-[0.2em] mt-0.5 ${subTextColor}`}>
                    Farms
                </span>
            </div>
        </Link>
    );
}
