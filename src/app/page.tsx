"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock, CheckSquare, Calendar, BarChart3, Timer, StickyNote,
  ArrowRight, GraduationCap, User, Lock, ChevronRight,
  MessageSquare, BookOpen, DollarSign, Award, Monitor,
  Shield, Bell, Lightbulb, Search
} from "lucide-react";

export default function LandingPage() {
  const [ra, setRa] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f7fa", fontFamily: "var(--font-dm-sans)" }}>

      {/* Top bar */}
      <div className="w-full py-1.5 text-center text-[11px] font-medium tracking-wide" style={{ background: "#00a89d", color: "white" }}>
        UniCesumar · Plataforma Acadêmica Reestruturada · UniTime 2026
      </div>

      {/* Header - Studeo style dark navy */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-4" style={{ background: "#1B3A5C" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00a89d, #00c4b8)" }}>
            <Clock size={20} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              Uni<span style={{ color: "#00c4b8" }}>Time</span>
            </span>
            <span className="text-[10px] block tracking-widest uppercase" style={{ color: "#7a9bc0" }}>studeo</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { Icon: Bell, label: "Notificações", badge: 3 },
            { Icon: MessageSquare, label: "Fale com Mediador" },
            { Icon: Search, label: "Buscar" },
          ].map((item) => (
            <button
              key={item.label}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/10"
              style={{ color: "#c8d8e8" }}
            >
              <item.Icon size={16} />
              <span className="hidden lg:inline">{item.label}</span>
              {item.badge && (
                <span className="absolute -top-0.5 left-6 lg:left-auto lg:relative w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "#ef4444" }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">

        {/* Hero section - split layout */}
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1B3A5C 0%, #24506e 50%, #00a89d 100%)" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20 flex flex-col md:flex-row items-center gap-10">

            {/* Left - Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-medium tracking-wide uppercase mb-6" style={{ background: "rgba(255,255,255,0.1)", color: "#00c4b8", border: "1px solid rgba(0,196,184,0.2)" }}>
                <GraduationCap size={13} />
                Portal do Aluno Reestruturado
              </div>

              <h1 className="animate-fade-up text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-white" style={{ animationDelay: "0.1s" }}>
                Sua vida acadêmica
                <br />
                <span className="italic" style={{ fontFamily: "var(--font-instrument)", color: "#00c4b8", fontWeight: 400 }}>
                  em um só lugar
                </span>
              </h1>

              <p className="animate-fade-up text-base md:text-lg leading-relaxed max-w-lg mb-8" style={{ color: "#b8cee0", animationDelay: "0.2s" }}>
                Horários, notas, fórum, financeiro, biblioteca e muito mais.
                Tudo integrado, moderno e fácil de usar — inclusive no celular.
              </p>

              <div className="animate-fade-up flex gap-3 justify-center md:justify-start flex-wrap" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-6">
                  {[
                    { value: "10+", label: "Recursos" },
                    { value: "100%", label: "Gratuito" },
                    { value: "Mobile", label: "Responsivo" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-xl font-bold text-white">{s.value}</div>
                      <div className="text-[10px] uppercase tracking-widest" style={{ color: "#7a9bc0" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Login Card */}
            <div className="animate-fade-up w-full max-w-sm" style={{ animationDelay: "0.2s" }}>
              <div className="p-7 rounded-2xl shadow-2xl" style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00a89d, #00c4b8)" }}>
                    <Clock size={18} className="text-white" />
                  </div>
                  <div>
                    <span className="text-base font-bold" style={{ color: "#1e293b" }}>Acesso ao Portal</span>
                    <span className="text-[10px] block" style={{ color: "#94a3b8" }}>UniTime Studeo</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "#94a3b8" }}>RA do Aluno</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                      <input
                        type="text"
                        placeholder="Ex: 12345678"
                        value={ra}
                        onChange={(e) => setRa(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
                        style={{ background: "#f5f7fa", border: "1px solid #e2e8f0", color: "#1e293b", "--tw-ring-color": "#00a89d" } as React.CSSProperties}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "#94a3b8" }}>Senha</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
                        style={{ background: "#f5f7fa", border: "1px solid #e2e8f0", color: "#1e293b", "--tw-ring-color": "#00a89d" } as React.CSSProperties}
                      />
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.01]"
                    style={{ background: "linear-gradient(135deg, #00a89d, #00c4b8)" }}
                  >
                    Entrar
                    <ArrowRight size={14} />
                  </Link>
                  <div className="text-center">
                    <button className="text-[11px] font-medium transition-colors hover:underline" style={{ color: "#00a89d" }}>
                      Esqueci minha senha
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 mb-3">
                  <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
                  <span className="text-[10px] font-medium" style={{ color: "#94a3b8" }}>ou entre como</span>
                  <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: "Aluno", Icon: GraduationCap },
                    { role: "Professor", Icon: User },
                    { role: "Coordenador", Icon: Shield },
                  ].map((r) => (
                    <Link
                      key={r.role}
                      href="/dashboard"
                      className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-[11px] font-medium transition-all hover:scale-[1.02]"
                      style={{ background: "#f5f7fa", border: "1px solid #e2e8f0", color: "#475569" }}
                    >
                      <r.Icon size={15} />
                      {r.role}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Wave separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full">
              <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z" fill="#f5f7fa" />
            </svg>
          </div>
        </section>

        {/* Disciplinas Matriculadas - like Studeo */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Disciplines table */}
            <div className="flex-1">
              <div className="p-6 rounded-2xl" style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)" }}>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: "#1e293b" }}>Disciplinas Matriculadas</h2>
                <p className="text-xs mb-5" style={{ color: "#94a3b8" }}>Acesso às aulas, atividades, fórum e materiais</p>

                <div className="overflow-hidden rounded-xl" style={{ border: "1px solid #e2e8f0" }}>
                  <div className="grid grid-cols-3 text-[10px] font-bold uppercase tracking-widest px-4 py-2.5" style={{ background: "#f8fafc", color: "#94a3b8", borderBottom: "1px solid #e2e8f0" }}>
                    <span>Disciplina</span>
                    <span className="text-center">Início</span>
                    <span className="text-right">Módulo</span>
                  </div>
                  {[
                    { name: "Análise e Projeto Orientado a Objetos", color: "#f59e0b", tag: "CURRICULAR" },
                    { name: "Mentalidade Criativa e Empreendedora", color: "#7c3aed", tag: "CURRICULAR" },
                    { name: "Programação Front-End", color: "#10b981", tag: "CURRICULAR" },
                    { name: "Estrutura de Dados", color: "#00a89d", tag: "CURRICULAR" },
                  ].map((d) => (
                    <Link
                      href="/dashboard"
                      key={d.name}
                      className="grid grid-cols-3 items-center px-4 py-3 transition-all hover:bg-[#f8fafc] group"
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-8 rounded-full" style={{ background: d.color }} />
                        <div>
                          <span className="text-sm font-medium block group-hover:underline" style={{ color: "#1e293b" }}>{d.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: d.color }}>{d.tag}</span>
                        </div>
                      </div>
                      <span className="text-xs text-center" style={{ color: "#64748b" }}>2026 / 1</span>
                      <div className="flex items-center justify-end gap-1">
                        <ChevronRight size={14} style={{ color: "#94a3b8" }} />
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/dashboard" className="flex items-center justify-center gap-1 mt-4 text-xs font-medium transition-colors hover:underline" style={{ color: "#00a89d" }}>
                  Ir para lista de disciplinas <ChevronRight size={12} />
                </Link>
              </div>
            </div>

            {/* Right cards - like Studeo */}
            <div className="w-full md:w-64 flex flex-col gap-4">
              <Link href="/dashboard" className="p-5 rounded-2xl text-center transition-all hover:scale-[1.02] hover:shadow-lg" style={{ background: "linear-gradient(135deg, #00a89d, #00c4b8)" }}>
                <GraduationCap size={28} className="mx-auto mb-2 text-white" />
                <div className="text-white font-bold text-sm">Disciplinas</div>
                <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>Matriculadas e histórico</div>
              </Link>
              <Link href="/dashboard" className="p-5 rounded-2xl text-center transition-all hover:scale-[1.02] hover:shadow-lg" style={{ background: "#1B3A5C" }}>
                <BookOpen size={28} className="mx-auto mb-2 text-white" />
                <div className="text-white font-bold text-sm">Arquivos</div>
                <div className="text-[11px] mt-0.5" style={{ color: "#7a9bc0" }}>Arquivos gerais do curso</div>
              </Link>
              <Link href="/dashboard" className="p-5 rounded-2xl text-center transition-all hover:scale-[1.02] hover:shadow-lg" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>
                <Lightbulb size={28} className="mx-auto mb-2 text-white" />
                <div className="text-white font-bold text-sm">Eu Indico</div>
                <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>Indique e ganhe descontos</div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features grid - what UniTime improves */}
        <section className="py-16 px-6 md:px-10" style={{ background: "white" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[11px] font-bold tracking-widest uppercase mb-3 block" style={{ color: "#00a89d" }}>O que melhoramos</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "#1e293b" }}>
                Studeo <span className="italic" style={{ fontFamily: "var(--font-instrument)", fontWeight: 400 }}>repensado</span>
              </h2>
              <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: "#64748b" }}>
                Todos os recursos do portal acadêmico, com interface moderna, busca inteligente e experiência mobile real.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { Icon: Calendar, title: "Horários", desc: "Grade semanal visual", color: "#00a89d" },
                { Icon: CheckSquare, title: "Tarefas", desc: "Lista com prioridades", color: "#10b981" },
                { Icon: MessageSquare, title: "Fórum", desc: "Atividades e materiais", color: "#f59e0b" },
                { Icon: Award, title: "Boletim", desc: "Notas por disciplina", color: "#7c3aed" },
                { Icon: Timer, title: "Pomodoro", desc: "Timer de foco 25min", color: "#ef4444" },
                { Icon: DollarSign, title: "Financeiro", desc: "Boletos e pagamentos", color: "#1B3A5C" },
                { Icon: BookOpen, title: "Biblioteca", desc: "Livros e artigos", color: "#0891b2" },
                { Icon: Monitor, title: "Responsivo", desc: "Funciona no celular", color: "#00a89d" },
              ].map((f) => (
                <Link
                  href="/dashboard"
                  key={f.title}
                  className="group p-5 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg card-hover"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110" style={{ background: `${f.color}12` }}>
                    <f.Icon size={20} style={{ color: f.color }} />
                  </div>
                  <h3 className="text-sm font-semibold mb-0.5" style={{ color: "#1e293b" }}>{f.title}</h3>
                  <p className="text-[11px]" style={{ color: "#64748b" }}>{f.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison - Studeo vs UniTime */}
        <section className="max-w-5xl mx-auto px-6 md:px-10 py-16">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold tracking-widest uppercase mb-3 block" style={{ color: "#ef4444" }}>Comparativo</span>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: "#1e293b" }}>
              Studeo Atual <span className="mx-2" style={{ color: "#94a3b8" }}>vs</span> <span style={{ color: "#00a89d" }}>UniTime</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Studeo problems */}
            <div className="p-6 rounded-2xl" style={{ background: "white", border: "1px solid #fecaca" }}>
              <div className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "#ef4444" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
                Problemas do Studeo
              </div>
              <div className="space-y-3">
                {[
                  "Menu com 20+ itens escondidos em submenus",
                  "Interface datada sem dark mode",
                  "Mobile praticamente inutilizável",
                  "Difícil achar informações rapidamente",
                  "Sem busca inteligente",
                  "Sem timer de estudo ou produtividade",
                ].map((p) => (
                  <div key={p} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5" style={{ color: "#ef4444" }}>✕</span>
                    <span className="text-sm" style={{ color: "#64748b" }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* UniTime solutions */}
            <div className="p-6 rounded-2xl" style={{ background: "white", border: "1px solid #a7f3d0" }}>
              <div className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "#10b981" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
                Solução UniTime
              </div>
              <div className="space-y-3">
                {[
                  "Navegação limpa com sidebar organizada",
                  "Dark mode + Light mode com toggle",
                  "100% responsivo, feito para celular",
                  "Busca inteligente com Ctrl+K",
                  "Tudo integrado: notas, fórum, financeiro",
                  "Pomodoro e análise de produtividade",
                ].map((p) => (
                  <div key={p} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5" style={{ color: "#10b981" }}>✓</span>
                    <span className="text-sm" style={{ color: "#1e293b" }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 md:px-10 text-center" style={{ background: "#1B3A5C" }}>
          <span className="text-[11px] font-bold tracking-widest uppercase mb-4 block" style={{ color: "#00c4b8" }}>Acesse agora</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
            Experimente o UniTime
          </h2>
          <p className="text-sm max-w-md mx-auto mb-8" style={{ color: "#7a9bc0" }}>
            O portal acadêmico que você sempre quis. Moderno, rápido e funcional.
          </p>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2.5 px-10 py-3.5 rounded-xl text-white font-semibold text-base transition-all duration-300 hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, #00a89d, #00c4b8)" }}
          >
            Acessar Dashboard
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-6 text-center" style={{ background: "#0f2740" }}>
        <p className="text-sm font-medium" style={{ color: "#7a9bc0" }}>UniTime © 2026 — Igor Schiniegoski Pallisser & Luís Boratto</p>
        <p className="text-[11px] mt-1" style={{ color: "#4a6382" }}>Mentalidade Criativa e Empreendedora · UniCesumar Ponta Grossa · ADS</p>
      </footer>
    </div>
  );
}
