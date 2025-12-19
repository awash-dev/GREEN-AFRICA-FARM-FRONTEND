import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#1a3c18] text-white border-t border-[#2d5a27]">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-1 space-y-4">
                        <h3 className="font-bold text-xl text-yellow-400">GREEN AFRICA FARM</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Cultivating a sustainable future with premium organic produce. From our soil to your table, we ensure quality and freshness in every harvest.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors"><Instagram className="h-5 w-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-gray-100">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><Link to="/" className="hover:text-yellow-400 transition-colors flex items-center gap-2">Home</Link></li>
                            <li><Link to="/products" className="hover:text-yellow-400 transition-colors flex items-center gap-2">Our Products</Link></li>
                            <li><Link to="/about" className="hover:text-yellow-400 transition-colors flex items-center gap-2">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-yellow-400 transition-colors flex items-center gap-2">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-gray-100">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-yellow-500 shrink-0" />
                                <span>123 Farm Road, Green Valley, Africa</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-yellow-500 shrink-0" />
                                <span>+251 911 234 567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-yellow-500 shrink-0" />
                                <span>info@greenafricafarm.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-gray-100">Newsletter</h4>
                        <p className="text-sm text-gray-300 mb-4">
                            Subscribe to receive updates on new harvests and offers.
                        </p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full h-10 px-3 bg-black/20 border border-white/10 rounded-md text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                            />
                            <button className="w-full h-10 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-md text-sm transition-colors shadow-lg hover:shadow-xl">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>© 2025 Green Africa Farm. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Developed by</span>
                        <a
                            href="https://github.com/awash-dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                        >
                            Awash dev
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}