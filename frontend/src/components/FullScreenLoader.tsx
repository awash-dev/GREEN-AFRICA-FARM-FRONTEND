import { ThreeCircles } from 'react-loader-spinner';
import { motion } from 'framer-motion';

export function FullScreenLoader() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#FAF8F3]/80 backdrop-blur-md"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                <ThreeCircles
                    visible={true}
                    height="100"
                    width="100"
                    color="#4fa94d"
                    ariaLabel="three-circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 font-serif text-xl font-bold text-[#0F2E1C] tracking-wide"
            >
                Gathering the Harvest...
            </motion.p>
        </motion.div>
    );
}
