import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { api, TeamMember } from '../services/api';

export default function About() {
    const [team, setTeam] = useState<TeamMember[]>([]);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await api.getTeamMembers();
                if (res.success) {
                    setTeam(res.data);
                }
            } catch (err) {
                console.error("Error fetching team:", err);
            }
        };
        fetchTeam();
    }, []);

    return (
        <div className="flex flex-col bg-white overflow-x-hidden min-h-screen pt-3">

            {/* 1. Main Content - Split Layout */}
            <section className="container mx-auto px-4 flex items-center py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* LEFT COLUMN: Leader Image & Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {team.length > 0 ? (
                            <div className="relative group">
                                <div className="absolute inset-0 rotate-6 scale-[1.02] opacity-50 blur-xl transition-all duration-500 group-hover:rotate-3 group-hover:opacity-70" />
                                <div className="relative w-[400px] h-[400px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white mx-auto lg:mx-0">
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


                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-stone-500">No team members found</p>
                            </div>
                        )}
                    </motion.div>

                    {/* RIGHT COLUMN: Mission & Vision */}
                    <div className="space-y-8 lg:pt-0">
                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Our Vision
                            </div>
                            <h2 className="text-4xl lg:text-2xl font-black text-stone-800 leading-tight">
                                Cultivating a <span className="text-emerald-600">Greener</span> Future for Africa.
                            </h2>
                            <p className="text-lg text-stone-600 leading-relaxed font-medium">
                                To pioneer a climate-resilient Africa where organic agriculture restores the land and fuels every community's long-term health and prosperity. We aim to be the continent's leading model for sustainable restoration.
                            </p>
                        </motion.div>

                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                            <div className="relative z-10 space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-widest">
                                    Our Mission
                                </div>
                                <h3 className="text-2xl font-black text-stone-800">Nourish, Educate, Restore.</h3>
                                <p className="text-stone-600 leading-relaxed">
                                    To nourish Africa naturally by producing <span className="text-emerald-700 font-bold">100% chemical-free</span> organic produce and distributing high-value seedlings. We are committed to educating farmers through ancestral wisdom combined with modern ecological restoration.
                                </p>
                            </div>
                        </motion.div>


                    </div>
                </div>
            </section>

            {/* 3. Core Values / Goals - Optimized Grid for Mobile/Desktop */}
            <section className="py-12 md:py-20 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-[25px] font-black text-stone-800 uppercase tracking-tight">Core Values</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                        {[
                            { value: "100% Natural", desc: "Producing nutrition without any chemical or synthetic interventions." },
                            { value: "Eco Verified", desc: "Strict adherence to protecting local biodiversity and soil health." },
                            { value: "Community Focus", desc: "Empowering and educating small-holder farmers across Africa." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 md:p-10 rounded-2xl border border-stone-50 bg-stone-50/20 flex flex-col items-center text-center hover:bg-emerald-50/30 transition-colors duration-300"
                            >
                                <h4 className="text-[20px] font-black text-emerald-600 mb-2 md:mb-4 uppercase tracking-tight">{item.value}</h4>
                                <p className="text-[17px] text-stone-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
