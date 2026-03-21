"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock, User, Lock, ArrowRight, GraduationCap, Shield, Eye, EyeOff
} from "lucide-react";

export default function LandingPage() {
  const [ra, setRa] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fafafa", fontFamily: "var(--font-dm-sans)" }}>

      {/* Header - Replica do Studeo */}
      <header style={{ background: "#1B3A5C" }}>
        {/* Top nav */}
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#00a89d" }}>
              <Clock size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-white tracking-tight">UniCesumar</span>
              </div>
              <span className="text-[11px] font-medium tracking-wider" style={{ color: "#00c4b8" }}>studeo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Hero banner - gradient like Studeo banners */}
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1B3A5C 0%, #24506e 40%, #00897b 100%)" }}>
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16 flex flex-col md:flex-row items-center gap-8">
            {/* Left text */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase mb-4" style={{ background: "rgba(255,255,255,0.12)", color: "#00c4b8" }}>
                <GraduationCap size={12} />
                Reestruturação do Portal
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                Portal Acadêmico
                <br />
                <span style={{ color: "#00c4b8" }}>UniTime</span>
              </h1>
              <p className="text-sm md:text-base mb-6 max-w-md" style={{ color: "#b8cee0" }}>
                Conhecimento que gera impacto na comunidade e na sua formação. Acesse suas disciplinas, notas, fórum e muito mais.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "#00a89d", border: "2px solid rgba(255,255,255,0.2)" }}
              >
                Acesse a plataforma
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right - Login form */}
            <div className="w-full max-w-sm">
              <div className="p-6 rounded-2xl shadow-xl" style={{ background: "white" }}>
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "linear-gradient(135deg, #00a89d, #00c4b8)" }}>
                    <Clock size={22} className="text-white" />
                  </div>
                  <h2 className="text-base font-bold" style={{ color: "#1e293b" }}>Acesso ao Portal</h2>
                  <p className="text-[11px] mt-0.5" style={{ color: "#94a3b8" }}>Entre com seu RA e senha</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest block mb-1" style={{ color: "#94a3b8" }}>RA do Aluno</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                      <input
                        type="text"
                        placeholder="Ex: 12345678"
                        value={ra}
                        onChange={(e) => setRa(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-all focus:ring-2"
                        style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b", "--tw-ring-color": "#00a89d" } as React.CSSProperties}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest block mb-1" style={{ color: "#94a3b8" }}>Senha</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                      <input
                        type={showSenha ? "text" : "password"}
                        placeholder="••••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full pl-9 pr-10 py-2 rounded-lg text-sm outline-none transition-all focus:ring-2"
                        style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b", "--tw-ring-color": "#00a89d" } as React.CSSProperties}
                      />
                      <button onClick={() => setShowSenha(!showSenha)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}>
                        {showSenha ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90"
                    style={{ background: "#00a89d" }}
                  >
                    Entrar
                    <ArrowRight size={14} />
                  </Link>
                  <div className="flex items-center justify-between">
                    <button className="text-[11px] font-medium hover:underline" style={{ color: "#00a89d" }}>
                      Esqueci minha senha
                    </button>
                    <button className="text-[11px] font-medium hover:underline" style={{ color: "#94a3b8" }}>
                      Primeiro acesso
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 mb-3">
                  <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
                  <span className="text-[10px]" style={{ color: "#94a3b8" }}>ou entre como</span>
                  <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: "Aluno", Icon: GraduationCap },
                    { role: "Professor", Icon: User },
                    { role: "Coordenador", Icon: Shield },
                  ].map((r) => (
                    <Link key={r.role} href="/dashboard" className="flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-medium transition-all hover:bg-[#f0f4f8]" style={{ border: "1px solid #e2e8f0", color: "#475569" }}>
                      <r.Icon size={14} />
                      {r.role}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 50" fill="none" className="w-full">
              <path d="M0,25 C360,50 720,0 1080,25 C1260,37 1380,15 1440,25 L1440,50 L0,50 Z" fill="#fafafa" />
            </svg>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-4 text-center" style={{ borderTop: "1px solid #e8ecf0" }}>
        <p className="text-[11px]" style={{ color: "#94a3b8" }}>© 2026 UNICESUMAR. Todos os direitos reservados.</p>
        <p className="text-[10px] mt-0.5" style={{ color: "#c1c9d4" }}>UniTime — Igor Schiniegoski Pallisser & Luís Boratto · Mentalidade Criativa e Empreendedora · ADS</p>
      </footer>
    </div>
  );
}
