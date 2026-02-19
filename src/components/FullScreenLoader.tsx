import { ThreeCircles } from 'react-loader-spinner';
import { motion } from 'framer-motion';

export function FullScreenLoader() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF8F3]/90 backdrop-blur-sm"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                <ThreeCircles
                    visible={true}
                    height="100"
                    width="100"
                    color="#10b981" // emerald-500
                    ariaLabel="three-circles-loading"
                    innerCircleColor="#059669" // emerald-600
                    middleCircleColor="#34d399" // emerald-400
                    outerCircleColor="#047857" // emerald-700
                />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-8 space-y-2"
            >
                <p className="font-serif text-2xl font-bold text-[#0F2E1C] tracking-wide">
                    Green Africa Farm
                </p>
                <p className="text-sm font-medium text-emerald-600/80 uppercase tracking-widest animate-pulse">
                    Loading Freshness...
                </p>
            </motion.div>
        </motion.div>
    );
}
