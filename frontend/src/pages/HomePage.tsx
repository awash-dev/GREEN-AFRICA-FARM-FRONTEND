import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Loader2, ShieldCheck, Zap, Globe, Heart, ArrowRight } from 'lucide-react';
import { api, Product } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { HeroSlider } from '@/components/HeroSlider';

export function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const testimonialRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: testimonialRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await api.getAllProducts({ limit: 4 });
                if (response.success) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return (
        <div className="flex flex-col space-y-20 pb-20 overflow-x-hidden mt-2">
            {/* Hero Section - Naturally */}
            <HeroSlider products={products} loading={loading} className="w-[99%] mx-auto" />

            {/* Features/USP Bar - Contained */}
            <div className="container mx-auto px-4">
                <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { icon: ShieldCheck, title: "100% Organic", desc: "Certified natural farming" },
                        { icon: Zap, title: "Fast Delivery", desc: "Farm to table in 24h" },
                        { icon: Globe, title: "Eco-Friendly", desc: "Sustainable practices" },
                        { icon: Heart, title: "Local Support", desc: "Empowering farmers" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4 p-6 rounded-2xl bg-white shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
                        >
                            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-stone-800">{item.title}</h3>
                                <p className="text-sm text-stone-500 font-medium">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </section>
            </div>

            {/* Our Products Section - Soft Organic Transition */}
            <section className="py-24 bg-emerald-50/30 rounded-[4rem] relative">
                <div className="container mx-auto px-4 text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-center gap-4 text-emerald-600">
                            <div className="h-px w-12 bg-emerald-200" />
                            <Leaf className="h-5 w-5" />
                            <h2 className="text-4xl md:text-5xl font-black text-stone-800 uppercase tracking-tight">Our Harvest</h2>
                            <Leaf className="h-5 w-5 scale-x-[-1]" />
                            <div className="h-px w-12 bg-emerald-200" />
                        </div>
                        <p className="text-stone-500 font-bold max-w-xl mx-auto">
                            Experience the freshest seasonal produce harvested with love and care directly from our fields.
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                            <p className="font-bold text-stone-400 uppercase tracking-widest text-xs">Gathering the Harvest...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="py-24 text-stone-400 font-bold">
                            No products available currently. Check back soon!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                            {products.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                >
                                    <ProductCard product={product} language="en" />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="pt-8"
                    >
                        <Link to="/products" className="group inline-flex items-center gap-3 px-10 py-4 bg-[#2d6a4f] text-white font-bold rounded-full hover:bg-[#1b4332] transition-all shadow-lg hover:shadow-emerald-900/20">
                            Explore Full Catalog
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Our Testimonials Section - TRULY FULL WIDTH */}
            <section
                ref={testimonialRef}
                className="relative min-h-[85vh] flex items-center justify-center overflow-hidden w-full"
            >
                {/* Parallax Background Image */}
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 w-full h-[140%] -top-[20%]"
                >
                    <img
                        src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover brightness-[0.4]"
                        alt="Background"
                    />
                </motion.div>

                <div className="container mx-auto px-4 md:px-8 relative z-10 py-24">
                    <div className="max-w-4xl mx-auto text-center space-y-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold uppercase tracking-widest backdrop-blur-md">
                                Our Testimonials
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
                                What Our <span className="text-emerald-400 italic">Family</span> Says
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { name: "Sarah J.", role: "Local Chef", text: "The quality of produce is unmatched. My restaurant thrives on the freshness Green Africa brings to our kitchen daily." },
                                { name: "Mark T.", role: "Health Enthusiast", text: "Knowing my vegetables are 100% organic gives me peace of mind. The taste is incredibly vibrant and real." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 * i }}
                                    className="p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/10 text-left space-y-4 shadow-2xl"
                                >
                                    <div className="flex gap-1 text-[#f5bc28]">
                                        {[...Array(5)].map((_, i) => <Zap key={i} className="h-4 w-4 fill-current" strokeWidth={0} />)}
                                    </div>
                                    <p className="text-lg text-stone-200 font-medium italic leading-relaxed">
                                        "{item.text}"
                                    </p>
                                    <div className="pt-4 border-t border-white/10">
                                        <div className="font-bold text-white uppercase tracking-wider">{item.name}</div>
                                        <div className="text-emerald-400 text-xs font-bold uppercase">{item.role}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8"
                        >
                            {[
                                { label: "Happy Clients", value: "5,000+" },
                                { label: "Quality Rating", value: "4.9/5" },
                                { label: "Daily Harvests", value: "100%" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl font-black text-emerald-400">{stat.value}</div>
                                    <div className="text-sm font-bold text-stone-400 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Cinematic Vignette Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-[#1b4332] via-transparent to-transparent opacity-60" />
            </section>
        </div>
    );
}


