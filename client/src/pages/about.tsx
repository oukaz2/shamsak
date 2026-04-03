import { useLang } from "@/App";
import { tr } from "@/lib/i18n";

export default function AboutPage() {
  const { lang } = useLang();

  const content = {
    ar: {
      title: "عن شمسك",
      intro: "شمسك دليل رقمي مستقل لشركات تثبيت الطاقة الشمسية المعتمدة في مصر.",
      what: {
        heading: "ما هو شمسك؟",
        body: "شمسك يجمع المعلومات المتاحة للعموم حول شركات تثبيت الطاقة الشمسية المعتمدة في مصر ويعرضها في واجهة سهلة الاستخدام وقابلة للبحث. الهدف هو تسهيل اكتشاف هذه الشركات ومقارنتها بطريقة محايدة وموثوقة.",
      },
      source: {
        heading: "مصادر البيانات",
        body: "المعلومات مستخرجة من المصادر الرسمية العامة الآتية:\n• القائمة الذهبية والبرونزية لهيئة الطاقة الجديدة والمتجددة (NREA)\n• منصة مثبتي الطاقة الشمسية في مصر (pv-hub.org)\n• بيانات هيئة تنظيم مرفق الكهرباء (EGYPTERA)\n\nشمسك لا تنشئ أو تعدل البيانات التشغيلية (عدد المحطات والقدرة المركبة).",
      },
      neutral: {
        heading: "الحياد",
        body: "لا توجد ترتيبات مدفوعة أو محتوى مموّل في هذا الدليل. ترتيب الشركات لا يعكس أي توصية أو تصنيف تجاري.",
      },
      update: {
        heading: "تحديث البيانات",
        body: "إذا كانت شركتك مدرجة وترغب في تحديث وصفها أو تصحيح معلومة، يمكنك التواصل معنا مباشرة.",
      },
      disclaimer: {
        heading: "إخلاء المسؤولية",
        body: "المعلومات الواردة في هذا الدليل للأغراض الإعلامية فحسب. شمسك لا تقدم ضمانات بشأن أداء أي شركة مدرجة، ولا تتحمل مسؤولية أي قرارات تعاقدية تُتخذ بناءً على هذه المعلومات.",
      },
    },
    en: {
      title: "About Shamsak",
      intro: "Shamsak is an independent digital directory of certified solar installer companies in Egypt.",
      what: {
        heading: "What is Shamsak?",
        body: "Shamsak aggregates publicly available information about certified solar installer companies in Egypt and presents it in a clean, searchable, easy-to-use interface. The goal is to make discovering and comparing these companies neutral and trustworthy.",
      },
      source: {
        heading: "Data Sources",
        body: "Information is sourced from the following official public sources:\n• NREA Golden and Bronze Lists (New and Renewable Energy Authority)\n• Egypt Solar Installer Platform (pv-hub.org)\n• EGYPTERA licensing data\n\nShamsak does not create or modify operational data (station counts, installed capacity).",
      },
      neutral: {
        heading: "Neutrality",
        body: "There are no paid placements or sponsored content in this directory. The order of companies does not reflect any recommendation or commercial ranking.",
      },
      update: {
        heading: "Updating Information",
        body: "If your company is listed and you would like to update your description or correct information, please contact us directly.",
      },
      disclaimer: {
        heading: "Disclaimer",
        body: "Information in this directory is for informational purposes only. Shamsak provides no warranties regarding the performance of any listed company, and accepts no liability for any contractual decisions made based on this information.",
      },
    },
  };

  const c = content[lang];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-3">{c.title}</h1>
      <p className="text-sm text-muted-foreground mb-10 leading-relaxed">{c.intro}</p>

      <div className="space-y-10">
        {[c.what, c.source, c.neutral, c.update, c.disclaimer].map((section, i) => (
          <section key={i}>
            <h2 className="text-base font-semibold text-foreground mb-3">{section.heading}</h2>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {section.body}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
