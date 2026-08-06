# 🚀 Kemo Engine — دليل النشر على Coolify

المشروع بيتنشر كـ **صورة Docker واحدة** فيها الواجهة المبنية والـ API مع بعض،
جنبها **PostgreSQL**. مفيش Supabase ولا Vercel ولا أي خدمة خارجية للمصادقة.

---

## المتطلبات

- سيرفر عليه [Coolify](https://coolify.io) v4.1+
- مفتاح [OpenRouter](https://openrouter.ai/keys)
- (اختياري) حساب [LemonSqueezy](https://lemonsqueezy.com) للدفع

---

## الخطوة 1: قاعدة البيانات

من Coolify: **Project → + New → Database → PostgreSQL**

| الإعداد | القيمة |
|---|---|
| Name | `kemo-db` |
| Postgres User | `kemo` |
| Postgres DB | `kemo` |
| Postgres Password | ولّد واحد عشوائي |

> **مهم:** خلّي الباسورد **URL-safe** (حروف وأرقام و`-` و`_` بس). الرموز زي
> `@` و`:` و`/` بتكسر صيغة `DATABASE_URL`. ولّد واحد بـ:
> ```bash
> node -e "console.log(require('crypto').randomBytes(30).toString('base64url'))"
> ```

بعد ما تشتغل، انسخ الـ **Internal URL** — شكله:
```
postgres://kemo:PASSWORD@<db-uuid>:5432/kemo
```

استخدم الداخلي مش الخارجي: قاعدة البيانات مالهاش أي سبب تتعرّض للإنترنت.

---

## الخطوة 2: التطبيق

**Project → + New → Application → Public Repository**

| الإعداد | القيمة |
|---|---|
| Repository | `https://github.com/MahmoudMody96/KEMO_PROMPT` |
| Branch | `main` |
| Build Pack | **Dockerfile** |
| Dockerfile Location | `/Dockerfile` |
| Port Exposes | `3000` |

---

## الخطوة 3: متغيرات البيئة

### مطلوبة — السيرفر بيرفض يقلع من غيرها

| المتغير | الشرح |
|---|---|
| `DATABASE_URL` | الرابط الداخلي من الخطوة 1 |
| `JWT_SECRET` | **32 حرف على الأقل** — الكود بيتحقق ويقف لو أقصر |
| `OPENROUTER_API_KEY` | من openrouter.ai/keys |

### مهمة بس ليها قيمة افتراضية

| المتغير | الافتراضي | ليه تظبطها |
|---|---|---|
| `APP_URL` | — | **لازم للشراء.** من غيرها `/api/create-checkout` بيرجع 500، لأن رابط الرجوع بعد الدفع مابيتاخدش من ترويسة الطلب أبداً |
| `NODE_ENV` | `production` | سيبها زي ما هي |
| `PORT` | `3000` | الـ healthcheck بيقراها، فأي قيمة تانية شغالة |

ولّد الـ JWT secret بـ:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### اختيارية

| المتغير | الافتراضي | الشرح |
|---|---|---|
| `SESSION_DAYS` | `7` | عمر الجلسة |
| `RATE_LIMIT_MAX` | `30` | طلبات AI لكل نافذة |
| `RATE_LIMIT_WINDOW` | `60000` | حجم النافذة (ms) |
| `SIGNUP_BONUS_CREDITS` | `20` | رصيد الترحيب (ملاحظة: الأدمن يقدر يغيّره وقت التشغيل من لوحة الإعدادات، وده بياخد الأولوية) |
| `OPENROUTER_MODEL` | `google/gemini-2.5-flash-lite` | موديل توليد النصوص. أي id على OpenRouter. الواجهة مابتبعتش موديل — ده المصدر الوحيد |
| `OPENROUTER_VISION_MODEL` | `google/gemini-2.5-flash-lite` | موديل استخراج الصور — **لازم يفضل موديل بيشوف صور**. منفصل عن موديل النص عشان تحويل النص لموديل نصّي بس (deepseek وغيره) ما يكسرش الاستخراج |
| `OPENROUTER_ALLOWED_MODELS` | — | موديلات إضافية مسموح للعميل يطلبها، مفصولة بفاصلة. السعر بالإجراء مش بالموديل، فحط بس موديلات سعرها قريب من الافتراضي |

> ⏱️ **ملاحظة عن السرعة:** الموديلات البطيئة على المهام التقيلة (توليد سيناريو
> كامل ممكن ياخد 90 ثانية+) بتصطدم بمهلة السيرفر (120 ثانية). لو اخترت موديل
> رخيص وبطيء، جرّب سرعته الأول — الموديلات السريعة (زي `gemini-2.5-flash` أو
> `qwen/qwen3.7-flash`) بتخلّص في ثوانٍ لعشرات الثواني.

### الدفع (اختياري — الشراء بيتعطّل من غيرها)

`LEMONSQUEEZY_API_KEY` · `LEMONSQUEEZY_WEBHOOK_SECRET` · `LEMONSQUEEZY_STORE_ID`
`LEMON_VARIANT_BASIC` · `LEMON_VARIANT_PRO` · `LEMON_VARIANT_PREMIUM`

وللواجهة (عامة، بتتحقن وقت البناء):
`VITE_LEMON_VARIANT_BASIC` · `VITE_LEMON_VARIANT_PRO` · `VITE_LEMON_VARIANT_PREMIUM`

> 🚨 **التلاتة دول لازم يتحطوا كـ Build Variables في Coolify — مش Runtime.**
> Vite بيحقن `import.meta.env.VITE_*` جوّه الـ bundle **وقت البناء**، فلو
> حطيتهم كمتغيرات تشغيل عادية مش هيوصلوا للصورة خالص، والنتيجة إن كل باقة في
> صفحة الأسعار هتقول "هذه الباقة غير مُعدّة حالياً" ومحدش هيقدر يشتري.
>
> الـ `Dockerfile` بيستقبلهم عن طريق `ARG` في مرحلة البناء. لو الـ build عندك
> بيعدّي `--build-arg` بنفسه، اتأكد إن الأسامي مطابقة بالظبط.

---

## الخطوة 4: الدومين و HTTPS

في إعدادات التطبيق حط الدومين **بـ `https://`**:
```
https://kemo.example.com
```
`https://` هي اللي بتخلّي Coolify يطلب شهادة Let's Encrypt أوتوماتيك.

**مالكش دومين؟** استخدم [sslip.io](https://sslip.io) — بيرجّع أي IP تحطه في
الاسم، فهو نطاق حقيقي وLet's Encrypt بيديه شهادة عادي:
```
https://kemo.<server-ip>.sslip.io
```

> لازم يكون البورت **80 مفتوح** — تجديد الشهادة كل 60 يوم بيمر منه. ناس كتير
> بتقفله بعد ما HTTPS يشتغل وبعد شهرين الشهادة تقع فجأة.

---

## الخطوة 5: النشر

اضغط **Deploy**. أول بناء بياخد 2-4 دقايق (بناء Vite + تثبيت مكتبات السيرفر).

الـ schema **بيتطبّق لوحده** عند الإقلاع — `server/src/migrate.js` بيشغّل أي
ملف في `server/migrations/` لسه ماتطبّقش، وبيسجّله في جدول `schema_migrations`.
مفيش خطوة يدوية.

---

## الخطوة 6: أول أدمن

سجّل حساب من الموقع، وبعدين من **terminal حاوية التطبيق** (Coolify → التطبيق →
Terminal):

```bash
cd server && ADMIN_EMAIL=you@example.com npm run make-admin
```

السكربت بيعيّن `is_admin = TRUE` للحساب. الترقية idempotent، والباسورد بتاع حساب
موجود مابيتلمسش. لو لسه مافيش حساب، ممكن تنشئه بباسورد من البيئة:

```bash
cd server && ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='…' npm run make-admin
```

الأدمن عمود في قاعدة البيانات، مش متغيّر بيئة ولا قائمة إيميلات في الواجهة —
ومفيش أي endpoint بيكتبه، عشان محدش يقدر يرقّي نفسه من المتصفح. بعد كده لوحة
الأدمن على `/admin` (إعدادات وقت التشغيل، وضع صيانة، وفحص حالة مزوّد الـ AI).

---

## الخطوة 7: الـ Webhook (لو مفعّل الدفع)

1. LemonSqueezy → **Settings → Webhooks → +**
2. URL: `https://kemo.example.com/api/lemonsqueezy-webhook`
3. Signing secret: نفس `LEMONSQUEEZY_WEBHOOK_SECRET`
4. الأحداث: `order_created`, `subscription_created`, `subscription_updated`,
   `subscription_cancelled`, `subscription_expired`
5. اعمل شراء تجريبي وتأكد من السجلات إن الرصيد اتضاف

---

## التحقق بعد النشر

```bash
curl -s https://kemo.example.com/api/health
```
المفروض يرجّع `{"status":"ok","version":"2.0.0",...}`

قائمة الفحص:

- [ ] الموقع بيفتح وصفحة التسجيل ظاهرة
- [ ] إنشاء حساب بيشتغل وبيدّي 20 رصيد
- [ ] `POST /api/generate` من غير تسجيل دخول بيرجّع **401**
- [ ] بعد تسجيل الدخول التوليد بيشتغل والرصيد بينقص في الشريط الجانبي
- [ ] لما الرصيد يخلص بتظهر رسالة "Not enough credits" مش خطأ عام
- [ ] `/admin` بيرجّع **404** لأي حساب مش `is_admin`
- [ ] DevTools → Application → Cookies: `kemo_session` عليه `HttpOnly` و`Secure`
- [ ] DevTools → Network: مفيش أي مفتاح API ظاهر

### اختبار سريع إن الـ API مقفول

```bash
curl -i -X POST https://kemo.example.com/api/generate -H "Content-Type: application/json" -d '{"prompt":"test"}'
```

المفروض `401 Sign in required`.

---

## نموذج الأمان

| الطبقة | الآلية |
|---|---|
| **الهوية** | bcrypt (cost 12)، ومسار فشل بزمن ثابت يمنع تعداد الحسابات |
| **الجلسة** | JWT جواه معرّف جلسة؛ المعرّف مخزّن **مُجزّأً** فتسجيل الخروج بيلغي فعلاً |
| **الكوكي** | `httpOnly` (XSS مايقدرش يقراه) + `Secure` + `SameSite=Lax` |
| **التفويض** | على مستوى التطبيق — كل استعلام مُقيّد بـ `req.user.id` |
| **الأدمن** | `users.is_admin`، والمسارات بترد **404** مش 403 عشان ماتعلنش عن نفسها |
| **الرصيد** | الأسعار على السيرفر؛ خصم قبل الاستدعاء واسترجاع عند الفشل |
| **الـ Webhook** | HMAC على البايتات الخام + حماية من التكرار لكل حدث |
| **الترويسات** | CSP، HSTS، `nosniff`، `frame-ancestors`، `Permissions-Policy` |

> **ليه مفيش RLS؟** سياسات RLS بتحمي قاعدة بيانات المتصفح بيكلّمها مباشرة.
> هنا السيرفر هو الوحيد اللي معاه بيانات الاتصال، والتفويض في طبقة الـ API.

---

## حل المشاكل

| المشكلة | السبب المرجّح |
|---|---|
| الحاوية بتقلع وتموت فوراً | متغير ناقص — `config.js` بيوقف عمداً. شوف السجل |
| `Cannot reach the database` | `DATABASE_URL` غلط، أو رموز خاصة في الباسورد، أو القاعدة لسه بتقلع |
| `JWT_SECRET must be at least 32 characters` | ولّد واحد جديد بالأمر اللي فوق |
| `401 Sign in required` | الجلسة انتهت — سجّل دخول تاني |
| `402 Not enough credits` | الرصيد خلص — من صفحة Pricing |
| `502 AI service error` | مفتاح OpenRouter ملغي، رصيده خلص، أو الموديل مش متاح (`No endpoints found`). لوحة الأدمن → حالة النظام بتقول السبب |
| التوليد بيوصل لمهلة (timeout) | الموديل بطيء على المهمة التقيلة — استخدم موديل أسرع (شوف ملاحظة السرعة فوق) |
| الدفع نجح والرصيد مازاد | راجع سجلات الـ webhook: توقيع غلط أو variant IDs مش مظبوطة |
| `/admin` بيرجّع 404 | الحساب مش أدمن — شغّل `npm run make-admin` (الخطوة 6) |
| الشهادة مااتجددتش | البورت 80 مقفول |

### قراءة السجلات

```bash
docker logs $(docker ps -aq --filter "name=kemo-engine" | head -1) --tail 100
```

---

## التحديثات

```bash
git push
```

Coolify بيعمل إعادة بناء ونشر. الـ migrations الجديدة بتتطبّق عند الإقلاع،
والإيقاف نظيف: `node` هو PID 1 (الـ `CMD` بصيغة exec) وفيه معالج `SIGTERM`
في `server/src/index.js` بيقفل السيرفر بالراحة وبيدي الطلبات الجارية 10 ثواني
تخلص قبل الخروج. مفيش `dumb-init` — التطبيق مابيشغّلش عمليات فرعية أصلاً.
