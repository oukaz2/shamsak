import { Link } from "wouter";
import { useLang } from "@/App";

export default function NotFound() {
  const { lang } = useLang();
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-4xl font-bold text-foreground mb-3">404</p>
      <p className="text-muted-foreground text-sm mb-6">
        {lang === "ar" ? "الصفحة غير موجودة" : "Page not found"}
      </p>
      <Link href="/" className="text-primary text-sm hover:underline">
        {lang === "ar" ? "العودة للرئيسية" : "Back to home"}
      </Link>
    </div>
  );
}
