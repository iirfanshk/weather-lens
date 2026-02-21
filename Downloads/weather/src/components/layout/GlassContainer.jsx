import React from 'react';
import { cn } from '../../libs/utils';
import { motion } from 'framer-motion';

const GlassContainer = ({ children, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6",
                "flex flex-col",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassContainer;
