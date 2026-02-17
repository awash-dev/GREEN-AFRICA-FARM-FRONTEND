import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Leaf, Home } from "lucide-react";
import { useEffect } from "react";

export function OrderSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderId = location.state?.orderId;

    useEffect(() => {
        if (!orderId) {
            navigate('/');
        }
    }, [orderId, navigate]);

    if (!orderId) return null;

    return (
        <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full bg-[#F5F1E8] rounded-4xl md:rounded-[3.5rem] p-8 md:p-20 text-center space-y-8 md:space-y-10 border border-stone-200 shadow-2xl relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <motion.div
                    initial={{ rotate: -15, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 0.1 }}
                    className="absolute -top-10 -left-10 text-[#0F2E1C]"
                >
                    <Leaf className="h-40 w-40" />
                </motion.div>

                <div className="relative space-y-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 text-[#2E7D32]"
                    >
                        <CheckCircle className="h-12 w-12" />
                    </motion.div>

                    <div className="space-y-4">
                        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#0F2E1C]">Harvest Booked!</h1>
                        <p className="text-[#6D4C41] font-medium italic opacity-80 text-lg">
                            Thank you for supporting sustainable farming. Your freshly harvested bounty will be on its way soon.
                        </p>
                    </div>

                    <div className="py-8 px-10 rounded-3xl bg-white border border-stone-100 shadow-sm inline-block mx-auto">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0F2E1C]/40 block mb-2">Order Tracking ID</span>
                        <span className="font-serif text-3xl font-bold text-[#0F2E1C] tracking-widest">{orderId}</span>
                    </div>

                    <div className="pt-8 border-t border-stone-200/50 space-y-6">
                        <p className="text-xs text-[#6D4C41] font-medium max-w-sm mx-auto opacity-70">
                            We've received your request. Our farmers are now selecting the best produce for you. You will receive a call from our delivery partner shortly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#0F2E1C] text-white font-bold rounded-full hover:bg-[#2E7D32] transition-all shadow-xl hover:shadow-[#0F2E1C]/20 uppercase tracking-widest text-xs"
                            >
                                <Home className="h-4 w-4" />
                                Back to Farm
                            </Link>
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-[#0F2E1C] font-bold rounded-full border border-stone-200 hover:bg-[#F5F1E8] transition-all uppercase tracking-widest text-xs"
                            >
                                Buy More Harvest
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Bottom */}
                <div className="absolute -bottom-10 -right-10 text-[#2E7D32] opacity-[0.05]">
                    <Leaf className="h-40 w-40 scale-x-[-1]" />
                </div>
            </motion.div>
        </div>
    );
}
