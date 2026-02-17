import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
    return (
        <footer className="bg-[#1b4332] text-white">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Logo variant="light" className="justify-center md:justify-start" />
                        <p className="text-sm text-emerald-100/70 leading-relaxed">
                            Sustainable farming for a better tomorrow. Join us in our journey to nourish Africa naturally.
                        </p>
                    </div>

                    {/* Quick Nav */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Explore</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                            <li><Link to="/products" className="hover:text-emerald-400 transition-colors">Our Products</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Legal</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><button className="hover:text-emerald-400 transition-colors">Privacy Policy</button></li>
                            <li><button className="hover:text-emerald-400 transition-colors">Terms of Service</button></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Follow Us</h4>
                        <div className="flex justify-center md:justify-start gap-4">
                            <button className="p-2 bg-white/10 rounded-full hover:bg-emerald-500 transition-colors"><Facebook className="h-5 w-5" /></button>
                            <button className="p-2 bg-white/10 rounded-full hover:bg-emerald-500 transition-colors"><Twitter className="h-5 w-5" /></button>
                            <button className="p-2 bg-white/10 rounded-full hover:bg-emerald-500 transition-colors"><Instagram className="h-5 w-5" /></button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
                    <p className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span>© 2026 Green Africa Farms. All Rights Reserved.</span>
                        <span className="hidden md:inline">•</span>
                        <span className="text-white/40">Designed & Built by</span>
                        <a
                            href="https://github.com/awash-dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 font-bold text-sm transition-colors underline decoration-dotted underline-offset-2"
                        >
                            awash-dev
                        </a>
                    </p>
                    <div className="flex items-center gap-4">
                        <Mail className="h-4 w-4" />
                        <span>info@greenafricafarms.com</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
