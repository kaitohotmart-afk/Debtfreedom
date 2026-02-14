"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget() {
    return (
        <motion.a
            href="https://wa.me/27123456789?text=Hi,%20I%20have%20questions%20about%20Debt%20Freedom%20Reset"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, type: "spring" }}
            className="fixed bottom-24 right-6 z-40 md:bottom-8 md:right-8 group"
        >
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-black px-3 py-1 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
                Chat with an Expert
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45" />
            </div>

            <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer relative">
                <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />
                <MessageCircle className="w-8 h-8 text-white fill-white" />
            </div>
        </motion.a>
    );
}
