import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Users, BarChart3, Heart, ShieldCheck, Zap, ShieldAlert } from "lucide-react";
import logo from "@/assets/timebridge-logo.png";
import uniLogo from "@/assets/poznan-university.png";
import { SplashIntro } from "@/components/SplashIntro";
import { BridgeBackdrop } from "@/components/BridgeBackdrop";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <SplashIntro />
      {/* animated background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#014bad]/20 blur-3xl animate-blob" />
        <div className="absolute -top-20 right-[-8rem] h-[26rem] w-[26rem] rounded-full bg-[#ffd03a]/30 blur-3xl animate-blob delay-200" />
        <div className="absolute bottom-[-10rem] left-1/3 h-[24rem] w-[24rem] rounded-full bg-[#014bad]/15 blur-3xl animate-blob delay-400" />
      </div>
      <BridgeBackdrop />

      {/* nav */}
      <header className="relative z-10 mx-auto max-w-7xl px-6 py-6 flex items-center justify-between animate-fade-in">
        <div className="rounded-2xl bg-white px-5 py-3 shadow-soft ring-1 ring-[#014bad]/10">
          <img src={logo} alt="TimeBridge" className="h-12 w-auto sm:h-14" />
        </div>
        <div className="hidden sm:flex items-center gap-3 rounded-xl bg-white/80 backdrop-blur px-3 py-2 shadow-soft">
          <img src={uniLogo} alt="Poznań University of Economics and Business" className="h-8 w-auto" />
        </div>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-20 sm:pt-20 sm:pb-28 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-4 py-1.5 text-xs font-semibold text-[#014bad] ring-1 ring-[#014bad]/15 shadow-soft animate-fade-in-up">
          <Sparkles className="h-3.5 w-3.5 text-[#ffb800]" />
          B2B / B2G platform for digital inclusion
        </div>

        <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#014bad] animate-fade-in-up delay-200 leading-[1.05]">
          TimeBridge: Scaling{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Intergenerational</span>
            <span className="absolute inset-x-0 bottom-1 h-3 sm:h-4 bg-[#ffd03a] rounded-sm -z-0" />
          </span>{" "}
          Digital Inclusion.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 animate-fade-in-up delay-400">
          The complete institutional platform to automate onboarding, mentor matching, and social impact tracking for municipalities and universities.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up delay-600">
          <Link
            to="/dashboard"
            className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ffd03a] px-8 sm:px-10 py-5 sm:py-6 text-lg sm:text-xl font-bold text-[#014bad] shadow-yellow ring-2 ring-[#014bad]/10 transition-all duration-300 hover:scale-[1.04] hover:bg-[#ffc21a] hover:shadow-[0_20px_60px_-15px_rgba(255,208,58,0.9)] active:scale-100 animate-pulse-glow"
          >
            Enter Dashboard
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/report"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold text-[#014bad] ring-2 ring-[#014bad]/20 shadow-soft transition-all duration-300 hover:scale-[1.04] hover:ring-[#014bad]/40 hover:shadow-elevated"
          >
            <ShieldAlert className="h-5 w-5" />
            Report Misbehavior
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-500 animate-fade-in delay-600">
          See something concerning? Submit a confidential report — reviewed by our Trust &amp; Safety team within 24h.
        </p>

        <div className="mt-8 space-y-3 animate-fade-in delay-600">
          <p className="text-sm sm:text-base text-slate-600">
            Trusted research initiative · <span className="font-semibold text-[#014bad]">Poznań University of Economics and Business</span>
          </p>
          <p className="text-base sm:text-lg text-slate-700">
            Created by <span className="font-bold text-[#014bad]">Menghu Shu</span>, <span className="font-bold text-[#014bad]">Michał Raczunas</span> &amp; <span className="font-bold text-[#014bad]">Mostafa ElDaly</span>
          </p>
          <p className="text-sm sm:text-base text-slate-700">
            under the supervision of <span className="font-semibold text-[#014bad]">dr inż. Aleksandra Szulczewska-Remi</span>
          </p>
        </div>
      </section>

      {/* value props */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Automated Onboarding",
              desc: "Replace spreadsheets with guided digital intake for seniors and student mentors — verified, structured, and instant.",
            },
            {
              icon: Sparkles,
              title: "Smart Matching Algorithm",
              desc: "Pair mentors and seniors by overlapping tech needs, skills, and availability with a single click.",
            },
            {
              icon: BarChart3,
              title: "Real-time Impact Reporting",
              desc: "Live dashboards on hours mentored, demographics served, and social ROI — ready to share with stakeholders.",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="group relative rounded-3xl bg-white p-7 shadow-soft ring-1 ring-[#014bad]/8 transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated hover:ring-[#014bad]/25 animate-fade-in-up"
              style={{ animationDelay: `${0.2 * (i + 1)}s` }}
            >
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#014bad] via-[#ffd03a] to-[#014bad] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#014bad] text-white shadow-glow group-hover:bg-[#ffd03a] group-hover:text-[#014bad] transition-colors">
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#014bad]">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* secondary stats strip */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-3xl bg-[#014bad] p-8 text-white shadow-elevated relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[#ffd03a]/20 blur-3xl animate-float" />
          {[
            { k: "120+", v: "Seniors onboarded" },
            { k: "85", v: "Active mentors" },
            { k: "1,400h", v: "Mentorship logged" },
            { k: "16", v: "Partner institutions" },
          ].map((s) => (
            <div key={s.v} className="relative">
              <div className="text-3xl sm:text-4xl font-bold text-[#ffd03a]">{s.k}</div>
              <div className="text-xs sm:text-sm text-white/80 mt-1">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#014bad]" /> GDPR-ready</span>
          <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-[#014bad]" /> Multi-institution</span>
          <span className="inline-flex items-center gap-2"><Heart className="h-4 w-4 text-[#014bad]" /> Built for social impact</span>
        </div>
      </section>
    </div>
  );
}
