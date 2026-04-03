import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useState, createContext, useContext } from "react";
import type { Lang } from "@/lib/i18n";

import HomePage from "@/pages/home";
import DirectoryPage from "@/pages/directory";
import InstallerPage from "@/pages/installer";
import AdminPage from "@/pages/admin";
import AboutPage from "@/pages/about";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Language context
interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  dir: "rtl" | "ltr";
}
export const LangContext = createContext<LangContextType>({ lang: "ar", setLang: () => {}, dir: "rtl" });
export const useLang = () => useContext(LangContext);

function App() {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return (window.localStorage.getItem("shamsak_lang") as Lang) || "ar"; }
    catch { return "ar"; }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { window.localStorage.setItem("shamsak_lang", l); } catch {}
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
  };

  // Set initial dir/lang
  useState(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <QueryClientProvider client={queryClient}>
      <LangContext.Provider value={{ lang, setLang, dir }}>
        <div className="min-h-screen flex flex-col" dir={dir}>
          <Header />
          <main className="flex-1">
            <Router hook={useHashLocation}>
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/directory" component={DirectoryPage} />
                <Route path="/installer/:id" component={InstallerPage} />
                <Route path="/admin" component={AdminPage} />
                <Route path="/about" component={AboutPage} />
                <Route component={NotFound} />
              </Switch>
            </Router>
          </main>
          <Footer />
        </div>
        <Toaster />
      </LangContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
