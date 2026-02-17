// src/components/pages/AboutPage.jsx
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Sparkles, Target, Users, Zap, Globe, Award } from 'lucide-react';

const AboutPage = () => {
    const { language, isRTL } = useAppContext();
    const isAr = language === 'ar';

    const values = [
        { icon: Sparkles, titleEn: 'AI-First Innovation', titleAr: 'ابتكار بالذكاء الاصطناعي', descEn: 'We build cutting-edge AI tools that empower creators worldwide.', descAr: 'نبني أدوات ذكاء اصطناعي متطورة تمكّن صنّاع المحتوى حول العالم.', color: '#818cf8' },
        { icon: Target, titleEn: 'Mission-Driven', titleAr: 'مدفوعون بالرسالة', descEn: 'Making professional content creation accessible to everyone.', descAr: 'جعل إنشاء المحتوى الاحترافي متاحاً للجميع.', color: '#f59e0b' },
        { icon: Users, titleEn: 'Community First', titleAr: 'المجتمع أولاً', descEn: 'Built with feedback from thousands of content creators.', descAr: 'مبني بملاحظات آلاف صنّاع المحتوى.', color: '#22c55e' },
        { icon: Zap, titleEn: 'Speed & Quality', titleAr: 'السرعة والجودة', descEn: 'Enterprise-grade results in seconds, not hours.', descAr: 'نتائج بمستوى المؤسسات في ثوانٍ وليس ساعات.', color: '#3b82f6' },
    ];

    const stats = [
        { num: '10K+', labelEn: 'Active Users', labelAr: 'مستخدم نشط' },
        { num: '500K+', labelEn: 'Prompts Generated', labelAr: 'برومبت تم توليده' },
        { num: '50+', labelEn: 'Countries', labelAr: 'دولة' },
        { num: '99.9%', labelEn: 'Uptime', labelAr: 'وقت التشغيل' },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto pb-10" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Hero */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-300">{isAr ? 'عنّا' : 'ABOUT US'}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                    {isAr ? 'نصنع مستقبل المحتوى بالذكاء الاصطناعي' : 'Building the Future of AI Content'}
                </h1>
                <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                    {isAr
                        ? 'Kemo Engine هي منصة متكاملة لإنشاء المحتوى بالذكاء الاصطناعي — من الفكرة إلى الإنتاج.'
                        : 'Kemo Engine is an all-in-one AI content creation platform — from idea to production.'}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                {stats.map((s, i) => (
                    <div key={i} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{s.num}</p>
                        <p className="text-xs text-zinc-500 mt-1">{isAr ? s.labelAr : s.labelEn}</p>
                    </div>
                ))}
            </div>

            {/* Values */}
            <h2 className={`text-lg font-bold text-white mb-4 ${isRTL ? 'text-right' : ''}`}>
                {isAr ? 'قيمنا' : 'Our Values'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {values.map((v, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl transition-all hover:translate-y-[-2px] ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                        style={{ background: `${v.color}08`, border: `1px solid ${v.color}15` }}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${v.color}15` }}>
                            <v.icon className="w-5 h-5" style={{ color: v.color }} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1">{isAr ? v.titleAr : v.titleEn}</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">{isAr ? v.descAr : v.descEn}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Team CTA */}
            <div className="text-center p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.15)' }}>
                <Award className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-2">
                    {isAr ? 'انضم إلى فريقنا' : 'Join Our Team'}
                </h3>
                <p className="text-xs text-zinc-400 mb-4 max-w-sm mx-auto">
                    {isAr ? 'نبحث دائماً عن مواهب استثنائية في الهندسة والتصميم والذكاء الاصطناعي.' : 'We\'re always looking for exceptional talent in engineering, design, and AI.'}
                </p>
                <button className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity">
                    {isAr ? 'تصفح الوظائف' : 'View Open Positions'}
                </button>
            </div>
        </div>
    );
};

export default AboutPage;
