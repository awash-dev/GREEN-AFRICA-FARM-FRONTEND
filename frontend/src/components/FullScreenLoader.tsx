import { ThreeCircles } from 'react-loader-spinner';
import { motion, AnimatePresence } from 'framer-motion';

interface FullScreenLoaderProps {
    slow?: boolean;
}

export function FullScreenLoader({ slow = false }: FullScreenLoaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#FAF8F3]/90 backdrop-blur-sm"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                <ThreeCircles
                    visible={true}
                    height="100"
                    width="100"
                    color={slow ? "#f59e0b" : "#10b981"} // amber-500 if slow, else emerald-500
                    ariaLabel="three-circles-loading"
                    innerCircleColor={slow ? "#d97706" : "#059669"}
                    middleCircleColor={slow ? "#fbbf24" : "#34d399"}
                    outerCircleColor={slow ? "#b45309" : "#047857"}
                />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-8 space-y-2 px-6"
            >
                <p className="font-serif text-2xl font-bold text-[#0F2E1C] tracking-wide">
                    Green Africa Farm
                </p>
                <AnimatePresence mode="wait">
                    {slow ? (
                        <motion.p
                            key="slow"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-sm font-bold text-amber-600 uppercase tracking-widest animate-pulse"
                        >
                            Your internet is slow, please wait...
                        </motion.p>
                    ) : (
                        <motion.p
                            key="normal"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-sm font-medium text-emerald-600/80 uppercase tracking-widest animate-pulse"
                        >
                            Loading Freshness...
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
