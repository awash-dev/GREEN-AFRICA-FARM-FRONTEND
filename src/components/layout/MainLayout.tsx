import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen flex flex-col font-sans antialiased">
            {!isAdmin && <Navbar />}
            <main className="flex-1 flex flex-col pt-[90px]">
                {children}
            </main>
            {!isAdmin && (
                <>
                    <Footer />
                    {/* Telegram Floating Button */}
                    <motion.a
                        href="https://t.me/Paul939369"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-60 flex items-center gap-2 px-5 py-3 bg-[#0088cc] text-white rounded-full shadow-2xl hover:bg-[#0077b5] transition-colors duration-300"
                    >
                        <MessageCircle className="h-5 w-5 fill-white" />
                        <span className="font-bold text-sm tracking-tight">Chat</span>
                    </motion.a>
                </>
            )}
        </div>
    );
}
