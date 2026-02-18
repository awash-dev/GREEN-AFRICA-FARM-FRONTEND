import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { api, TeamMember } from '../services/api';
import { FullScreenLoader } from '@/components/FullScreenLoader';

export default function About() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await api.getTeamMembers();
                if (res.success) {
                    setTeam(res.data);
                }
            } catch (err) {
                console.error("Error fetching team:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    if (loading) {
        return <FullScreenLoader />;
    }

    return (
        <div className="flex flex-col bg-white overflow-x-hidden min-h-screen pt-4 md:pt-8">

            {/* 1. Main Content - Split Layout */}
            <section className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* LEFT COLUMN: Leader Image & Info */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {team.length > 0 ? (
                            <div className="relative group">
                                <div className="absolute inset-0 bg-emerald-500/10 rotate-3 rounded-[2.5rem] scale-105 blur-2xl transition-all duration-500 group-hover:rotate-6 group-hover:opacity-70" />
                                <div className="relative w-full max-w-[450px] aspect-square rounded-4xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white mx-auto lg:mx-0">
                                    {team[0].image_base64 ? (
                                        <img
                                            src={team[0].image_base64}
                                            alt={team[0].name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                                            <User className="w-24 h-24 text-stone-300" />
                                        </div>
                                    )}

                                    {/* Name Badge */}
                                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
                                        <div className="font-serif text-xl font-bold text-[#0F2E1C]">{team[0].name}</div>
                                        <div className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{team[0].role}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full min-h-[300px] border-2 border-dashed border-stone-200 rounded-[2.5rem] bg-stone-50">
                                <div className="text-center space-y-2">
                                    <User className="w-12 h-12 text-stone-300 mx-auto" />
                                    <p className="text-stone-500 font-medium">No team members found</p>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* RIGHT COLUMN: Mission & Vision */}
                    <div className="space-y-10 lg:space-y-14">
                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Our Vision
                            </div>
                            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone-800 leading-tight">
                                Cultivating a <span className="text-emerald-600 italic">Greener</span> Future for Ethiopia.
                            </h2>
                            <p className="text-base md:text-lg text-stone-600 leading-relaxed">
                                To pioneer a climate-resilient Ethiopia where organic agriculture restores our historical highlands and fuels every community's long-term health and prosperity. We aim to be the nation's leading model for sustainable restoration.
                            </p>
                        </motion.div>

                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="p-8 md:p-12 bg-[#F5F1E8] rounded-[2.5rem] border border-stone-100 relative overflow-hidden shadow-sm"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-stone-200 text-stone-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Our Mission
                                </div>
                                <h3 className="font-serif text-2xl md:text-3xl font-bold text-stone-800">Nourish, Educate, Restore.</h3>
                                <p className="text-stone-600 leading-relaxed text-sm md:text-base">
                                    To nourish Ethiopia naturally by producing <span className="text-emerald-700 font-bold underline decoration-emerald-200 decoration-4 underline-offset-4">100% chemical-free</span> organic produce. We are committed to educating our farmers through the synergy of ancestral wisdom and modern ecological science.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Core Values - Optimized Grid */}
            <section className="py-20 md:py-32 bg-stone-50/50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-4"
                    >
                        <span className="text-stone-400 text-[10px] font-black uppercase tracking-[0.3em]">● Guiding Principles</span>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone-800">Our Core Values</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { value: "100% Natural", icon: "🌱", desc: "Producing nutrition without any chemical or synthetic interventions, following Ethiopian tradition." },
                            { value: "Eco Verified", icon: "🌍", desc: "Strict adherence to protecting our local Ethiopian biodiversity and soil health." },
                            { value: "Community Focus", icon: "🤝", desc: "Empowering and educating small-holder farmers across our Ethiopian regions." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                whileHover={{ y: -8 }}
                                className="p-10 rounded-3xl border border-stone-200/50 bg-white shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500 text-center"
                            >
                                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mb-8 mx-auto">
                                    {item.icon}
                                </div>
                                <h4 className="font-serif text-xl font-bold text-stone-800 mb-4">{item.value}</h4>
                                <p className="text-stone-500 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
