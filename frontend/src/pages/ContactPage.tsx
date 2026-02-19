import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

export function ContactPage() {
    useEffect(() => {
        document.title = 'Contact Us | Green Africa Farm – Phone, Email & Location';
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', 'Contact Green Africa Farm in Addis Ababa, Ethiopia. Call us at 0928704040, email info@greenafricafarms.com, or visit our farm by appointment.');
    }, []);

    return (
        <div className="min-h-screen bg-[#FAF8F3] py-12 px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="font-serif text-4xl md:text-5xl text-[#0F2E1C]">Get in Touch</h1>
                    <p className="text-[#6D4C41] text-lg max-w-2xl mx-auto">
                        We'd love to hear from you. Reach out to us for any inquiries about our produce or farming practices.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center space-y-4 hover:shadow-md transition-shadow"
                    >
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#2E7D32]">
                            <Phone className="h-8 w-8" />
                        </div>
                        <h3 className="font-serif text-2xl text-[#0F2E1C]">Call Us</h3>
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-stone-600">0928704040</p>
                            <p className="text-lg font-medium text-stone-600">+251 946 456 040</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center space-y-4 hover:shadow-md transition-shadow"
                    >
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#2E7D32]">
                            <MapPin className="h-8 w-8" />
                        </div>
                        <h3 className="font-serif text-2xl text-[#0F2E1C]">Visit Our Farm</h3>
                        <p className="text-lg font-medium text-stone-600">
                            Addis Ababa, Ethiopia<br />
                            Open for visits by appointment
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center space-y-4 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1"
                    >
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#2E7D32]">
                            <Mail className="h-8 w-8" />
                        </div>
                        <h3 className="font-serif text-2xl text-[#0F2E1C]">Email Us</h3>
                        <p className="text-lg font-medium text-stone-600">info@greenafricafarms.com</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
