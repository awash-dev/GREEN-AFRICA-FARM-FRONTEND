import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Leaf } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gradient-to-br from-[#1a3c18] via-[#2d5a27] to-[#1a3c18] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                <Leaf className="h-7 w-7 text-emerald-300" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-white tracking-tight leading-none">
                                    GREEN AFRICA
                                </span>
                                <span className="text-xs font-semibold text-emerald-300/80 tracking-wide">
                                    Organic Farm
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">
                            Cultivating a sustainable future with premium organic produce. From our soil to your table, we ensure quality and freshness in every harvest.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                size="icon"
                                variant="outline"
                                className="border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white"
                            >
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="outline"
                                className="border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white"
                            >
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="outline"
                                className="border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white"
                            >
                                <Instagram className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-sm text-white/80 hover:text-white transition-colors inline-flex items-center gap-2">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-sm text-white/80 hover:text-white transition-colors inline-flex items-center gap-2">
                                    Our Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-sm text-white/80 hover:text-white transition-colors inline-flex items-center gap-2">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-sm text-white/80 hover:text-white transition-colors inline-flex items-center gap-2">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-white">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-emerald-300 shrink-0 mt-0.5" />
                                <span className="text-sm text-white/80">123 Farm Road, Green Valley, Africa</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-emerald-300 shrink-0" />
                                <span className="text-sm text-white/80">+251 911 234 567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-emerald-300 shrink-0" />
                                <span className="text-sm text-white/80">info@greenafricafarm.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-white">Newsletter</h4>
                        <p className="text-sm text-white/80">
                            Subscribe to receive updates on new harvests and offers.
                        </p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
                            />
                            <Button className="w-full bg-white text-[#1a3c18] hover:bg-white/90 font-semibold">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                <Separator className="my-12 bg-white/10" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
                    <p>© 2025 Green Africa Farm. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Developed by</span>
                        <a
                            href="https://github.com/awash-dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors"
                        >
                            Awash dev
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}