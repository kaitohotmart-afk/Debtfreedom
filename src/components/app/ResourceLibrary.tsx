'use client';

import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink, Calculator, Shield } from 'lucide-react';

export default function ResourceLibrary() {
    const resources = [
        {
            category: "Budgeting Tools",
            items: [
                { title: "Monthly Budget Spreadsheet", type: "Excel", size: "2.4 MB", icon: Calculator },
                { title: "Envelope System Tracker", type: "PDF", size: "1.2 MB", icon: FileText },
                { title: "Debt Snowball Calculator", type: "Excel", size: "1.8 MB", icon: Calculator },
            ]
        },
        {
            category: "Negotiation Templates",
            items: [
                { title: "Creditor Hardship Letter", type: "Word", size: "500 KB", icon: FileText },
                { title: "Debt Review Cancellation", type: "PDF", size: "800 KB", icon: FileText },
                { title: "Prescribed Debt Dispute", type: "Word", size: "450 KB", icon: FileText },
            ]
        },
        {
            category: "Educational Guides",
            items: [
                { title: "Understanding Grants (SASSA)", type: "PDF", size: "3.5 MB", icon: Shield },
                { title: "Your Rights Under NCA", type: "PDF", size: "5.1 MB", icon: Shield },
                { title: "Credit Score Repair Guide", type: "PDF", size: "2.8 MB", icon: FileText },
            ]
        }
    ];

    return (
        <div className="space-y-8">
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Downloadable Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((category, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="text-purple-400 font-semibold uppercase tracking-wider text-sm">
                                {category.category}
                            </h3>
                            <div className="space-y-3">
                                {category.items.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 5 }}
                                        className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group cursor-pointer border border-transparent hover:border-zinc-700"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{item.title}</p>
                                                <p className="text-zinc-500 text-xs">{item.type} • {item.size}</p>
                                            </div>
                                        </div>
                                        <Download className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 rounded-2xl p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Need Professional Help?</h3>
                        <p className="text-zinc-400 text-sm max-w-xl">
                            While we provide tools for self-help, some situations require professional intervention.
                            Find a registered Debt Counselor via the National Credit Regulator (NCR).
                        </p>
                    </div>
                    <a
                        href="https://www.ncr.org.za/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors font-medium whitespace-nowrap"
                    >
                        Visit NCR Website
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}
