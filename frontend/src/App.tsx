import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AnimatePresence, motion } from 'framer-motion';

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const ProductsPage = lazy(() => import('@/pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const AdminPage = lazy(() => import('@/pages/AdminPage').then(m => ({ default: m.AdminPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const About = lazy(() => import('@/pages/About'));
const CartPage = lazy(() => import('@/pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));

function AppRoutes() {
  const location = useLocation();
  return (
    <MainLayout>
      <Suspense fallback={<FullScreenLoader />}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </MainLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LanguageProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
