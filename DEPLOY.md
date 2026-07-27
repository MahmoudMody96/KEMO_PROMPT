# 🚀 PromptForge — دليل الإطلاق (Deployment Guide)

## المتطلبات
- حساب [GitHub](https://github.com)
- حساب [Vercel](https://vercel.com) (مجاني)
- حساب [Supabase](https://supabase.com) (مجاني)
- مفتاح [OpenRouter](https://openrouter.ai/keys)
- حساب [LemonSqueezy](https://lemonsqueezy.com) (للدفع)

> **مهم:** Supabase مش اختياري. الـ API بيتحقق من هوية المستخدم وبيخصم الرصيد
> قبل أي طلب لـ OpenRouter. من غير `SUPABASE_SERVICE_ROLE_KEY` الـ endpoints
> بترفض الخدمة بدل ما تفتح مفتاحك للعالم.

---

## الخطوة 1: إعداد Supabase

1. ادخل على [supabase.com](https://supabase.com) → **New Project**
2. اختر اسم للمشروع (مثلاً `promptforge`) والباسورد
3. استنى لحد ما المشروع يتجهز (دقيقة تقريباً)
4. روح **SQL Editor** → **New Query**
   - **مشروع جديد:** انسخ محتوى `server/schema.sql` والصقه → **Run**
   - **قاعدة بيانات موجودة من قبل:** شغّل
     `server/migrations/001_security_hardening.sql` بدلاً منه
5. اعمل نفسك أدمن (من الـ SQL Editor، مش من المتصفح):
   ```sql
   UPDATE public.profiles SET is_admin = TRUE WHERE email = 'you@example.com';
   ```
6. روح **Settings** → **API** وانسخ:
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public key** → `eyJ...`
   - **service_role key** → `eyJ...` 🔴 **سري جداً — للسيرفر بس**

### (اختياري) تفعيل Google Login
1. روح **Authentication** → **Providers** → **Google**
2. Enable → حط الـ Client ID والـ Secret من
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

---

## الخطوة 2: رفع الكود على GitHub

```bash
git add .
```

```bash
git commit -m "chore: security hardening"
```

```bash
git push -u origin main
```

> ⚠️ اتأكد إن `.env` و `server/.env` **مش** مرفوعين (محميين بـ `.gitignore`)

---

## الخطوة 3: Deploy على Vercel

1. ادخل [vercel.com](https://vercel.com) → **Add New** → **Project**
2. اختر الـ GitHub repo
3. Vercel هيكتشف إنه Vite project تلقائياً
4. **قبل ما تضغط Deploy** → روح **Environment Variables** وأضف:

### مطلوب

| Variable | Value | Note |
|----------|-------|------|
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | 🔴 سري — سيرفر بس |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | 🔴 سري — بيتخطى RLS |
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | آمن للمتصفح |
| `VITE_USE_BACKEND` | `true` | تفعيل الـ proxy mode |
| `APP_URL` | `https://your-app.vercel.app` | للـ referer وredirect الدفع |

### الدفع (LemonSqueezy)

| Variable | Value | Note |
|----------|-------|------|
| `LEMONSQUEEZY_API_KEY` | `...` | 🔴 سري |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | `...` | 🔴 سري |
| `VITE_LEMONSQUEEZY_STORE_ID` | `123456` | |
| `VITE_LEMON_VARIANT_BASIC` | `1318412` | |
| `VITE_LEMON_VARIANT_PRO` | `1318421` | |
| `VITE_LEMON_VARIANT_PREMIUM` | `1318422` | |

### اختياري

| Variable | Default | Note |
|----------|---------|------|
| `ALLOWED_ORIGINS` | `*.vercel.app` | دومينات إضافية، مفصولة بفاصلة |
| `RATE_LIMIT_MAX` | `30` | طلبات لكل نافذة |
| `RATE_LIMIT_WINDOW` | `60000` | حجم النافذة بالملي ثانية |

> 🚫 **متحطش `ALLOW_ANONYMOUS` على Vercel أبداً.** ده بيلغي التحقق من الهوية
> وخصم الرصيد — يعني بيحوّل الـ API لـ proxy مجاني لمفتاح OpenRouter بتاعك.
> `VITE_ADMIN_EMAILS` مابقاش مستخدم؛ الأدمن بقى عمود `is_admin` في الداتابيز.

5. اضغط **Deploy** ✅

---

## الخطوة 4: ربط الـ Webhook

1. في LemonSqueezy → **Settings** → **Webhooks** → **+**
2. URL: `https://your-app.vercel.app/api/lemonsqueezy-webhook`
3. Signing secret: نفس قيمة `LEMONSQUEEZY_WEBHOOK_SECRET`
4. فعّل الأحداث: `order_created`, `subscription_created`,
   `subscription_updated`, `subscription_cancelled`, `subscription_expired`
5. اعمل عملية شراء تجريبية وتأكد من الـ logs إن الرصيد اتضاف

---

## الخطوة 5: التحقق

- [ ] الموقع بيفتح بشكل طبيعي
- [ ] `https://your-app.vercel.app/api/health` → بيرجّع JSON
- [ ] من غير تسجيل دخول: `POST /api/generate` بيرجّع **401** (مش 200)
- [ ] بعد تسجيل الدخول: التوليد بيشتغل والرصيد بينقص في الـ sidebar
- [ ] لما الرصيد يخلص: بتظهر رسالة "Not enough credits" مش خطأ عام
- [ ] `/admin` بيرفض أي حساب مش `is_admin = TRUE`
- [ ] DevTools → Network → مفيش أي API key ظاهر

### اختبار سريع إن الـ API مقفول

```bash
curl -i -X POST https://your-app.vercel.app/api/generate -H "Content-Type: application/json" -d '{"prompt":"test"}'
```

المفروض يرجّع `401 Sign in required`. لو رجّع `200` يبقى فيه
`ALLOW_ANONYMOUS=true` متحطوط بالغلط — امسحه فوراً واعمل redeploy.

---

## التطوير المحلي

```bash
vercel dev
```

بيشغّل نفس الـ serverless functions بتاعة الإنتاج — بالتحقق من الهوية وخصم
الرصيد. ده الطريقة المفضلة.

البديل (`cd server && npm run dev`) بيشغّل proxy بسيط من غير أي auth أو خصم
رصيد، وبيرفض يشتغل غير لما تحط `ALLOW_ANONYMOUS=true` في `server/.env`.

---

## حل المشاكل الشائعة

| المشكلة | الحل |
|---------|------|
| `503 authentication unavailable` | ناقص `SUPABASE_SERVICE_ROLE_KEY` في Vercel |
| `401 Sign in required` | المستخدم مش مسجّل دخول، أو الـ session خلصت |
| `402 Not enough credits` | الرصيد خلص — اشحن من صفحة Pricing |
| `403 Origin not allowed` | ضيف الدومين لـ `ALLOWED_ORIGINS` |
| الدفع نجح والرصيد مازاد | راجع logs الـ webhook: توقيع غلط أو الـ variant IDs مش مظبوطة |
| `500 Server not configured` | ناقص `OPENROUTER_API_KEY` |
| الموقع أبيض/فارغ | راجع الـ build في Vercel dashboard |
| Login مش شغال | راجع `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` |
| `404` على الصفحات | اتأكد إن `vercel.json` موجود في الـ root |
| `/admin` بيقول Access Denied | شغّل `UPDATE public.profiles SET is_admin = TRUE ...` |
