"use client";

import { motion } from "framer-motion";
import { Circle, Zap, ArrowRight, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../contexts/ThemeContext";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
    isDark = true,
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
    isDark?: boolean;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2",
                        isDark 
                            ? "border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]"
                            : "border-gray-300/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        isDark
                            ? "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                            : "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function HeroGeometric({
    badge = "NoteMaster",
    title1 = "Your Ideas,",
    title2 = "Beautifully Organized",
    onGetStarted,
    onViewDemo,
}: {
    badge?: string;
    title1?: string;
    title2?: string;
    onGetStarted?: () => void;
    onViewDemo?: () => void;
}) {
    const { isDark } = useTheme();
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <div className={cn(
            "relative min-h-screen w-full flex items-center justify-center overflow-hidden",
            isDark ? "bg-[#030303]" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
        )}>
            <div className={cn(
                "absolute inset-0 blur-3xl",
                isDark 
                    ? "bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05]"
                    : "bg-gradient-to-br from-blue-200/30 via-transparent to-purple-200/30"
            )} />

            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-indigo-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                    isDark={isDark}
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-rose-500/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                    isDark={isDark}
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-violet-500/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                    isDark={isDark}
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-amber-500/[0.15]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                    isDark={isDark}
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-cyan-500/[0.15]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                    isDark={isDark}
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 md:mb-12",
                            isDark 
                                ? "bg-white/[0.03] border border-white/[0.08]"
                                : "bg-blue-100/80 border border-blue-200/50"
                        )}
                    >
                        <Circle className="h-2 w-2 fill-rose-500/80" />
                        <span className={cn(
                            "text-sm tracking-wide",
                            isDark ? "text-white/60" : "text-blue-800"
                        )}>
                            {badge}
                        </span>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                            <span className={cn(
                                "bg-clip-text text-transparent",
                                isDark 
                                    ? "bg-gradient-to-b from-white to-white/80"
                                    : "bg-gradient-to-b from-gray-900 to-gray-700"
                            )}>
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent",
                                    isDark
                                        ? "bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300"
                                        : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                                )}
                            >
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className={cn(
                            "text-base sm:text-lg md:text-xl mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4",
                            isDark ? "text-white/40" : "text-gray-600"
                        )}>
                            Transform your thoughts into organized, searchable, and secure notes. 
                            Experience the perfect blend of simplicity and powerful features.
                        </p>
                    </motion.div>

                    <motion.div
                        custom={3}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
                    >
                        <button
                            onClick={onGetStarted}
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                        >
                            <Zap className="w-5 h-5 mr-2" />
                            Start Taking Notes
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <button
                            onClick={onViewDemo}
                            className={cn(
                                "group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300",
                                isDark
                                    ? "text-white/80 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15]"
                                    : "text-gray-700 bg-white/80 border border-gray-200 hover:bg-white hover:border-gray-300 shadow-lg hover:shadow-xl"
                            )}
                        >
                            <BookOpen className="w-5 h-5 mr-2" />
                            View Demo
                        </button>
                    </motion.div>
                </div>
            </div>

            <div className={cn(
                "absolute inset-0 bg-gradient-to-t via-transparent pointer-events-none",
                isDark 
                    ? "from-[#030303] to-[#030303]/80"
                    : "from-white to-white/80"
            )} />
        </div>
    );
}

export { HeroGeometric }