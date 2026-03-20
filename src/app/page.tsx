"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock, CheckSquare, Calendar, BarChart3, Zap, Target, Heart,
  ArrowRight, GraduationCap, Layout, Timer, StickyNote, X,
  User, Lock, ChevronRight
} from "lucide-react";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen flex flex-col noise-bg gradient-mesh" style={{ fontFamily: "var(--font-dm-sans)" }}>
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full animate-float" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full animate-float" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)", animationDelay: "3s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-glow" style={{ background: "linear-gradient(135deg, var(--accent), #818cf8)" }}>
            <Clock size={20} className="text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Uni<span style={{ color: "var(--accent)" }}>Time</span>
          </span>
        </div>
        <button
          onClick={() => setShowLogin(true)}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
          style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          Entrar
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center pt-8 pb-24">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium tracking-wide uppercase mb-10" style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <GraduationCap size={14} />
            Feito para estudantes universitários
          </div>

          {/* Title */}
          <h1 className="animate-fade-up text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-8" style={{ animationDelay: "0.1s" }}>
            <span style={{ color: "var(--text-primary)" }}>Gestão de</span>
            <br />
            <span className="italic" style={{ fontFamily: "var(--font-instrument)", color: "var(--accent)", fontWeight: 400 }}>
              Tempo & Organização
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12" style={{ color: "var(--text-secondary)", animationDelay: "0.2s" }}>
            Produtividade, organização e foco em um único ambiente digital. Projetado para a rotina acadêmica.
          </p>

          {/* CTA */}
          <div className="animate-fade-up flex gap-4 justify-center flex-wrap" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/dashboard"
              className="group flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all duration-300 hover:scale-[1.03] animate-glow"
              style={{ background: "linear-gradient(135deg, var(--accent), #818cf8)" }}
            >
              Começar Agora
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-base transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            >
              Explorar
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="animate-fade-up grid grid-cols-3 gap-12 mt-24" style={{ animationDelay: "0.5s" }}>
          {[
            { value: "85%", label: "Mais produtividade", icon: BarChart3 },
            { value: "3x", label: "Menos atrasos", icon: Zap },
            { value: "100%", label: "Gratuito", icon: Heart },
          ].map((s) => (
            <div key={s.label} className="text-center group">
              <div className="flex items-center justify-center gap-2 mb-1">
                <s.icon size={16} style={{ color: "var(--accent)" }} />
                <span className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{s.value}</span>
              </div>
              <span className="text-xs tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <section id="features" className="relative z-10 px-8 py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-medium tracking-widest uppercase mb-4 block" style={{ color: "var(--accent)" }}>Funcionalidades</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Tudo em um <span className="italic" style={{ fontFamily: "var(--font-instrument)", fontWeight: 400 }}>só lugar</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            { Icon: Calendar, title: "Gerenciador de Horários", desc: "Cronogramas personalizados com aulas, provas e atividades. Lembretes automáticos para manter você no caminho.", color: "var(--accent)" },
            { Icon: CheckSquare, title: "Tarefas Inteligentes", desc: "Priorize por prazo e importância. Marque, adicione notas e defina lembretes personalizados para cada tarefa.", color: "var(--green)" },
            { Icon: Layout, title: "Calendário Integrado", desc: "Visualize eventos e prazos em um calendário unificado. Compartilhe com colegas e professores.", color: "var(--amber)" },
          ].map((f, i) => (
            <div
              key={f.title}
              className="group p-7 rounded-2xl transition-all duration-500 hover:scale-[1.02] animate-fade-up"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", animationDelay: `${0.6 + i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300" style={{ background: `${f.color}12` }}>
                <f.Icon size={22} style={{ color: f.color }} />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Extra features */}
      <section className="relative z-10 px-8 py-20" style={{ background: "var(--bg-secondary)" }}>
        <div className="text-center mb-16">
          <span className="text-xs font-medium tracking-widest uppercase mb-4 block" style={{ color: "var(--green)" }}>Recursos extras</span>
          <h2 className="text-4xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Potencialize sua <span className="italic" style={{ fontFamily: "var(--font-instrument)", fontWeight: 400 }}>produtividade</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { Icon: Timer, title: "Pomodoro Timer", desc: "Sessões de 25 min com pausas programadas", color: "var(--red)" },
            { Icon: StickyNote, title: "Bloco de Notas", desc: "Anote ideias, insights e lembretes", color: "var(--amber)" },
            { Icon: BarChart3, title: "Análise de Produtividade", desc: "Gráficos do uso do seu tempo", color: "var(--purple)" },
          ].map((f, i) => (
            <div key={f.title} className="p-6 rounded-2xl text-center group transition-all duration-300 hover:scale-[1.02] animate-fade-up" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", animationDelay: `${i * 0.1}s` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${f.color}12` }}>
                <f.Icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-xs tracking-widest uppercase mb-5" style={{ color: "var(--text-muted)" }}>Inspirado em</p>
          <div className="flex justify-center gap-10">
            {[
              { color: "#3b82f6", name: "Trello" },
              { color: "#ef4444", name: "Todoist" },
              { color: "#22c55e", name: "Google Calendar" },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 px-8 py-28 text-center">
        <span className="text-xs font-medium tracking-widest uppercase mb-6 block" style={{ color: "var(--accent)" }}>Comece hoje</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{ color: "var(--text-primary)" }}>
          Transforme sua vida<br />
          <span className="italic" style={{ fontFamily: "var(--font-instrument)", fontWeight: 400 }}>acadêmica</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto mb-14">
          {[
            { Icon: Target, title: "Mais Foco", desc: "Saiba exatamente o que estudar a cada dia" },
            { Icon: Zap, title: "Mais Eficiência", desc: "Maximize resultados, reduza tempo perdido" },
            { Icon: Heart, title: "Menos Estresse", desc: "Controle total sobre prazos e entregas" },
          ].map((c) => (
            <div key={c.title} className="p-5 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <c.Icon size={20} className="mx-auto mb-3" style={{ color: "var(--accent)" }} />
              <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{c.title}</div>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{c.desc}</p>
            </div>
          ))}
        </div>
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.03] animate-glow"
          style={{ background: "linear-gradient(135deg, var(--accent), #818cf8)" }}
        >
          Começar com o UniTime
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-8 text-center border-t" style={{ borderColor: "var(--border)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>UniTime © 2026 — Igor Schiniegoski Pallisser & Luís Boratto</p>
        <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>Mentalidade Criativa e Empreendedora · CESUMAR · ADS</p>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }} onClick={() => setShowLogin(false)}>
          <div className="w-full max-w-sm p-8 rounded-2xl animate-fade-up" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--accent), #818cf8)" }}>
                  <Clock size={18} className="text-white" />
                </div>
                <span className="text-lg font-semibold">Uni<span style={{ color: "var(--accent)" }}>Time</span></span>
              </div>
              <button onClick={() => setShowLogin(false)} className="p-1.5 rounded-lg transition-colors hover:bg-white/5">
                <X size={16} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            <h3 className="text-xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Bem-vindo de volta</h3>
            <p className="text-sm mb-7" style={{ color: "var(--text-secondary)" }}>Entre na sua conta acadêmica</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>RA do Aluno</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input type="text" placeholder="Ex: 12345678" className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-1" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)", "--tw-ring-color": "var(--accent)" } as React.CSSProperties} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>Senha</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-1" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)", "--tw-ring-color": "var(--accent)" } as React.CSSProperties} />
                </div>
              </div>
              <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--accent), #818cf8)" }}>
                Entrar
                <ArrowRight size={14} />
              </Link>
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>ou entre como</span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: "Aluno", Icon: GraduationCap },
                  { role: "Professor", Icon: User },
                  { role: "Coordenador", Icon: Layout },
                ].map((r) => (
                  <Link key={r.role} href="/dashboard" className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                    <r.Icon size={16} />
                    {r.role}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
