'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    Home,
    Zap,
    Heart,
    DollarSign,
    Phone,
    Briefcase,
    Users,
    FileText,
    MessageCircle,
    ArrowRight,
    CheckCircle2,
    Clock,
    TrendingUp,
    ShoppingBag,
    Smartphone,
    HelpCircle
} from 'lucide-react';

type EmergencyType =
    | 'rent'
    | 'utilities'
    | 'medical'
    | 'job_loss'
    | 'transport'
    | 'debt_collectors'
    | 'other';

type Urgency = 'critical' | 'urgent' | 'high' | 'important';
type Budget = 'zero' | 'minimal' | 'low' | 'moderate';

interface TriageState {
    emergencyType: EmergencyType | null;
    daysUntil: number | null;
    budget: Budget | null;
    urgency: Urgency | null;
}

export default function SOSPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState<'intro' | 'triage' | 'action'>('intro');
    const [triage, setTriage] = useState<TriageState>({
        emergencyType: null,
        daysUntil: null,
        budget: null,
        urgency: null
    });

    const calculateUrgency = (): Urgency => {
        if (!triage.daysUntil) return 'important';
        if (triage.daysUntil <= 2) return 'critical';
        if (triage.daysUntil <= 7) return 'urgent';
        if (triage.daysUntil <= 14) return 'high';
        return 'important';
    };

    const startTriage = () => {
        setStep('triage');
    };

    const completeTriage = () => {
        const urgency = calculateUrgency();
        setTriage({ ...triage, urgency });
        setStep('action');
    };

    if (step === 'intro') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-950 via-zinc-950 to-black flex items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-2xl w-full text-center"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center"
                    >
                        <AlertTriangle className="w-12 h-12 text-white" />
                    </motion.div>

                    <h1 className="text-5xl font-bold text-white mb-4">
                        {t('sos.title')}
                    </h1>
                    <p className="text-zinc-300 text-lg mb-8">
                        {t('sos.subtitle')}
                    </p>

                    <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 mb-8 text-left">
                        <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            {t('sos.warning.title')}
                        </h3>
                        <ul className="text-zinc-300 space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                                {t('sos.warning.list.rent')}
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                                {t('sos.warning.list.utilities')}
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                                {t('sos.warning.list.medical')}
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                                {t('sos.warning.list.job')}
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                                {t('sos.warning.list.collectors')}
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={startTriage}
                        className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-500/50"
                    >
                        {t('sos.start_btn')} →
                    </button>

                    <p className="text-zinc-500 text-xs mt-4">
                        {t('sos.disclaimer')}
                    </p>
                </motion.div>
            </div>
        );
    }

    if (step === 'triage') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-950 via-zinc-950 to-black p-6">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-white mb-2">{t('sos.triage.title')}</h1>
                        <p className="text-zinc-400">{t('sos.triage.subtitle')}</p>
                    </motion.div>

                    <div className="space-y-6">
                        {/* Question 1: Emergency Type */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
                        >
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-red-500" />
                                {t('sos.triage.q1.title')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { id: 'rent', label: t('sos.triage.q1.options.rent'), icon: Home },
                                    { id: 'utilities', label: t('sos.triage.q1.options.utilities'), icon: Zap },
                                    { id: 'medical', label: t('sos.triage.q1.options.medical'), icon: Heart },
                                    { id: 'job_loss', label: t('sos.triage.q1.options.job_loss'), icon: Briefcase },
                                    { id: 'transport', label: t('sos.triage.q1.options.transport'), icon: ShoppingBag },
                                    { id: 'debt_collectors', label: t('sos.triage.q1.options.debt_collectors'), icon: Phone },
                                    { id: 'other', label: t('sos.triage.q1.options.other'), icon: AlertTriangle }
                                ].map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setTriage({ ...triage, emergencyType: id as EmergencyType })}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${triage.emergencyType === id
                                            ? 'border-red-500 bg-red-500/10'
                                            : 'border-zinc-700 hover:border-zinc-600'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 mb-2 ${triage.emergencyType === id ? 'text-red-500' : 'text-zinc-400'}`} />
                                        <p className="text-white text-sm font-medium">{label}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Question 2: Days Until */}
                        {triage.emergencyType && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
                            >
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-orange-500" />
                                    {t('sos.triage.q2.title')}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { days: 1, label: t('sos.triage.q2.options.today'), color: 'red' },
                                        { days: 5, label: t('sos.triage.q2.options.days_3_7'), color: 'orange' },
                                        { days: 10, label: t('sos.triage.q2.options.weeks_1_2'), color: 'yellow' },
                                        { days: 20, label: t('sos.triage.q2.options.weeks_2_plus'), color: 'green' }
                                    ].map(({ days, label, color }) => (
                                        <button
                                            key={days}
                                            onClick={() => setTriage({ ...triage, daysUntil: days })}
                                            className={`p-4 rounded-xl border-2 transition-all ${triage.daysUntil === days
                                                ? `border-${color}-500 bg-${color}-500/10`
                                                : 'border-zinc-700 hover:border-zinc-600'
                                                }`}
                                        >
                                            <p className="text-white text-sm font-medium">{label}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Question 3: Budget */}
                        {triage.daysUntil && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
                            >
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-emerald-500" />
                                    {t('sos.triage.q3.title')}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { id: 'zero', label: t('sos.triage.q3.options.zero'), range: '' },
                                        { id: 'minimal', label: t('sos.triage.q3.options.minimal'), range: '' },
                                        { id: 'low', label: t('sos.triage.q3.options.low'), range: '' },
                                        { id: 'moderate', label: t('sos.triage.q3.options.moderate'), range: '' }
                                    ].map(({ id, label }) => (
                                        <button
                                            key={id}
                                            onClick={() => setTriage({ ...triage, budget: id as Budget })}
                                            className={`p-4 rounded-xl border-2 transition-all ${triage.budget === id
                                                ? 'border-emerald-500 bg-emerald-500/10'
                                                : 'border-zinc-700 hover:border-zinc-600'
                                                }`}
                                        >
                                            <p className="text-white text-sm font-medium">{label}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Submit */}
                        {triage.emergencyType && triage.daysUntil && triage.budget && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <button
                                    onClick={completeTriage}
                                    className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-500/50"
                                >
                                    {t('sos.triage.submit_btn')} →
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Action Plan
    return (
        <ActionPlan triage={triage} />
    );
}

function ActionPlan({ triage }: { triage: TriageState }) {
    const { t } = useLanguage();

    const getUrgencyColor = (urgency: Urgency | null) => {
        switch (urgency) {
            case 'critical': return 'red';
            case 'urgent': return 'orange';
            case 'high': return 'yellow';
            default: return 'green';
        }
    };

    const color = getUrgencyColor(triage.urgency);

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6">
            <div className="max-w-4xl mx-auto">
                {/* Urgency Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-${color}-900/30 border-2 border-${color}-500 rounded-2xl p-6 mb-8`}
                >
                    <div className="flex items-center gap-4">
                        <AlertTriangle className={`w-12 h-12 text-${color}-500`} />
                        <div>
                            <h2 className={`text-2xl font-bold text-${color}-400`}>
                                {triage.urgency === 'critical' && t('sos.plan.urgency.critical')}
                                {triage.urgency === 'urgent' && t('sos.plan.urgency.urgent')}
                                {triage.urgency === 'high' && t('sos.plan.urgency.high')}
                                {triage.urgency === 'important' && t('sos.plan.urgency.important')}
                            </h2>
                            <p className="text-zinc-300">
                                {triage.daysUntil && triage.daysUntil <= 2 && t('sos.plan.action_msg.today')}
                                {triage.daysUntil && triage.daysUntil > 2 && triage.daysUntil <= 7 && t('sos.plan.action_msg.days_few')}
                                {triage.daysUntil && triage.daysUntil > 7 && t('sos.plan.action_msg.days_plan')}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Priority Expenses */}
                <PriorityExpenses triage={triage} />

                {/* Negotiation Scripts */}
                <NegotiationScripts emergencyType={triage.emergencyType} />

                {/* Quick Income Ideas */}
                <QuickIncomeIdeas budget={triage.budget} />

                {/* Community Resources */}
                <CommunityResources />
            </div>
        </div>
    );
}

function PriorityExpenses({ triage }: { triage: TriageState }) {
    const { t } = useLanguage();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 mb-6"
        >
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-red-500" />
                {t('sos.plan.priority.title')}
            </h3>

            <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="text-red-400 font-semibold mb-2">{t('sos.plan.priority.tier_1.title')}</h4>
                    <ul className="text-zinc-300 space-y-1 text-sm">
                        {(t('sos.plan.priority.tier_1.items', { returnObjects: true }) as any as string[]).map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="text-orange-400 font-semibold mb-2">{t('sos.plan.priority.tier_2.title')}</h4>
                    <ul className="text-zinc-300 space-y-1 text-sm">
                        {(t('sos.plan.priority.tier_2.items', { returnObjects: true }) as any as string[]).map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="text-yellow-400 font-semibold mb-2">{t('sos.plan.priority.tier_3.title')}</h4>
                    <ul className="text-zinc-300 space-y-1 text-sm">
                        {(t('sos.plan.priority.tier_3.items', { returnObjects: true }) as any as string[]).map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="border-l-4 border-zinc-600 pl-4">
                    <h4 className="text-zinc-400 font-semibold mb-2">{t('sos.plan.priority.tier_4.title')}</h4>
                    <ul className="text-zinc-300 space-y-1 text-sm">
                        {(t('sos.plan.priority.tier_4.items', { returnObjects: true }) as any as string[]).map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
}

function NegotiationScripts({ emergencyType }: { emergencyType: EmergencyType | null }) {
    const { t } = useLanguage();
    const scripts = {
        rent: {
            title: t('sos.plan.scripts.rent.title', 'Landlord Payment Plan'),
            script: t('sos.plan.scripts.rent.script', 'Hello [Name], I am calling regarding my rent for [Address]...'),
            tips: t('sos.plan.scripts.rent.tips', { returnObjects: true }) as any as string[] || []
        },
        utilities: {
            title: t('sos.plan.scripts.utilities.title', 'Utility Extension Request'),
            script: t('sos.plan.scripts.utilities.script', 'I am a customer at [Account Number]...'),
            tips: t('sos.plan.scripts.utilities.tips', { returnObjects: true }) as any as string[] || []
        }
    };

    const currentScript = emergencyType && scripts[emergencyType as keyof typeof scripts];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 mb-6"
        >
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-blue-500" />
                {t('sos.plan.scripts.title')}
            </h3>

            {currentScript && (
                <div className="bg-zinc-800/50 rounded-xl p-4 mb-4">
                    <h4 className="text-white font-semibold mb-2">{currentScript.title}</h4>
                    <div className="bg-zinc-900 rounded-lg p-4 mb-3">
                        <p className="text-zinc-300 text-sm italic">"{currentScript.script}"</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-zinc-400 text-xs font-semibold">{t('sos.plan.scripts.tips_label')}</p>
                        {Array.isArray(currentScript.tips) && currentScript.tips.map((tip, i) => (
                            <p key={i} className="text-zinc-400 text-xs flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" />
                                {tip}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-zinc-500 text-xs">{t('sos.plan.scripts.more_link')}</p>
        </motion.div>
    );
}

function QuickIncomeIdeas({ budget }: { budget: Budget | null }) {
    const { t } = useLanguage();
    const ideas = [
        {
            title: t('sos.plan.income.ideas.sell.title'),
            earnings: t('sos.plan.income.ideas.sell.earnings'),
            time: t('sos.plan.income.ideas.sell.time'),
            platform: t('sos.plan.income.ideas.sell.platform'),
            icon: ShoppingBag
        },
        {
            title: t('sos.plan.income.ideas.delivery.title'),
            earnings: t('sos.plan.income.ideas.delivery.earnings'),
            time: t('sos.plan.income.ideas.delivery.time'),
            platform: t('sos.plan.income.ideas.delivery.platform'),
            icon: Briefcase
        },
        {
            title: t('sos.plan.income.ideas.jobs.title'),
            earnings: t('sos.plan.income.ideas.jobs.earnings'),
            time: t('sos.plan.income.ideas.jobs.time'),
            platform: t('sos.plan.income.ideas.jobs.platform'),
            icon: TrendingUp
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 mb-6"
        >
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
                {t('sos.plan.income.title')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ideas.map((idea, i) => (
                    <div key={i} className="bg-zinc-800/50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                <idea.icon className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h4 className="text-white font-semibold text-sm">{idea.title}</h4>
                        </div>
                        <div className="space-y-2 text-xs">
                            <p className="text-emerald-400">💰 {idea.earnings}</p>
                            <p className="text-zinc-400">⏱️ {idea.time}</p>
                            <p className="text-zinc-500">{idea.platform}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function CommunityResources() {
    const { t } = useLanguage();
    const resources = [
        {
            title: t('sos.plan.community.resources.sassa.title'),
            description: t('sos.plan.community.resources.sassa.desc'),
            contact: '0800 60 10 11',
            icon: Users
        },
        {
            title: t('sos.plan.community.resources.ncr.title'),
            description: t('sos.plan.community.resources.ncr.desc'),
            contact: '0860 627 627',
            icon: Phone
        },
        {
            title: t('sos.plan.community.resources.mental.title'),
            description: t('sos.plan.community.resources.mental.desc'),
            contact: '0800 567 567',
            icon: Heart
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
        >
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-500" />
                {t('sos.plan.community.title')}
            </h3>

            <div className="space-y-3">
                {resources.map((resource, i) => (
                    <div key={i} className="bg-zinc-800/50 rounded-xl p-4 flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <resource.icon className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-semibold">{resource.title}</h4>
                            <p className="text-zinc-400 text-sm mb-2">{resource.description}</p>
                            <a href={`tel:${resource.contact.replace(/\s/g, '')}`} className="text-purple-400 text-sm font-mono hover:text-purple-300">
                                📞 {resource.contact}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
