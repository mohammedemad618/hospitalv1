# دليل إعداد الأمان 🔒

## تثبيت المكتبات المطلوبة

قم بتثبيت المكتبات التالية لإكمال نظام الأمان:

```bash
npm install helmet express-rate-limit dompurify speakeasy qrcode
npm install --save-dev @types/qrcode @types/speakeasy
```

## ملاحظات

### 1. DOMPurify
إذا واجهت مشاكل في تثبيت `dompurify`، يمكن استخدام البديل:
```bash
npm install isomorphic-dompurify
```

ثم قم بتحديث `lib/security.ts`:
```typescript
import DOMPurify from 'isomorphic-dompurify';
```

### 2. Helmet
`helmet` مخصص لـ Express. في Next.js، تم تطبيق Security Headers مباشرة في `middleware.ts`.

### 3. Rate Limiting
نظام Rate Limiting الحالي يعمل في الذاكرة. للإنتاج، يُنصح باستخدام Redis.

## التحقق من التثبيت

بعد التثبيت، تحقق من أن كل شيء يعمل:

```bash
npm run build
```

إذا لم تكن هناك أخطاء، فالنظام جاهز للاستخدام!

