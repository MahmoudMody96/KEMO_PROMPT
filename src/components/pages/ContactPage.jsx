// src/components/pages/ContactPage.jsx
//
// Rebuilt on the shared identity layer.
//
// Content corrections: the old page advertised a "Live Chat — available
// 9 AM–9 PM" that does not exist anywhere in the product, and a "usually within
// 2 hours" response time that is a service commitment nobody measured. Both are
// gone. Email is the one channel that actually works, so it is the only one
// listed.
//
// The form still hands off to the user's mail client — there is no /api/contact
// endpoint, and a form that silently discards the message is worse than no form.

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Mail, Send, MessageSquare } from 'lucide-react';

const SUPPORT_EMAIL = 'support@kemoengine.com';

const ContactPage = () => {
    const { language } = useAppContext();
    const isAr = language === 'ar';
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [handedOff, setHandedOff] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = form.subject || (isAr ? 'استفسار' : 'Enquiry');
        const body = [
            `${isAr ? 'الاسم' : 'Name'}: ${form.name}`,
            `${isAr ? 'البريد' : 'Email'}: ${form.email}`,
            '',
            form.message,
        ].join('\n');
        window.location.href =
            `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setHandedOff(true);
        setTimeout(() => setHandedOff(false), 5000);
    };

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const fields = [
        { id: 'contact-name', k: 'name', type: 'text', ac: 'name', en: 'Name', ar: 'الاسم' },
        { id: 'contact-email', k: 'email', type: 'email', ac: 'email', en: 'Email', ar: 'البريد الإلكتروني' },
        { id: 'contact-subject', k: 'subject', type: 'text', ac: 'off', en: 'Subject', ar: 'الموضوع' },
    ];

    return (
        <div className="mx-auto w-full max-w-3xl pb-16">
            <section className="ambient rounded-[28px] border border-border px-6 py-14 text-center md:py-16">
                <span className="section-eyebrow rise" style={{ '--i': 0 }}>
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                    {isAr ? 'تواصل' : 'Contact'}
                </span>
                <h1 className="rise mt-6 text-[clamp(1.875rem,1.4rem+2.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-text1" style={{ '--i': 1 }}>
                    {isAr ? 'ابعتلنا' : 'Get in touch'}
                </h1>
                <p className="section-sub rise mx-auto mt-4" style={{ '--i': 2 }}>
                    {isAr
                        ? 'عندك سؤال أو لقيت مشكلة؟ ابعتلنا على البريد وهنشوفها.'
                        : 'A question, or something broken? Email us and we will look at it.'}
                </p>
                <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="press focus-ring touch-target mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-text1 transition-colors hover:border-[var(--brand-border-strong)]"
                >
                    <Mail className="h-4 w-4" style={{ color: 'var(--brand-fg)' }} aria-hidden="true" />
                    <span dir="ltr">{SUPPORT_EMAIL}</span>
                </a>
            </section>

            <section className="surface-card mt-4 p-6 md:p-8">
                <h2 className="section-title text-xl">{isAr ? 'أو استخدم النموذج' : 'Or use the form'}</h2>
                <p className="mt-2 text-xs text-muted">
                    {isAr
                        ? 'النموذج بيجهّز الرسالة ويفتحها في برنامج البريد بتاعك — عشان تفضل نسخة عندك.'
                        : 'This composes the message and opens it in your mail app, so you keep a copy.'}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {fields.slice(0, 2).map((f) => (
                            <div key={f.id}>
                                <label htmlFor={f.id} className="mb-1.5 block text-xs font-medium text-text2">
                                    {isAr ? f.ar : f.en}
                                </label>
                                <input
                                    id={f.id}
                                    type={f.type}
                                    autoComplete={f.ac}
                                    value={form[f.k]}
                                    onChange={set(f.k)}
                                    required
                                    dir="auto"
                                    className="h-11 w-full rounded-xl border border-border bg-[var(--bg-input)] px-3 text-sm text-text1 outline-none transition-colors focus:border-[var(--brand-border-strong)]"
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-medium text-text2">
                            {isAr ? 'الموضوع' : 'Subject'}
                        </label>
                        <input
                            id="contact-subject"
                            type="text"
                            value={form.subject}
                            onChange={set('subject')}
                            dir="auto"
                            className="h-11 w-full rounded-xl border border-border bg-[var(--bg-input)] px-3 text-sm text-text1 outline-none transition-colors focus:border-[var(--brand-border-strong)]"
                        />
                    </div>

                    <div>
                        <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium text-text2">
                            {isAr ? 'الرسالة' : 'Message'}
                        </label>
                        <textarea
                            id="contact-message"
                            value={form.message}
                            onChange={set('message')}
                            required
                            rows={5}
                            dir="auto"
                            className="w-full resize-none rounded-xl border border-border bg-[var(--bg-input)] p-3 text-sm text-text1 outline-none transition-colors focus:border-[var(--brand-border-strong)]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="press focus-ring touch-target inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold on-brand text-white transition-opacity hover:opacity-90 sm:w-auto"
                        style={{ background: 'linear-gradient(135deg, var(--cta-1), var(--cta-2))' }}
                    >
                        {handedOff
                            ? (isAr ? 'افتح برنامج البريد وابعت' : 'Opening your mail app…')
                            : <>{isAr ? 'تجهيز الرسالة' : 'Compose message'} <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" /></>}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default ContactPage;
