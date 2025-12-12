# دليل نشر المشروع على Netlify عبر GitHub

## المتطلبات المسبقة
- حساب GitHub يحتوي المستودع محدثاً (الفرع المراد نشره، عادةً `main`).
- حساب Netlify مفعّل.
- متغيرات البيئة الحساسة جاهزة (مثل `MONGODB_URI`، `JWT_SECRET`).

## الملفات/الإعدادات المضمنة في المشروع
- `netlify.toml`:
  - `build`: `npm run build`
  - `publish`: `.next`
  - `@netlify/plugin-nextjs`
  - `NODE_VERSION=18`
- `next.config.js`: يضيف ترويسة `Permissions-Policy` للكاميرا/الميكروفون/الموقع.

## خطوات النشر التفصيلية
1) تجهيز الفرع على GitHub
   - ادفع آخر التغييرات إلى الفرع الذي ستنشره (مثلاً `main`).

2) إنشاء موقع جديد في Netlify
   - سجل دخولك إلى Netlify.
   - اختر: “Add new site” → “Import an existing project”.
   - اختر GitHub ثم المستودع الخاص بالمشروع.
   - اختر الفرع المراد نشره.

3) ضبط إعدادات البناء (تلقائي من netlify.toml)
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18
   - Plugin: `@netlify/plugin-nextjs`
   (هذه القيم تُقرأ تلقائياً من `netlify.toml`، لكن تأكد من تطابقها في واجهة Netlify إن احتجت.)
   - Base directory: اتركه فارغاً أو `.` (مهم لتجنب خطأ “Couldn't find any pages or app directory”)

4) متغيرات البيئة (Site settings → Build & deploy → Environment)
   أضف القيم الحساسة ولا تضعها في الكود:
   - إلزامية:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `NEXT_PUBLIC_APP_URL` = رابط موقعك على Netlify (مثال: `https://your-site.netlify.app`)
   - إذا كنت تستخدم تكاملات إضافية، أضف ما يلزم (مثلاً SMTP_* للبريد، AWS_* للتخزين، الخ).

5) بدء النشر
   - اضغط Deploy. ستظهر سجلات البناء. عند نجاح البناء سيصبح الموقع متاحاً.

6) التحقق بعد النشر
   - افتح رابط الموقع الذي أنشأه Netlify.
   - جرّب الميزات الحرجة:
     - الكاميرا: اطلب الإذن وتأكد من عملها (الاتصال سيكون عبر HTTPS).
     - تسجيل الدخول/التوكن.
     - البحث/العمليات على قاعدة البيانات (يستلزم صحة `MONGODB_URI`).

7) إعادة النشر التلقائي (CI/CD)
   - أي دفع (push) جديد إلى الفرع المحدد سيطلق عملية نشر تلقائية في Netlify.

## ملاحظات مهمة
- Socket.IO في `server.js` لن يعمل على استضافة Netlify Functions بهذا الشكل؛ إذا كنت تحتاج WebSockets فعلياً، استعمل خدمة خارجية (Pusher/Ably/Supabase Realtime) أو انشر خادماً منفصلاً يدير Socket.IO.
- HTTPS مفعّل افتراضياً في Netlify، وهذا مطلوب لصلاحيات الكاميرا والميكروفون.
- إذا احتجت ترويسات أمان إضافية، يمكن إضافتها في `next.config.js` أو `netlify.toml` (قسم headers).

## أسئلة شائعة
- **خطأ اتصال بقاعدة البيانات**: تحقق من صحة `MONGODB_URI` وصلاحيات الـ IP/CIDR في مزود MongoDB.
- **عدم ظهور طلب الكاميرا**: تأكد أن الموقع يحمّل عبر HTTPS وأن الأذونات لم تُمنع سابقاً من المتصفح. الترويسة `Permissions-Policy` مضافة في `next.config.js`.
- **حاجة لبريد/تخزين ملفات**: أضف متغيرات SMTP أو AWS/S3 حسب المزود واستعمل HTTPS للروابط العامة.

