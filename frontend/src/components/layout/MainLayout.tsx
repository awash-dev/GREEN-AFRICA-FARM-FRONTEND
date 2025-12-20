import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const location = useLocation();
    const isAdmin = location.pathname === '/admin';

    return (
        <div className="min-h-screen flex flex-col font-sans antialiased">
            {!isAdmin && <Navbar />}
            <main className={`flex-1 ${isAdmin ? 'p-0 max-w-none' : 'container mx-auto px-4 py-8'}`}>
                {children}
            </main>
            {!isAdmin && <Footer />}
        </div>
    );
}
