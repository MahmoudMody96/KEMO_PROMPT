# 🚀 PromptForge — دليل الإطلاق (Deployment Guide)

## المتطلبات
- حساب [GitHub](https://github.com)
- حساب [Vercel](https://vercel.com) (مجاني)
- حساب [Supabase](https://supabase.com) (مجاني)
- مفتاح [OpenRouter](https://openrouter.ai/keys) (موجود عندك)

---

## الخطوة 0: تثبيت Supabase SDK

```powershell
cd d:\MAHMOUD\projects\prompt_gen
npm install @supabase/supabase-js
```

---

## الخطوة 1: إعداد Supabase

1. ادخل على [supabase.com](https://supabase.com) → **New Project**
2. اختر اسم للمشروع (مثلاً: `promptforge`) والباسورد
3. انتظر لحد ما المشروع يتجهز (دقيقة تقريباً)
4. روح **SQL Editor** → **New Query**
5. انسخ محتوى ملف `server/schema.sql` والصقه → **Run**
6. روح **Settings** → **API** وانسخ:
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public key** → `eyJ...`

### (اختياري) تفعيل Google Login:
1. روح **Authentication** → **Providers** → **Google**
2. Enable → حط الـ Client ID والـ Secret من [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

---

## الخطوة 2: رفع الكود على GitHub

```powershell
cd d:\MAHMOUD\projects\prompt_gen

# تهيئة Git (لو مش متعمل)
git init

# إضافة كل الملفات
git add .

# أول commit
git commit -m "🚀 PromptForge v1.0 — ready for deployment"

# إنشاء repo على GitHub (من الموقع) ثم:
git remote add origin https://github.com/YOUR_USERNAME/promptforge.git
git branch -M main
git push -u origin main
```

> ⚠️ **تأكد** إن `.env` و `server/.env` **مش** موجودين في الملفات المرفوعة (محميين بـ `.gitignore`)

---

## الخطوة 3: Deploy على Vercel

1. ادخل [vercel.com](https://vercel.com) → **Add New** → **Project**
2. اختر الـ GitHub repo اللي رفعته
3. Vercel هيكتشف إنه Vite project تلقائياً
4. **قبل ما تضغط Deploy** → روح **Environment Variables** وأضف:

| Variable | Value | Note |
|----------|-------|------|
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | 🔴 سري — ده للسيرفر بس |
| `VITE_USE_BACKEND` | `true` | تفعيل الـ proxy mode |
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | من Supabase Settings |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | من Supabase Settings |

5. اضغط **Deploy** ✅
6. انتظر لحد ما يخلص (دقيقة تقريباً)

---

## الخطوة 4: التحقق

بعد الـ Deploy، افتح الرابط اللي Vercel أداهولك وتأكد من:

- [ ] الموقع بيفتح بشكل طبيعي
- [ ] `https://your-app.vercel.app/api/health` → يرجع JSON
- [ ] زر "Generate Blueprint" بيشتغل
- [ ] Login page بتظهر (لو Supabase مفعّل)
- [ ] DevTools → Network → مفيش API key ظاهر

---

## التحديثات بعد كده

```powershell
# عدّل الكود محلياً ثم:
git add .
git commit -m "fix: your change description"
git push

# Vercel هيعمل re-deploy تلقائي خلال 30 ثانية! 🎉
```

---

## حل المشاكل الشائعة

| المشكلة | الحل |
|---------|------|
| `500 Server not configured` | تأكد من `OPENROUTER_API_KEY` في Vercel env vars |
| الموقع أبيض/فارغ | تأكد من الـ build succeeded في Vercel dashboard |
| Login مش شغال | تأكد من `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` |
| `404` على الصفحات | تأكد من وجود `vercel.json` في root المشروع |
| Rate limit error | انتظر دقيقة وجرب تاني |
