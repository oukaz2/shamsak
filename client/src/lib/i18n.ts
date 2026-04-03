export type Lang = "ar" | "en";

export const t: Record<string, Record<Lang, string>> = {
  // Nav
  siteName: { ar: "شمسك", en: "Shamsak" },
  siteTagline: { ar: "دليل مثبتي الطاقة الشمسية في مصر", en: "Egypt's Solar Installer Directory" },
  navDirectory: { ar: "الدليل", en: "Directory" },
  navAbout: { ar: "عن الدليل", en: "About" },
  navAdmin: { ar: "الإدارة", en: "Admin" },
  langToggle: { ar: "English", en: "عربي" },

  // Homepage
  heroTitle: { ar: "دليل مثبتي الطاقة الشمسية المعتمدين في مصر", en: "Egypt's Certified Solar Installer Directory" },
  heroSubtitle: { ar: "اعثر على المثبت المناسب — بيانات واضحة، قابلة للتصفح، ومنظمة من المصادر الرسمية.", en: "Find the right installer — clear, browsable data organized from official public sources." },
  heroCTA: { ar: "استعرض الدليل", en: "Browse the Directory" },
  featuredTitle: { ar: "شركات مميزة", en: "Featured Companies" },
  statsInstallers: { ar: "شركة مثبت", en: "Installers" },
  statsMW: { ar: "ميجاواط منجزة", en: "MW Installed" },
  statsStations: { ar: "محطة موثقة", en: "Documented Stations" },
  howWorksTitle: { ar: "كيف يعمل الدليل", en: "How the Directory Works" },
  howStep1Title: { ar: "بيانات رسمية", en: "Official Data" },
  howStep1Desc: { ar: "المعلومات مستخرجة من القوائم الرسمية لهيئة الطاقة الجديدة والمتجددة (NREA) وهيئة تنظيم مرفق الكهرباء.", en: "Information is sourced from official NREA and EGYPTERA public listings." },
  howStep2Title: { ar: "لا ترتيب مدفوع", en: "No Paid Rankings" },
  howStep2Desc: { ar: "لا توجد إعلانات مدفوعة أو ترتيبات مموّلة. الدليل محايد تماماً.", en: "No paid placements or sponsored rankings. The directory is fully neutral." },
  howStep3Title: { ar: "معلومات قابلة للتحديث", en: "Updatable Information" },
  howStep3Desc: { ar: "يتم تحديث البيانات بانتظام. إذا كانت شركتك في القائمة يمكنك التواصل لتحديث بياناتها.", en: "Data is updated regularly. If your company is listed, contact us to update your information." },
  viewProfile: { ar: "عرض الملف", en: "View Profile" },

  // Directory
  directoryTitle: { ar: "دليل المثبتين", en: "Installer Directory" },
  directorySubtitle: { ar: "شركات مثبت معتمدة في مصر، مرتبة حسب السجل التشغيلي.", en: "Certified solar installer companies in Egypt, sorted by operational track record." },
  searchPlaceholder: { ar: "البحث باسم الشركة...", en: "Search by company name..." },
  filterAll: { ar: "جميع الشركات", en: "All Companies" },
  filterUpTo500: { ar: "حتى 500 كيلوواط", en: "Up to 500 kW" },
  filterAbove500: { ar: "أكثر من 500 كيلوواط", en: "More than 500 kW" },
  sortDefault: { ar: "الترتيب الافتراضي", en: "Default" },
  sortPowerDesc: { ar: "الأعلى قدرة أولاً", en: "Highest Power First" },
  sortPowerAsc: { ar: "الأقل قدرة أولاً", en: "Lowest Power First" },
  sortStationsDesc: { ar: "الأكثر محطات أولاً", en: "Most Stations First" },
  resultsCount: { ar: "نتيجة", en: "results" },
  noResults: { ar: "لا توجد نتائج مطابقة", en: "No matching results" },

  // Card / Profile
  stations: { ar: "محطة", en: "stations" },
  installedPower: { ar: "قدرة مركبة", en: "installed capacity" },
  category: { ar: "التصنيف", en: "Category" },
  location: { ar: "الموقع", en: "Location" },
  contact: { ar: "التواصل", en: "Contact" },
  website: { ar: "الموقع الإلكتروني", en: "Website" },
  facebook: { ar: "فيسبوك", en: "Facebook" },
  email: { ar: "البريد الإلكتروني", en: "Email" },
  phone: { ar: "الهاتف", en: "Phone" },
  description: { ar: "عن الشركة", en: "About" },
  notes: { ar: "ملاحظات", en: "Notes" },
  categoryUpTo500: { ar: "حتى 500 كيلوواط", en: "Up to 500 kW" },
  categoryAbove500: { ar: "أكثر من 500 كيلوواط", en: "More than 500 kW" },
  featured: { ar: "مميز", en: "Featured" },
  backToDirectory: { ar: "العودة إلى الدليل", en: "Back to Directory" },
  disclaimer: { ar: "إخلاء المسؤولية", en: "Disclaimer" },
  disclaimerText: { ar: "المعلومات الواردة في هذا الدليل مستخرجة من مصادر عامة رسمية. شمسك لا تضمن دقة المعلومات أو تحديثها في جميع الأوقات. يُرجى التحقق من بيانات الشركة مباشرة قبل التعاقد.", en: "Information in this directory is sourced from official public sources. Shamsak does not guarantee the accuracy or currency of all information at all times. Please verify company details directly before entering any agreement." },

  // About
  aboutTitle: { ar: "عن شمسك", en: "About Shamsak" },

  // Admin
  adminTitle: { ar: "لوحة التحكم", en: "Admin Panel" },
  adminLogin: { ar: "دخول الإدارة", en: "Admin Login" },
  adminPassword: { ar: "كلمة المرور", en: "Password" },
  adminLoginBtn: { ar: "دخول", en: "Login" },
  adminAddNew: { ar: "إضافة شركة", en: "Add Company" },
  adminEdit: { ar: "تعديل", en: "Edit" },
  adminDelete: { ar: "حذف", en: "Delete" },
  adminSave: { ar: "حفظ", en: "Save" },
  adminCancel: { ar: "إلغاء", en: "Cancel" },
  adminHide: { ar: "إخفاء", en: "Hide" },
  adminShow: { ar: "إظهار", en: "Show" },
  adminFeatured: { ar: "مميز", en: "Featured" },
  adminHidden: { ar: "مخفي", en: "Hidden" },
  adminLogout: { ar: "خروج", en: "Logout" },
  adminWrongPassword: { ar: "كلمة المرور غير صحيحة", en: "Incorrect password" },

  // Footer
  footerRights: { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
  footerDisclaimer: { ar: "هذا الدليل يعرض معلومات عامة فقط. التحقق من الشركات مسؤولية المستخدم.", en: "This directory presents public information only. Verifying companies is the user's responsibility." },
  footerMethodology: { ar: "المنهجية", en: "Methodology" },
  footerContact: { ar: "تواصل معنا", en: "Contact" },
};

export function tr(key: string, lang: Lang): string {
  return t[key]?.[lang] ?? key;
}
