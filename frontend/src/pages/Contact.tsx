import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function Contact() {
    return (
        <div className="flex flex-col">
            <section className="py-24 bg-[#1b4332] text-white text-center">
                <div className="container mx-auto px-4 space-y-4">
                    <h1 className="text-5xl font-black">Get in Touch</h1>
                    <p className="text-xl text-emerald-100 max-w-2xl mx-auto font-medium">
                        Have questions about our sustainable farming or organic produce? We'd love to hear from you.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-stone-800">Contact Information</h2>
                                <p className="text-stone-500 font-medium leading-relaxed">
                                    Our team is here to help and answer any questions you might have. We look forward to hearing from you!
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                                        <Mail className="h-7 w-7 text-emerald-500 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-800">Email Us</h4>
                                        <p className="text-stone-500 font-medium">info@greenafricafarms.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                                        <Phone className="h-7 w-7 text-emerald-500 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-800">Call Us</h4>
                                        <p className="text-stone-500 font-medium">+251 911 234 567</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                                        <MapPin className="h-7 w-7 text-emerald-500 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-800">Visit Us</h4>
                                        <p className="text-stone-500 font-medium">123 Farm Road, Green Valley, Africa</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="p-10 bg-stone-50 rounded-[2.5rem] border border-stone-100 shadow-sm">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-800 ml-1">First Name</label>
                                        <input type="text" className="w-full px-5 py-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-800 ml-1">Last Name</label>
                                        <input type="text" className="w-full px-5 py-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-stone-800 ml-1">Email Address</label>
                                    <input type="email" className="w-full px-5 py-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-stone-800 ml-1">Your Message</label>
                                    <textarea className="w-full px-5 py-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium h-32 resize-none" placeholder="How can we help?"></textarea>
                                </div>
                                <button className="w-full py-5 bg-[#2d6a4f] text-white font-bold rounded-2xl hover:bg-[#1b4332] transition-colors flex items-center justify-center gap-2">
                                    <Send className="h-5 w-5" />
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
