"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: "var(--accent)" }}>U</div>
          <span className="text-xl font-bold text-white">UniTime</span>
        </div>
        <button onClick={() => setShowLogin(true)} className="px-6 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90" style={{ background: "var(--accent)" }}>
          Entrar
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="animate-fade-in max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6" style={{ background: "var(--card)", color: "var(--accent-light)" }}>
            🎓 Feito para estudantes universitários
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Gestão de Tempo<br />
            <span style={{ color: "var(--accent-light)" }}>e Organização</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
            Soluções digitais para estudantes universitários organizarem sua vida acadêmica com eficiência. Produtividade, organização e foco em um só lugar.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/dashboard" className="px-8 py-3 rounded-xl text-white font-semibold text-lg transition-all glow hover:scale-105" style={{ background: "var(--accent)" }}>
              🚀 Começar Agora
            </Link>
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:opacity-80" style={{ background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
              Ver Funcionalidades
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          {[
            { num: "85%", label: "Mais produtividade" },
            { num: "3x", label: "Menos atrasos" },
            { num: "100%", label: "Gratuito" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--accent-light)" }}>{s.num}</div>
              <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <section id="features" className="px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Funcionalidades Principais</h2>
        <p className="text-center mb-12" style={{ color: "var(--muted)" }}>Tudo que você precisa para organizar sua vida acadêmica</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: "🗓️", title: "Gerenciador de Horários", desc: "Crie cronogramas personalizados com aulas, provas e atividades. Lembretes automáticos para manter você no caminho certo." },
            { icon: "✅", title: "Lista de Tarefas Inteligente", desc: "Priorize atividades por prazo e importância. Marque tarefas, adicione notas e defina lembretes personalizados." },
            { icon: "📆", title: "Calendário Integrado", desc: "Visualize eventos e prazos em um calendário unificado. Compartilhe com colegas e professores facilmente." },
          ].map((f, i) => (
            <div key={f.title} className="p-6 rounded-2xl transition-all hover:scale-105 animate-fade-in" style={{ background: "var(--card)", border: "1px solid var(--border)", animationDelay: `${i * 0.15}s` }}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Extra features */}
      <section className="px-8 py-16" style={{ background: "var(--card)" }}>
        <h2 className="text-3xl font-bold text-white text-center mb-4">Recursos Adicionais</h2>
        <p className="text-center mb-12" style={{ color: "var(--muted)" }}>Ferramentas extras para potencializar sua produtividade</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: "🍅", title: "Pomodoro Timer", desc: "Foco em blocos de 25 min com pausas programadas" },
            { icon: "📝", title: "Bloco de Notas", desc: "Anote ideias, insights e lembretes rápidos" },
            { icon: "📊", title: "Análise de Produtividade", desc: "Gráficos de como seu tempo está sendo usado" },
          ].map((f, i) => (
            <div key={f.title} className="p-6 rounded-2xl text-center animate-fade-in" style={{ background: "var(--background)", border: "1px solid var(--border)", animationDelay: `${i * 0.15}s` }}>
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>Inspirado em ferramentas líderes</p>
          <div className="flex justify-center gap-8">
            {[
              { color: "#3b82f6", name: "Trello", sub: "Gerenciamento de projetos" },
              { color: "#ef4444", name: "Todoist", sub: "Lista de tarefas avançada" },
              { color: "#22c55e", name: "Google Calendar", sub: "Calendário integrado" },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                <div className="text-left">
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Transforme sua vida acadêmica</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
          {[
            { icon: "🎯", title: "Mais Foco", desc: "Planejamento visual para saber exatamente o que estudar a cada dia" },
            { icon: "⚡", title: "Mais Eficiência", desc: "Reduza o tempo perdido e maximize os resultados acadêmicos" },
            { icon: "😌", title: "Menos Estresse", desc: "Tenha controle total sobre prazos e evite surpresas de última hora" },
          ].map((c) => (
            <div key={c.title} className="p-4 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-semibold text-white">{c.title}</div>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{c.desc}</p>
            </div>
          ))}
        </div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-bold text-lg transition-all glow hover:scale-105" style={{ background: "var(--accent)" }}>
          🚀 Começar com o UniTime
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-sm border-t" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
        <p>UniTime © 2026 — Igor Schiniegoski Pallisser & Luís Boratto</p>
        <p className="mt-1">Mentalidade Criativa e Empreendedora • CESUMAR • ADS</p>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowLogin(false)}>
          <div className="w-full max-w-sm p-8 rounded-2xl animate-fade-in" style={{ background: "var(--card)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: "var(--accent)" }}>U</div>
              <span className="text-xl font-bold text-white">UniTime</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Bem-vindo de volta</h3>
            <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Entre na sua conta</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white block mb-1">RA do Aluno</label>
                <input type="text" placeholder="Ex: 12345678" className="w-full px-4 py-2.5 rounded-lg text-white outline-none" style={{ background: "var(--background)", border: "1px solid var(--border)" }} />
              </div>
              <div>
                <label className="text-sm font-medium text-white block mb-1">Senha</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg text-white outline-none" style={{ background: "var(--background)", border: "1px solid var(--border)" }} />
              </div>
              <Link href="/dashboard" className="block w-full py-2.5 rounded-lg text-white font-semibold text-center transition-all hover:opacity-90" style={{ background: "var(--accent)" }}>
                Entrar
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span className="text-xs" style={{ color: "var(--muted)" }}>Entrar como</span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Aluno", "Professor", "Coordenador"].map((role) => (
                  <Link key={role} href="/dashboard" className="py-2 rounded-lg text-sm text-center font-medium transition-all hover:opacity-80" style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
                    {role}
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
