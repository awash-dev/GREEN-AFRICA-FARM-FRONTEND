import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#1a3c18] text-white overflow-hidden relative border-t border-[#2d5a27]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#eec90d] to-transparent opacity-30" />
            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Brand Section */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="flex flex-col">
                            <span className="text-3xl font-black tracking-tighter text-white">GREEN AFRICA</span>
                            <span className="text-[10px] font-bold text-[#eec90d] tracking-[0.3em] uppercase">Premium Organic Farm</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed max-w-sm font-medium">
                            Cultivating a sustainable future with premium organic produce. From our soil to your table, we ensure quality and freshness in every harvest using precision agriculture.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="h-10 w-10 border border-white/10 rounded-xl flex items-center justify-center hover:bg-[#eec90d] hover:text-[#1a3c18] transition-all duration-300">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Explore */}
                    <div className="md:col-span-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#eec90d] mb-6">Explore</h4>
                        <ul className="space-y-4 text-sm font-bold text-white/60">
                            <li><Link to="/" className="hover:text-white transition-colors">Marketplace</Link></li>
                            <li><Link to="/admin" className="hover:text-white transition-colors">Farm Admin</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Organic Methods</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Sustainability</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="md:col-span-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#eec90d] mb-6">Inquiry</h4>
                        <ul className="space-y-4 text-sm font-bold text-white/60">
                            <li><Link to="#" className="hover:text-white transition-colors">Order Tracking</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Quality Assurance</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Bulk Supply</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Farm Tours</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-4 flex flex-col items-start md:items-end md:text-right">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#eec90d] mb-6">HQ Ethiopia</h4>
                        <ul className="space-y-4 text-sm font-bold text-white/80">
                            <li className="flex items-center gap-3 md:justify-end">
                                <span>Addis Ababa, Green District 01</span>
                                <MapPin className="h-5 w-5 text-[#eec90d]" />
                            </li>
                            <li className="flex items-center gap-3 md:justify-end">
                                <span>+251 911 234 567</span>
                                <Phone className="h-5 w-5 text-[#eec90d]" />
                            </li>
                            <li className="flex items-center gap-3 md:justify-end underline underline-offset-4 decoration-[#eec90d]/30">
                                <span>hello@greenafrica.farm</span>
                                <Mail className="h-5 w-5 text-[#eec90d]" />
                            </li>
                        </ul>

                        <div className="mt-8 flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#eec90d] animate-pulse" />
                            <span className="text-[10px] font-black text-[#eec90d] uppercase tracking-widest">Farm Status: Live Harvest</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.1em]">© 2025 Green Africa Farm • Defined by Quality</p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.1em]">
                        <span>Engineered by</span>
                        <a
                            href="https://github.com/awash-dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#eec90d] hover:underline"
                        >
                            AWASH DEV
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}