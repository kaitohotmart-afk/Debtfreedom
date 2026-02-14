'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, MessageCircle, Heart, Shield, Download, ExternalLink } from 'lucide-react';
import SuccessStories from '@/components/app/SuccessStories';
import ResourceLibrary from '@/components/app/ResourceLibrary';
import WhatsAppSupport from '@/components/app/WhatsAppSupport';
import { useLanguage } from '@/contexts/LanguageContext';
import CommunityGuidelines from '@/components/app/CommunityGuidelines';

export default function CommunityPage() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'stories' | 'resources' | 'chat' | 'guidelines'>('stories');

    const tabs = [
        { id: 'stories', label: t('community.tabs.stories', 'Success Stories'), icon: Heart },
        { id: 'resources', label: t('community.tabs.resources', 'Resource Library'), icon: BookOpen },
        { id: 'chat', label: t('community.tabs.chat', 'WhatsApp Support'), icon: MessageCircle },
        { id: 'guidelines', label: t('community.tabs.guidelines', 'Guidelines'), icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {t('community.title', 'Community & Support')}
                    </h1>
                    <p className="text-zinc-400">
                        {t('community.subtitle', 'You are not alone. Connect, learn, and grow with others on the same journey.')}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                                    : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="min-h-[500px]">
                    {activeTab === 'stories' && <SuccessStories />}
                    {activeTab === 'resources' && <ResourceLibrary />}
                    {activeTab === 'chat' && <WhatsAppSupport />}
                    {activeTab === 'guidelines' && <CommunityGuidelines />}
                </div>
            </div>
        </div>
    );
}
