"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock, LayoutDashboard, Users, BookOpen, FileText, BarChart3,
  Menu, LogOut, GraduationCap, ChevronRight, Calendar,
  Sun, Coffee, Mail, Phone, User, CheckSquare, TrendingUp, AlertCircle
} from "lucide-react";

// ============ TYPES ============
type Tab = "dashboard" | "cursos" | "professores" | "alunos" | "relatorios";

// ============ DATA ============
const PROFESSORES = [
  { nome: "Prof.a Jessyca K. Franquitto", disciplina: "APOO", email: "jessyca.franquitto@unicesumar.edu.br", telefone: "(44) 99901-1234" },
  { nome: "Prof.o Joao (Goku)", disciplina: "Estrutura de Dados", email: "joao.goku@unicesumar.edu.br", telefone: "(44) 99902-5678" },
  { nome: "Prof.a Emil E. Golombieski", disciplina: "Programacao Front-End", email: "emil.golombieski@unicesumar.edu.br", telefone: "(44) 99903-9012" },
  { nome: "Prof.o Danilo", disciplina: "Mentalidade Criativa e Empreendedora", email: "danilo@unicesumar.edu.br", telefone: "(44) 99904-3456" },
];

const DISCIPLINAS = [
  { nome: "Analise e Projeto Orientado a Objetos", professor: "Prof.a Jessyca K. Franquitto", carga: "80h", semestre: "3o" },
  { nome: "Estrutura de Dados", professor: "Prof.o Joao (Goku)", carga: "80h", semestre: "3o" },
  { nome: "Programacao Front-End", professor: "Prof.a Emil E. Golombieski", carga: "80h", semestre: "3o" },
  { nome: "Mentalidade Criativa e Empreendedora", professor: "Prof.o Danilo", carga: "40h", semestre: "3o" },
];

const ALUNOS = [
  { ra: "23017263", nome: "Igor S. Pallisser", curso: "ADS", semestre: "3o", status: "Ativo" },
  { ra: "23018491", nome: "Luis Boratto", curso: "ADS", semestre: "3o", status: "Ativo" },
  { ra: "23019302", nome: "Ana C. Oliveira", curso: "ADS", semestre: "3o", status: "Ativo" },
  { ra: "23020114", nome: "Carlos E. Souza", curso: "ADS", semestre: "3o", status: "Ativo" },
  { ra: "23021587", nome: "Mariana L. Santos", curso: "ADS", semestre: "3o", status: "Ativo" },
  { ra: "23022390", nome: "Pedro H. Lima", curso: "ADS", semestre: "3o", status: "Trancado" },
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
    { id: "cursos", Icon: BookOpen, label: "Cursos" },
    { id: "professores", Icon: Users, label: "Professores" },
    { id: "alunos", Icon: GraduationCap, label: "Alunos" },
    { id: "relatorios", Icon: BarChart3, label: "Relatorios" },
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
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}>LM</div>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>Leomar E. A. Mecca</div>
              <div className="text-[11px]" style={{ color: "var(--sidebar-muted)" }}>Coordenador . ADS</div>
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
          <h1 className="text-2xl font-bold tracking-tight">{greeting}, Leomar</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Painel do Coordenador</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { Icon: BookOpen, label: "Curso (ADS)", value: "1", color: "var(--accent)", bg: "var(--accent-soft)" },
          { Icon: Users, label: "Professores", value: "8", color: "var(--purple)", bg: "var(--purple-soft)" },
          { Icon: GraduationCap, label: "Alunos Matriculados", value: "245", color: "var(--green)", bg: "var(--green-soft)" },
          { Icon: FileText, label: "Disciplinas", value: "4", color: "var(--amber)", bg: "var(--amber-soft)" },
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
        {/* Professores do Curso */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users size={16} style={{ color: "var(--purple)" }} />
              <h2 className="font-semibold text-sm">Professores do Curso</h2>
            </div>
            <button onClick={() => setTab("professores")} className="flex items-center gap-1 text-xs transition-colors" style={{ color: "var(--accent)" }}>
              Ver tudo <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {PROFESSORES.map((prof, i) => {
              const colors = ["var(--amber)", "var(--accent)", "var(--green)", "var(--purple)"];
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${colors[i]}12` }}>
                    <User size={18} style={{ color: colors[i] }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{prof.nome}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{prof.disciplina}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Visao Geral */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{ color: "var(--green)" }} />
              <h2 className="font-semibold text-sm">Visao Geral</h2>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: "Taxa de aprovacao", value: "78%", color: "var(--green)", width: "78%" },
              { label: "Media geral", value: "7.2", color: "var(--accent)", width: "72%" },
              { label: "Evasao", value: "5%", color: "var(--red)", width: "5%" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.label}</span>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: "var(--bg-primary)" }}>
                  <div className="h-2 rounded-full transition-all" style={{ background: item.color, width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============ CURSOS VIEW ============
function CursosView() {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Cursos</h1>
      </div>

      <Card hover={false}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-soft)" }}>
            <GraduationCap size={28} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Analise e Desenvolvimento de Sistemas</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tecnologia . 5 Semestres . Noturno</p>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-6">
          {[
            { label: "Alunos", value: "245" },
            { label: "Professores", value: "8" },
            { label: "Disciplinas", value: "4" },
            { label: "Coord.", value: "Leomar Mecca" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-bold" style={{ color: "var(--accent)" }}>{item.value}</div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{item.label}</div>
            </div>
          ))}
        </div>

        <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Disciplinas do 3o Semestre</h3>
        <div className="space-y-2.5">
          {DISCIPLINAS.map((disc, i) => {
            const colors = ["var(--amber)", "var(--accent)", "var(--green)", "var(--purple)"];
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${colors[i]}12` }}>
                  <BookOpen size={18} style={{ color: colors[i] }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{disc.nome}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{disc.professor} . {disc.carga}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ============ PROFESSORES VIEW ============
function ProfessoresView() {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <Users size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Professores</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROFESSORES.map((prof, i) => {
          const colors = ["var(--amber)", "var(--accent)", "var(--green)", "var(--purple)"];
          const initials = prof.nome.split(" ").filter((_, idx) => idx === 0 || idx === prof.nome.split(" ").length - 1).map((w) => w[0]).join("").replace("P", "").slice(0, 2).toUpperCase();
          return (
            <Card key={i}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${colors[i]}, ${colors[i]}cc)` }}>
                  {initials || "PR"}
                </div>
                <div>
                  <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{prof.nome}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{prof.disciplina}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <Mail size={12} style={{ color: "var(--text-muted)" }} />
                  {prof.email}
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <Phone size={12} style={{ color: "var(--text-muted)" }} />
                  {prof.telefone}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ============ ALUNOS VIEW ============
function AlunosView() {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <GraduationCap size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Alunos</h1>
      </div>

      <Card hover={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>RA</th>
                <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Nome</th>
                <th className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Curso</th>
                <th className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Semestre</th>
                <th className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ALUNOS.map((aluno) => {
                const statusColor = aluno.status === "Ativo" ? "var(--green)" : "var(--amber)";
                return (
                  <tr key={aluno.ra} className="row-hover" style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="py-3 px-3" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{aluno.ra}</td>
                    <td className="py-3 px-3 font-medium" style={{ color: "var(--text-primary)" }}>{aluno.nome}</td>
                    <td className="py-3 px-3 text-center" style={{ color: "var(--text-secondary)" }}>{aluno.curso}</td>
                    <td className="py-3 px-3 text-center" style={{ color: "var(--text-secondary)" }}>{aluno.semestre}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[11px] px-2 py-0.5 rounded-lg font-medium" style={{ background: `${statusColor}15`, color: statusColor }}>{aluno.status}</span>
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

// ============ RELATORIOS VIEW ============
function RelatoriosView() {
  const semesterData = [
    { label: "1o Sem", aprovados: 85, reprovados: 15 },
    { label: "2o Sem", aprovados: 78, reprovados: 22 },
    { label: "3o Sem", aprovados: 72, reprovados: 28 },
  ];

  const gradeDistribution = [
    { range: "0-2", count: 5, color: "var(--red)" },
    { range: "2-4", count: 12, color: "var(--red)" },
    { range: "4-6", count: 35, color: "var(--amber)" },
    { range: "6-8", count: 120, color: "var(--green)" },
    { range: "8-10", count: 73, color: "var(--accent)" },
  ];

  const maxCount = Math.max(...gradeDistribution.map((g) => g.count));

  const attendanceData = [
    { disciplina: "APOO", presenca: 92 },
    { disciplina: "Estrutura de Dados", presenca: 85 },
    { disciplina: "Front-End", presenca: 88 },
    { disciplina: "Mentalidade Criativa", presenca: 78 },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Relatorios</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Aprovacao por Semestre */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} style={{ color: "var(--green)" }} />
            <h2 className="font-semibold text-sm">Aprovacao por Semestre</h2>
          </div>
          <div className="space-y-4">
            {semesterData.map((sem, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{sem.label}</span>
                  <span className="text-xs font-bold" style={{ color: "var(--green)" }}>{sem.aprovados}%</span>
                </div>
                <div className="w-full h-6 rounded-lg overflow-hidden flex" style={{ background: "var(--bg-primary)" }}>
                  <div className="h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: "var(--green)", width: `${sem.aprovados}%` }}>
                    {sem.aprovados}%
                  </div>
                  <div className="h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: "var(--red)", width: `${sem.reprovados}%` }}>
                    {sem.reprovados}%
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ background: "var(--green)" }} />
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Aprovados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ background: "var(--red)" }} />
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Reprovados</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Distribuicao de Notas */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={16} style={{ color: "var(--accent)" }} />
            <h2 className="font-semibold text-sm">Distribuicao de Notas</h2>
          </div>
          <div className="flex items-end gap-3 h-40">
            {gradeDistribution.map((g, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold" style={{ color: g.color }}>{g.count}</span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    background: g.color,
                    height: `${(g.count / maxCount) * 100}%`,
                    minHeight: "8px",
                  }}
                />
                <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{g.range}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Frequencia por Disciplina */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <CheckSquare size={16} style={{ color: "var(--amber)" }} />
            <h2 className="font-semibold text-sm">Frequencia por Disciplina</h2>
          </div>
          <div className="space-y-4">
            {attendanceData.map((item, i) => {
              const color = item.presenca >= 90 ? "var(--green)" : item.presenca >= 80 ? "var(--amber)" : "var(--red)";
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.disciplina}</span>
                    <span className="text-sm font-bold" style={{ color }}>{item.presenca}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: "var(--bg-primary)" }}>
                    <div className="h-2 rounded-full transition-all" style={{ background: color, width: `${item.presenca}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Indicadores */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <AlertCircle size={16} style={{ color: "var(--purple)" }} />
            <h2 className="font-semibold text-sm">Indicadores Gerais</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Media geral do curso", value: "7.2", color: "var(--accent)" },
              { label: "Taxa de evasao", value: "5%", color: "var(--red)" },
              { label: "Alunos em DP", value: "18", color: "var(--amber)" },
              { label: "Formandos previstos", value: "42", color: "var(--green)" },
              { label: "Satisfacao (NPS)", value: "8.1", color: "var(--purple)" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>{item.label}</span>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function CoordenadorDashboard() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const views: Record<Tab, React.ReactNode> = {
    dashboard: <DashboardView setTab={setTab} />,
    cursos: <CursosView />,
    professores: <ProfessoresView />,
    alunos: <AlunosView />,
    relatorios: <RelatoriosView />,
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
