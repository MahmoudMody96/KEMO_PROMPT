// src/components/pages/ContactPage.jsx
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Mail, MessageSquare, Send, MapPin, Clock, ArrowRight } from 'lucide-react';

const ContactPage = () => {
    const { language, isRTL } = useAppContext();
    const isAr = language === 'ar';
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    const channels = [
        { icon: Mail, titleEn: 'Email', titleAr: 'البريد الإلكتروني', valueEn: 'support@kemoengine.com', valueAr: 'support@kemoengine.com', color: '#3b82f6' },
        { icon: MessageSquare, titleEn: 'Live Chat', titleAr: 'محادثة مباشرة', valueEn: 'Available 9 AM - 9 PM', valueAr: 'متاح ٩ ص - ٩ م', color: '#22c55e' },
        { icon: Clock, titleEn: 'Response Time', titleAr: 'وقت الاستجابة', valueEn: 'Usually within 2 hours', valueAr: 'عادة خلال ساعتين', color: '#f59e0b' },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto pb-10" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Hero */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-bold text-blue-300">{isAr ? 'تواصل معنا' : 'CONTACT US'}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-text1 mb-3">
                    {isAr ? 'نحن هنا لمساعدتك' : 'We\'re Here to Help'}
                </h1>
                <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                    {isAr ? 'لديك سؤال أو اقتراح؟ فريقنا جاهز للرد عليك.' : 'Have a question or suggestion? Our team is ready to help.'}
                </p>
            </div>

            {/* Support Channels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                {channels.map((ch, i) => (
                    <div key={i} className="text-center p-4 rounded-xl" style={{ background: `${ch.color}08`, border: `1px solid ${ch.color}15` }}>
                        <ch.icon className="w-6 h-6 mx-auto mb-2" style={{ color: ch.color }} />
                        <p className="text-xs font-bold text-text1 mb-0.5">{isAr ? ch.titleAr : ch.titleEn}</p>
                        <p className="text-[11px] text-zinc-400">{isAr ? ch.valueAr : ch.valueEn}</p>
                    </div>
                ))}
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--overlay-2)', border: '1px solid var(--border-color)' }}>
                <h2 className={`text-base font-bold text-text1 mb-4 ${isRTL ? 'text-right' : ''}`}>
                    {isAr ? 'أرسل لنا رسالة' : 'Send us a Message'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-xs text-zinc-400 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                                {isAr ? 'الاسم' : 'Name'}
                            </label>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full h-10 rounded-xl text-sm text-text1 px-3"
                                style={{ background: 'var(--overlay-4)', border: '1px solid var(--border-color)' }}
                                placeholder={isAr ? 'اكتب اسمك' : 'Your name'} />
                        </div>
                        <div>
                            <label className={`block text-xs text-zinc-400 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                                {isAr ? 'البريد الإلكتروني' : 'Email'}
                            </label>
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full h-10 rounded-xl text-sm text-text1 px-3"
                                style={{ background: 'var(--overlay-4)', border: '1px solid var(--border-color)' }}
                                placeholder={isAr ? 'بريدك الإلكتروني' : 'your@email.com'} />
                        </div>
                    </div>
                    <div>
                        <label className={`block text-xs text-zinc-400 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                            {isAr ? 'الموضوع' : 'Subject'}
                        </label>
                        <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            className="w-full h-10 rounded-xl text-sm text-zinc-300 px-3"
                            style={{ background: 'var(--overlay-4)', border: '1px solid var(--border-color)' }}
                            placeholder={isAr ? 'موضوع الرسالة' : 'Subject'} />
                    </div>
                    <div>
                        <label className={`block text-xs text-zinc-400 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                            {isAr ? 'الرسالة' : 'Message'}
                        </label>
                        <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                            className="w-full h-28 rounded-xl text-sm text-zinc-300 p-3 resize-none"
                            style={{ background: 'var(--overlay-4)', border: '1px solid var(--border-color)' }}
                            placeholder={isAr ? 'اكتب رسالتك...' : 'Write your message...'} />
                    </div>
                    <button type="submit"
                        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 ${isRTL ? 'flex-row-reverse' : ''}`}
                        style={{ background: sent ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                        {sent ? (
                            <>{isAr ? '✅ تم الإرسال!' : '✅ Sent!'}</>
                        ) : (
                            <><Send className="w-4 h-4" /> {isAr ? 'إرسال الرسالة' : 'Send Message'}</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
