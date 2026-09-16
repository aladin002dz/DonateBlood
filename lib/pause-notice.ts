/**
 * Bilingual (FR/AR) copy for the platform-on-hold notice. Deliberately not
 * routed through next-intl: this legal notice must display in both
 * languages at once regardless of the visitor's chosen locale.
 */

export const PAUSE_CONTACT_EMAIL = "mahfoudh.arous@gmail.com";

export const PAUSE_SHORT_FR =
    "Plateforme en pause – migration vers un hébergement en Algérie (loi n° 18-07 modifiée et complétée par la loi n° 25-11).";

export const PAUSE_SHORT_AR =
    "المنصة متوقفة مؤقتًا – انتقال إلى استضافة داخل الجزائر (القانون رقم 18-07 المعدل والمتمم بالقانون رقم 25-11).";

export const PAUSE_LONG_FR = `Plateforme en pause. Conformément à la loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel, modifiée et complétée par la loi n° 25-11 du 24 juillet 2025, Soltana Dam migre vers un hébergement en Algérie. Vos données ont été retirées de nos serveurs actuels et sont conservées de manière sécurisée hors ligne. Les inscriptions et la recherche de donneurs sont suspendues jusqu'à la réouverture. Pour toute question ou pour demander la suppression définitive de vos données : ${PAUSE_CONTACT_EMAIL}`;

export const PAUSE_LONG_AR = `المنصة متوقفة مؤقتًا. طبقًا للقانون رقم 18-07 المؤرخ في 10 يونيو 2018 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي، المعدل والمتمم بالقانون رقم 25-11 المؤرخ في 24 يوليو 2025، تنتقل المنصة إلى استضافة داخل الجزائر. تمّ سحب بياناتكم من خوادمنا الحالية وهي محفوظة بشكل آمن خارج الإنترنت. التسجيل والبحث عن المتبرعين معلّقان إلى حين إعادة الفتح. لأي استفسار أو لطلب الحذف النهائي لبياناتكم: ${PAUSE_CONTACT_EMAIL}`;

/** Short, server-action-friendly message returned instead of throwing. */
export const PAUSE_ACTION_MESSAGE_FR =
    "Plateforme en pause : les inscriptions et la recherche de donneurs sont temporairement suspendues.";
