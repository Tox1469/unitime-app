"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock, LayoutDashboard, Users, FileText, MessageSquare, Calendar,
  Menu, LogOut, BookOpen, CheckSquare, ChevronRight, X,
  Sun, Coffee, ClipboardList, PenLine, Send, Plus, Trash2
} from "lucide-react";

// ============ TYPES ============
type Tab = "dashboard" | "turmas" | "notas" | "forum" | "horarios";

// ============ DATA ============
const TURMAS = [
  { id: 1, nome: "ADS 3o Sem - APOO", periodo: "Noturno", alunos: 32, cor: "var(--amber)" },
  { id: 2, nome: "ADS 3o Sem - APOO Noturno", periodo: "Noturno", alunos: 28, cor: "var(--accent)" },
  { id: 3, nome: "CC 4o Sem - APOO", periodo: "Noturno", alunos: 35, cor: "var(--green)" },
  { id: 4, nome: "SI 3o Sem - APOO", periodo: "Noturno", alunos: 25, cor: "var(--purple)" },
];

const ALUNOS_TURMA_1 = [
  { ra: "23017263", nome: "Igor S. Pallisser", n1: 8.0, n2: 7.5, n3: "--" },
  { ra: "23018491", nome: "Luis Boratto", n1: 7.5, n2: 8.0, n3: "--" },
  { ra: "23019302", nome: "Ana C. Oliveira", n1: 9.0, n2: 8.5, n3: "--" },
  { ra: "23020114", nome: "Carlos E. Souza", n1: 6.5, n2: 7.0, n3: "--" },
  { ra: "23021587", nome: "Mariana L. Santos", n1: 8.5, n2: 9.0, n3: "--" },
  { ra: "23022390", nome: "Pedro H. Lima", n1: 7.0, n2: 6.0, n3: "--" },
  { ra: "23023678", nome: "Julia F. Costa", n1: 9.5, n2: 9.0, n3: "--" },
  { ra: "23024901", nome: "Rafael M. Dias", n1: 5.5, n2: 6.5, n3: "--" },
];

const ATIVIDADES_RECENTES = [
  { titulo: "Trabalho Diagrama UML", status: "25 entregas de 32", prazo: "08/04", cor: "var(--amber)" },
  { titulo: "Slides Design Patterns", status: "Material postado", prazo: "17/03", cor: "var(--green)" },
  { titulo: "Prova 1o Bimestre", status: "Notas lancadas", prazo: "15/03", cor: "var(--accent)" },
];

const FORUM_POSTS = [
  { id: 1, titulo: "Trabalho 1 - Diagrama UML", descricao: "Elaborar diagrama de classes para o sistema proposto em aula.", data: "10/03", respostas: 18 },
  { id: 2, titulo: "Material - Design Patterns", descricao: "Slides da aula sobre padroes de projeto (Strategy, Observer, Factory).", data: "17/03", respostas: 5 },
  { id: 3, titulo: "Aviso - Prova 1o Bimestre", descricao: "Conteudo: UML, SOLID, Design Patterns. Prova individual sem consulta.", data: "08/03", respostas: 12 },
  { id: 4, titulo: "Lista de Exercicios - SOLID", descricao: "Resolver os 5 exercicios sobre principios SOLID ate sexta.", data: "03/03", respostas: 22 },
];

const HORARIOS = [
  { day: "Segunda", items: [] as { time: string; turma: string; sala: string }[] },
  { day: "Terca", items: [{ time: "19:00", turma: "ADS 3o Sem - APOO", sala: "Sala 37 . Terreo" }, { time: "21:00", turma: "ADS 3o Sem - APOO", sala: "Sala 37 . Terreo" }] },
  { day: "Quarta", items: [{ time: "19:00", turma: "CC 4o Sem - APOO", sala: "Sala 12 . 2o Andar" }, { time: "21:00", turma: "CC 4o Sem - APOO", sala: "Sala 12 . 2o Andar" }] },
  { day: "Quinta", items: [{ time: "19:00", turma: "SI 3o Sem - APOO", sala: "Sala 08 . Terreo" }, { time: "21:00", turma: "ADS 3o Sem - APOO Noturno", sala: "Sala 37 . Terreo" }] },
  { day: "Sexta", items: [] as { time: string; turma: string; sala: string }[] },
];

// ============ CARD COMPONENT ============
function Card({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 ${hover ? "card-hover" : ""} ${className}`} style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      {children}
    </div>
  );
}

// ============ SIDEBAR ============
function Sidebar({ tab, setTab, open, onClose }: { tab: Tab; setTab: (t: Tab) => void; open: boolean; onClose: () => void }) {
  const items: { id: Tab; Icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
    { id: "turmas", Icon: Users, label: "Minhas Turmas" },
    { id: "notas", Icon: ClipboardList, label: "Lancar Notas" },
    { id: "forum", Icon: MessageSquare, label: "Forum" },
    { id: "horarios", Icon: Calendar, label: "Horarios" },
  ];

  const handleTabClick = (id: Tab) => {
    setTab(id);
    onClose();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        />
      )}
      <aside
        className={`w-[260px] flex-shrink-0 flex flex-col h-screen z-50 transition-transform duration-300 fixed md:sticky top-0 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: "var(--sidebar-bg)", borderRight: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Link href="/" className="flex items-center gap-3 px-6 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--accent), #00c4b8)" }}>
            <Clock size={18} className="text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight" style={{ color: "var(--sidebar-text)" }}>
            Uni<span style={{ color: "var(--accent)" }}>Time</span>
          </span>
        </Link>

        <nav className="flex-1 py-5 px-3 overflow-y-auto">
          <p className="text-[10px] font-medium tracking-widest uppercase px-4 mb-2" style={{ color: "var(--sidebar-muted)" }}>MENU</p>
          <div className="space-y-0.5">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className="sidebar-item w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left group"
                style={{
                  background: tab === item.id ? "rgba(0,168,157,0.15)" : "transparent",
                  color: tab === item.id ? "var(--accent)" : "var(--sidebar-muted)",
                  border: tab === item.id ? "1px solid rgba(0,168,157,0.25)" : "1px solid transparent",
                }}
              >
                <item.Icon size={18} />
                {item.label}
                {tab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />}
              </button>
            ))}
          </div>
        </nav>

        <div className="px-4 py-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="sidebar-item flex items-center gap-3 w-full text-left rounded-xl px-2 py-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, var(--accent), #a78bfa)" }}>JF</div>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>Prof.a Jessyca K. Franquitto</div>
              <div className="text-[11px]" style={{ color: "var(--sidebar-muted)" }}>APOO . ADS</div>
            </div>
          </div>
          <Link
            href="/"
            className="sidebar-item flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ color: "#ef6b6b" }}
          >
            <LogOut size={18} />
            Sair
          </Link>
        </div>
      </aside>
    </>
  );
}

// ============ DASHBOARD VIEW ============
function DashboardView({ setTab }: { setTab: (t: Tab) => void }) {
  const today = new Date();
  const greeting = today.getHours() < 12 ? "Bom dia" : today.getHours() < 18 ? "Boa tarde" : "Boa noite";
  const GreetIcon = today.getHours() < 12 ? Sun : today.getHours() < 18 ? Coffee : Clock;

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GreetIcon size={18} style={{ color: "var(--amber)" }} />
          <h1 className="text-2xl font-bold tracking-tight">{greeting}, Prof.a Jessyca</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Painel do Professor</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { Icon: Users, label: "Turmas", value: "4", color: "var(--accent)", bg: "var(--accent-soft)" },
          { Icon: Users, label: "Alunos", value: "120", color: "var(--green)", bg: "var(--green-soft)" },
          { Icon: CheckSquare, label: "Atividades Pendentes", value: "3", color: "var(--amber)", bg: "var(--amber-soft)" },
          { Icon: FileText, label: "Trabalhos para Corrigir", value: "15", color: "var(--red)", bg: "var(--red-soft)" },
        ].map((s) => (
          <Card key={s.label}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.Icon size={18} style={{ color: s.color }} />
              </div>
              <span className="text-2xl font-bold tracking-tight" style={{ color: s.color }}>{s.value}</span>
            </div>
            <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Minhas Turmas */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users size={16} style={{ color: "var(--accent)" }} />
              <h2 className="font-semibold text-sm">Minhas Turmas</h2>
            </div>
            <button onClick={() => setTab("turmas")} className="flex items-center gap-1 text-xs transition-colors" style={{ color: "var(--accent)" }}>
              Ver tudo <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {TURMAS.map((turma) => (
              <div key={turma.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${turma.cor}12` }}>
                  <BookOpen size={18} style={{ color: turma.cor }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{turma.nome}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{turma.alunos} alunos</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Atividades Recentes */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ClipboardList size={16} style={{ color: "var(--amber)" }} />
              <h2 className="font-semibold text-sm">Atividades Recentes</h2>
            </div>
          </div>
          <div className="space-y-2.5">
            {ATIVIDADES_RECENTES.map((at, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: at.cor }} />
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{at.titulo}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{at.status}</div>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-lg flex-shrink-0" style={{ background: "var(--bg-card)", color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{at.prazo}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============ TURMAS VIEW ============
function TurmasView() {
  const [selectedTurma, setSelectedTurma] = useState<number | null>(null);

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <Users size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Minhas Turmas</h1>
      </div>

      {selectedTurma === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TURMAS.map((turma) => (
            <Card key={turma.id}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${turma.cor}12` }}>
                  <BookOpen size={22} style={{ color: turma.cor }} />
                </div>
                <div>
                  <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{turma.nome}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{turma.periodo} . {turma.alunos} alunos</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTurma(turma.id)}
                className="flex items-center gap-1 text-xs font-medium transition-colors"
                style={{ color: "var(--accent)" }}
              >
                Ver alunos <ChevronRight size={12} />
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedTurma(null)}
            className="flex items-center gap-1 text-sm font-medium mb-4 transition-colors"
            style={{ color: "var(--accent)" }}
          >
            ← Voltar para turmas
          </button>
          <Card hover={false}>
            <div className="flex items-center gap-3 mb-5">
              <BookOpen size={18} style={{ color: "var(--accent)" }} />
              <h2 className="font-semibold text-sm">{TURMAS.find((t) => t.id === selectedTurma)?.nome} - Lista de Alunos</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>RA</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Nome</th>
                    <th className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>N1</th>
                    <th className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>N2</th>
                    <th className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>N3</th>
                  </tr>
                </thead>
                <tbody>
                  {ALUNOS_TURMA_1.map((aluno) => (
                    <tr key={aluno.ra} className="row-hover" style={{ borderBottom: "1px solid var(--border)" }}>
                      <td className="py-3 px-3" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{aluno.ra}</td>
                      <td className="py-3 px-3 font-medium" style={{ color: "var(--text-primary)" }}>{aluno.nome}</td>
                      <td className="py-3 px-3 text-center" style={{ color: "var(--text-primary)" }}>{aluno.n1}</td>
                      <td className="py-3 px-3 text-center" style={{ color: "var(--text-primary)" }}>{aluno.n2}</td>
                      <td className="py-3 px-3 text-center" style={{ color: "var(--text-muted)" }}>{aluno.n3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ============ NOTAS VIEW ============
function NotasView() {
  const [selectedTurma, setSelectedTurma] = useState(TURMAS[0].id);
  const turma = TURMAS.find((t) => t.id === selectedTurma);

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <ClipboardList size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Lancar Notas</h1>
      </div>

      {/* Turma selector */}
      <div className="flex flex-wrap gap-2">
        {TURMAS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTurma(t.id)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: selectedTurma === t.id ? "var(--accent)" : "var(--bg-card)",
              color: selectedTurma === t.id ? "white" : "var(--text-secondary)",
              border: `1px solid ${selectedTurma === t.id ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {t.nome}
          </button>
        ))}
      </div>

      <Card hover={false}>
        <div className="flex items-center gap-3 mb-5">
          <PenLine size={16} style={{ color: "var(--accent)" }} />
          <h2 className="font-semibold text-sm">{turma?.nome} - Boletim</h2>
          <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>{turma?.alunos} alunos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>RA</th>
                <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Nome</th>
                <th className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>N1</th>
                <th className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>N2</th>
                <th className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>N3</th>
                <th className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Media</th>
                <th className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ALUNOS_TURMA_1.map((aluno) => {
                const n1 = typeof aluno.n1 === "number" ? aluno.n1 : 0;
                const n2 = typeof aluno.n2 === "number" ? aluno.n2 : 0;
                const media = aluno.n3 === "--" ? ((n1 + n2) / 2) : ((n1 + n2 + Number(aluno.n3)) / 3);
                const status = aluno.n3 === "--" ? "Parcial" : media >= 6 ? "Aprovado" : "Reprovado";
                const statusColor = aluno.n3 === "--" ? "var(--amber)" : media >= 6 ? "var(--green)" : "var(--red)";
                return (
                  <tr key={aluno.ra} className="row-hover" style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="py-3 px-3" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{aluno.ra}</td>
                    <td className="py-3 px-3 font-medium" style={{ color: "var(--text-primary)" }}>{aluno.nome}</td>
                    <td className="py-3 px-3 text-center" style={{ color: "var(--text-primary)" }}>{aluno.n1}</td>
                    <td className="py-3 px-3 text-center" style={{ color: "var(--text-primary)" }}>{aluno.n2}</td>
                    <td className="py-3 px-3 text-center" style={{ color: "var(--text-muted)" }}>{aluno.n3}</td>
                    <td className="py-3 px-3 text-center font-semibold" style={{ color: statusColor }}>{media.toFixed(1)}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[11px] px-2 py-0.5 rounded-lg font-medium" style={{ background: `${statusColor}15`, color: statusColor }}>{status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ============ FORUM VIEW ============
function ForumView() {
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} style={{ color: "var(--accent)" }} />
          <h1 className="text-2xl font-bold tracking-tight">Forum</h1>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          <Plus size={14} />
          Nova Postagem
        </button>
      </div>

      {showNew && (
        <Card hover={false}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Nova Postagem</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Titulo da postagem"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)", "--tw-ring-color": "var(--accent)" } as React.CSSProperties}
            />
            <textarea
              placeholder="Descricao..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 resize-none"
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)", "--tw-ring-color": "var(--accent)" } as React.CSSProperties}
            />
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: "var(--accent)" }}>
                <Send size={14} /> Publicar
              </button>
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                Cancelar
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {FORUM_POSTS.map((post) => (
          <Card key={post.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{post.titulo}</h3>
                <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{post.descricao}</p>
                <div className="flex items-center gap-4">
                  <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{post.data}</span>
                  <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--accent)" }}>
                    <MessageSquare size={10} /> {post.respostas} respostas
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============ HORARIOS VIEW ============
function HorariosView() {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <Calendar size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Horarios</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {HORARIOS.map((day) => (
          <div key={day.day} className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 text-center text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, var(--accent), #00c4b8)" }}>{day.day}</div>
            <div className="p-3 space-y-2.5">
              {day.items.length === 0 ? (
                <p className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>Sem aulas</p>
              ) : (
                day.items.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: "var(--bg-primary)", borderLeft: "3px solid var(--accent)" }}>
                    <div className="text-[11px] font-medium mb-1.5" style={{ color: "var(--accent)", fontFamily: "var(--font-jetbrains)" }}>{item.time}</div>
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.turma}</div>
                    <div className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>{item.sala}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function ProfessorDashboard() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const views: Record<Tab, React.ReactNode> = {
    dashboard: <DashboardView setTab={setTab} />,
    turmas: <TurmasView />,
    notas: <NotasView />,
    forum: <ForumView />,
    horarios: <HorariosView />,
  };

  return (
    <div className="flex min-h-screen noise-bg" style={{ background: "var(--bg-primary)", fontFamily: "var(--font-dm-sans)" }}>
      <Sidebar tab={tab} setTab={setTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main id="main-content" className="flex-1 p-4 md:p-8 overflow-auto md:ml-0 w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <Menu size={20} style={{ color: "var(--text-secondary)" }} />
          </button>
          <div className="ml-auto" />
        </div>
        {views[tab]}
      </main>
    </div>
  );
}
