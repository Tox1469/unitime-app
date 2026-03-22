"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Clock, CheckSquare, Calendar, BarChart3, StickyNote, TrendingUp,
  LayoutDashboard, Plus, Trash2, ChevronRight,
  BookOpen, Laptop, Globe, Calculator, Code, Award, Coffee,
  Sun, Moon, X, Info, Server, Database, Users, Rocket, DollarSign, Shield,
  Layers, ArrowRight, GitBranch, Cpu, Cloud, Smartphone, GraduationCap,
  Search, Menu, Lightbulb, Monitor, MessageSquare, FileText, Upload, LogOut,
  Download, Paperclip, Send, AlertCircle, CreditCard, Briefcase,
  ExternalLink, ChevronDown, Settings, User, Mail, Phone, MapPin,
  Bell, Ruler, ToggleLeft, ToggleRight
} from "lucide-react";

// ============ TYPES ============
type Task = { id: number; text: string; done: boolean; priority: "alta" | "media" | "baixa"; date: string };
type Note = { id: number; text: string; date: string };
type Tab = "dashboard" | "horarios" | "tarefas" | "calendario" | "boletim" | "forum" | "financeiro" | "servicos" | "biblioteca" | "sobre" | "perfil";

type Notification = {
  id: number;
  text: string;
  time: string;
  read: boolean;
  type: "prazo" | "nota" | "aviso" | "forum";
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, text: "Prova de Estrutura de Dados em 3 dias", time: "Ha 2h", read: false, type: "prazo" },
  { id: 2, text: "Prof.a Jessyca postou novo material em APOO", time: "Ha 5h", read: false, type: "forum" },
  { id: 3, text: "Nota do 1o bimestre lancada em Front-End", time: "Ha 1 dia", read: false, type: "nota" },
  { id: 4, text: "Prazo do trabalho de Mentalidade Criativa amanha", time: "Ha 1 dia", read: true, type: "prazo" },
  { id: 5, text: "Aula de quinta sera no Lab 2", time: "Ha 2 dias", read: true, type: "aviso" },
];

// ============ DATA ============
const SCHEDULE = [
  { day: "Segunda", items: [] as { time: string; name: string; room: string; color: string; Icon: React.ComponentType<{ size?: number }> }[] },
  { day: "Terça", items: [{ time: "19:00", name: "Análise e Projeto Orientado a Objetos", room: "Sala 37 · Térreo", color: "var(--amber)", Icon: BookOpen }, { time: "21:00", name: "Análise e Projeto Orientado a Objetos", room: "Sala 37 · Térreo", color: "var(--amber)", Icon: BookOpen }] },
  { day: "Quarta", items: [{ time: "19:00", name: "Estrutura de Dados", room: "Sala 37 · Térreo", color: "var(--accent)", Icon: Code }, { time: "21:00", name: "Estrutura de Dados", room: "Sala 37 · Térreo", color: "var(--accent)", Icon: Code }] },
  { day: "Quinta", items: [{ time: "19:00", name: "Programação Front-End", room: "Sala 37 · Térreo", color: "var(--green)", Icon: Monitor }, { time: "21:00", name: "Programação Front-End", room: "Sala 37 · Térreo", color: "var(--green)", Icon: Monitor }] },
  { day: "Sexta", items: [{ time: "19:00", name: "Mentalidade Criativa e Empreendedora", room: "Sala 37 · Térreo", color: "var(--purple)", Icon: Lightbulb }, { time: "21:00", name: "Mentalidade Criativa e Empreendedora", room: "Sala 37 · Térreo", color: "var(--purple)", Icon: Lightbulb }] },
];

const CALENDAR_EVENTS = [
  { day: 3, title: "Prova Estrutura de Dados", color: "var(--red)" },
  { day: 8, title: "Entrega Trabalho APOO", color: "var(--amber)" },
  { day: 12, title: "Seminário Mentalidade Criativa", color: "var(--purple)" },
  { day: 15, title: "Semana Acadêmica", color: "var(--green)" },
  { day: 18, title: "Prova Programação Front-End", color: "var(--red)" },
  { day: 25, title: "Entrega Projeto Front-End", color: "var(--green)" },
];

const INITIAL_TASKS: Task[] = [
  { id: 1, text: "Estudar para prova de Estrutura de Dados", done: false, priority: "alta", date: "03/04" },
  { id: 2, text: "Finalizar trabalho de APOO", done: false, priority: "alta", date: "08/04" },
  { id: 3, text: "Preparar seminário de Mentalidade Criativa", done: true, priority: "media", date: "12/04" },
  { id: 4, text: "Revisar matéria de Programação Front-End", done: false, priority: "media", date: "18/04" },
  { id: 5, text: "Fazer exercícios de HTML/CSS/JS", done: true, priority: "baixa", date: "10/04" },
  { id: 6, text: "Projeto final de Front-End", done: false, priority: "alta", date: "25/04" },
];

const INITIAL_NOTES: Note[] = [
  { id: 1, text: "Lembrar de pegar o livro na biblioteca", date: "18/03" },
  { id: 2, text: "Grupo do seminário: Igor, Luís, Ana, Carlos", date: "15/03" },
  { id: 3, text: "Prof. João (Goku) vai passar lista extra de exercícios de ED", date: "19/03" },
];


const GRADES_DATA = [
  { subject: "Análise e Projeto Orientado a Objetos", professor: "Prof.ª Jessyca K. Franquitto", n1: 8.0, n2: 7.5, n3: "--" as string | number, color: "var(--amber)", Icon: BookOpen },
  { subject: "Estrutura de Dados", professor: "Prof.º João (Goku)", n1: 7.0, n2: 6.5, n3: "--" as string | number, color: "var(--accent)", Icon: Code },
  { subject: "Programação Front-End", professor: "Prof.ª Emil E. Golombieski", n1: 9.0, n2: 8.5, n3: "--" as string | number, color: "var(--green)", Icon: Monitor },
  { subject: "Mentalidade Criativa e Empreendedora", professor: "Prof.º Danilo", n1: 8.5, n2: 9.0, n3: "--" as string | number, color: "var(--purple)", Icon: Lightbulb },
];

// ============ SIDEBAR ============
function Sidebar({ tab, setTab, open, onClose }: { tab: Tab; setTab: (t: Tab) => void; open: boolean; onClose: () => void }) {
  const sections: { label: string; items: { id: Tab; Icon: React.ComponentType<{ size?: number }>; label: string }[] }[] = [
    {
      label: "PRINCIPAL",
      items: [
        { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
        { id: "horarios", Icon: Calendar, label: "Horarios" },
        { id: "tarefas", Icon: CheckSquare, label: "Tarefas" },
        { id: "calendario", Icon: Calendar, label: "Calendario" },
      ],
    },
    {
      label: "ACADEMICO",
      items: [
        { id: "forum", Icon: MessageSquare, label: "Forum" },
        { id: "boletim", Icon: Award, label: "Boletim" },
      ],
    },
    {
      label: "SERVICOS",
      items: [
        { id: "financeiro", Icon: DollarSign, label: "Financeiro" },
        { id: "servicos", Icon: Briefcase, label: "Servicos" },
        { id: "biblioteca", Icon: BookOpen, label: "Biblioteca" },
      ],
    },
    {
      label: "CONTA",
      items: [
        { id: "perfil", Icon: User, label: "Perfil" },
        { id: "sobre", Icon: Info, label: "Sobre o Projeto" },
      ],
    },
  ];

  const handleTabClick = (id: Tab) => {
    setTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
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
          {sections.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="text-[10px] font-medium tracking-widest uppercase px-4 mb-2" style={{ color: "var(--sidebar-muted)" }}>{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
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
            </div>
          ))}
        </nav>

        <div className="px-4 py-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => { setTab("perfil"); onClose(); }} className="sidebar-item flex items-center gap-3 w-full text-left rounded-xl px-2 py-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, var(--accent), #a78bfa)" }}>IS</div>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>Igor S. Pallisser</div>
              <div className="text-[11px]" style={{ color: "var(--sidebar-muted)" }}>ADS · 3o Semestre</div>
            </div>
          </button>
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

// ============ CARD COMPONENT ============
function Card({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 ${hover ? "card-hover" : ""} ${className}`} style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      {children}
    </div>
  );
}

// ============ VIEWS ============
function DashboardView({ setTab, notifications }: { setTab: (t: Tab) => void; notifications: Notification[] }) {
  const today = new Date();
  const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const greeting = today.getHours() < 12 ? "Bom dia" : today.getHours() < 18 ? "Boa tarde" : "Boa noite";
  const GreetIcon = today.getHours() < 12 ? Sun : today.getHours() < 18 ? Coffee : Clock;

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GreetIcon size={18} style={{ color: "var(--amber)" }} />
            <h1 className="text-2xl font-bold tracking-tight">{greeting}, Igor</h1>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{dayNames[today.getDay()]}, {today.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { Icon: BookOpen, label: "Tarefas Pendentes", value: "4", color: "var(--amber)", bg: "var(--amber-soft)" },
          { Icon: CheckSquare, label: "Concluidas", value: "2", color: "var(--green)", bg: "var(--green-soft)" },
          { Icon: Bell, label: "Notificacoes", value: String(notifications.filter((n) => !n.read).length), color: "var(--red)", bg: "var(--red-soft)" },
          { Icon: Award, label: "Horas Complementares", value: "45/120h", color: "var(--accent)", bg: "var(--accent-soft)" },
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
        {/* Today */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar size={16} style={{ color: "var(--accent)" }} />
              <h2 className="font-semibold text-sm">Aulas de Hoje</h2>
            </div>
            <button onClick={() => setTab("horarios")} className="flex items-center gap-1 text-xs transition-colors" style={{ color: "var(--accent)" }}>
              Ver tudo <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {(SCHEDULE[Math.min(Math.max(today.getDay() - 1, 0), 4)]?.items?.length ? SCHEDULE[Math.min(Math.max(today.getDay() - 1, 0), 4)].items : SCHEDULE[1].items).map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-colors" style={{ background: "var(--bg-primary)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}12` }}>
                  <item.Icon size={18} style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{item.time} · {item.room}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tasks */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CheckSquare size={16} style={{ color: "var(--green)" }} />
              <h2 className="font-semibold text-sm">Próximas Tarefas</h2>
            </div>
            <button onClick={() => setTab("tarefas")} className="flex items-center gap-1 text-xs transition-colors" style={{ color: "var(--accent)" }}>
              Ver tudo <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {INITIAL_TASKS.filter((t) => !t.done).slice(0, 4).map((task) => {
              const pc = task.priority === "alta" ? "var(--red)" : task.priority === "media" ? "var(--amber)" : "var(--green)";
              return (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pc }} />
                    <span className="text-sm" style={{ color: "var(--text-primary)" }}>{task.text}</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-lg flex-shrink-0" style={{ background: "var(--bg-card)", color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{task.date}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Bell size={16} style={{ color: "var(--red)" }} />
            <h2 className="font-semibold text-sm">Notificacoes Recentes</h2>
          </div>
        </div>
        <div className="space-y-2.5">
          {notifications.filter((n) => !n.read).slice(0, 3).map((notif) => {
            const typeColors: Record<Notification["type"], string> = { prazo: "var(--red)", nota: "var(--green)", aviso: "var(--amber)", forum: "var(--accent)" };
            const nc = typeColors[notif.type];
            return (
              <div key={notif.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: nc }} />
                <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>{notif.text}</span>
                <span className="text-[11px] flex-shrink-0" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{notif.time}</span>
              </div>
            );
          })}
          {notifications.filter((n) => !n.read).length === 0 && (
            <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>Nenhuma notificacao pendente</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function HorariosView() {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <Calendar size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Gerenciador de Horários</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {SCHEDULE.map((day) => (
          <div key={day.day} className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 text-center text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, var(--accent), #00c4b8)" }}>{day.day}</div>
            <div className="p-3 space-y-2.5">
              {day.items.map((item, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: "var(--bg-primary)", borderLeft: `3px solid ${item.color}` }}>
                  <div className="text-[11px] font-medium mb-1.5" style={{ color: "var(--accent)", fontFamily: "var(--font-jetbrains)" }}>{item.time}</div>
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.name}</div>
                  <div className="text-[11px] mt-1 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <item.Icon size={10} /> {item.room}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TarefasView() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTask, setNewTask] = useState("");

  const toggleTask = (id: number) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((prev) => [...prev, { id: Date.now(), text: newTask, done: false, priority: "media", date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) }]);
    setNewTask("");
  };
  const deleteTask = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const pc = (p: string) => p === "alta" ? "var(--red)" : p === "media" ? "var(--amber)" : "var(--green)";
  const pl = (p: string) => p === "alta" ? "Alta" : p === "media" ? "Média" : "Baixa";

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <CheckSquare size={20} style={{ color: "var(--green)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Lista de Tarefas</h1>
      </div>

      <div className="flex gap-3">
        <input value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Adicionar nova tarefa..."
          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", "--tw-ring-color": "var(--accent)" } as React.CSSProperties} />
        <button onClick={addTask} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--accent), #00c4b8)" }}>
          <Plus size={16} /> Adicionar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: "Todas", count: tasks.length, color: "var(--accent)", bg: "var(--accent-soft)" },
          { label: "Pendentes", count: tasks.filter((t) => !t.done).length, color: "var(--amber)", bg: "var(--amber-soft)" },
          { label: "Concluídas", count: tasks.filter((t) => t.done).length, color: "var(--green)", bg: "var(--green-soft)" },
        ].map((f) => (
          <Card key={f.label}>
            <div className="text-2xl font-bold" style={{ color: f.color }}>{f.count}</div>
            <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{f.label}</div>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 p-4 rounded-xl transition-all group" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", opacity: task.done ? 0.5 : 1 }}>
            <button onClick={() => toggleTask(task.id)} className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-all" style={{ border: `2px solid ${task.done ? "var(--accent)" : "var(--border)"}`, background: task.done ? "var(--accent)" : "transparent" }}>
              {task.done && <span className="text-white text-[10px] font-bold">✓</span>}
            </button>
            <span className={`flex-1 text-sm ${task.done ? "line-through" : ""}`} style={{ color: task.done ? "var(--text-muted)" : "var(--text-primary)" }}>{task.text}</span>
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-lg" style={{ background: `${pc(task.priority)}12`, color: pc(task.priority) }}>{pl(task.priority)}</span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{task.date}</span>
            <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all hover:bg-red-500/10">
              <Trash2 size={14} style={{ color: "var(--red)" }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarioView() {
  const daysInMonth = 30;
  const firstDayOffset = 2;
  const days = Array.from({ length: 42 }, (_, i) => { const d = i - firstDayOffset + 1; return d > 0 && d <= daysInMonth ? d : null; });

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <Calendar size={20} style={{ color: "var(--amber)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Calendário — Abril 2026</h1>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-7 text-center text-xs font-semibold py-3 text-white" style={{ background: "linear-gradient(135deg, var(--accent), #00c4b8)" }}>
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const ev = CALENDAR_EVENTS.find((e) => e.day === day);
            return (
              <div key={i} className="p-2 min-h-[85px]" style={{ borderTop: "1px solid var(--border)", borderRight: "1px solid var(--border)", background: day ? "transparent" : "var(--bg-primary)" }}>
                {day && (
                  <>
                    <div className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>{day}</div>
                    {ev && <div className="text-[10px] p-1.5 rounded-lg font-medium" style={{ background: `${ev.color}12`, color: ev.color }}>{ev.title}</div>}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} style={{ color: "var(--accent)" }} />
          <h3 className="font-semibold text-sm">Próximos Eventos</h3>
        </div>
        <div className="space-y-2">
          {CALENDAR_EVENTS.map((e, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
              <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>{e.title}</span>
              <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{e.day}/04</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


function NotasView() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [{ id: Date.now(), text: newNote, date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) }, ...prev]);
    setNewNote("");
  };
  const deleteNote = (id: number) => setNotes((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <StickyNote size={20} style={{ color: "var(--amber)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Bloco de Notas</h1>
      </div>

      <div className="flex gap-3">
        <input value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNote()} placeholder="Escreva uma nota rápida..."
          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", "--tw-ring-color": "var(--accent)" } as React.CSSProperties} />
        <button onClick={addNote} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: "linear-gradient(135deg, var(--accent), #00c4b8)" }}>
          <Plus size={16} /> Salvar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note, i) => (
          <div key={note.id} className="p-5 rounded-2xl group relative transition-all hover:scale-[1.01] animate-fade-up" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", animationDelay: `${i * 0.05}s` }}>
            <button onClick={() => deleteNote(note.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all hover:bg-red-500/10">
              <X size={14} style={{ color: "var(--red)" }} />
            </button>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{note.text}</p>
            <p className="text-[11px] mt-3" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{note.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============ FORUM ============
type ForumPost = {
  id: number;
  subject: string;
  subjectColor: string;
  SubjectIcon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  professor: string;
  title: string;
  description: string;
  date: string;
  deadline?: string;
  type: "atividade" | "material" | "aviso";
  attachments: { name: string; size: string }[];
  submitted: boolean;
  submittedFile?: string;
};

const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 1,
    subject: "Estrutura de Dados",
    subjectColor: "var(--accent)",
    SubjectIcon: Code,
    professor: "Prof.º João (Goku)",
    title: "Lista de Exercícios 3 — Árvores Binárias",
    description: "Resolver os exercícios 1 a 15 sobre árvores binárias de busca. Entregar em PDF ou código fonte comentado. Pode ser feito em dupla.",
    date: "18/03/2026",
    deadline: "02/04/2026",
    type: "atividade",
    attachments: [{ name: "Lista3_ArvoresBinarias.pdf", size: "245 KB" }, { name: "exemplos_arvores.zip", size: "1.2 MB" }],
    submitted: false,
  },
  {
    id: 2,
    subject: "Programação Front-End",
    subjectColor: "var(--green)",
    SubjectIcon: Monitor,
    professor: "Prof.ª Emil E. Golombieski",
    title: "Projeto Final — Landing Page Responsiva",
    description: "Criar uma landing page completa utilizando HTML5, CSS3 e JavaScript. Deve ser responsiva e ter pelo menos 3 seções. Usar Flexbox ou Grid. Entregar o link do GitHub.",
    date: "15/03/2026",
    deadline: "25/04/2026",
    type: "atividade",
    attachments: [{ name: "Requisitos_ProjetoFinal.pdf", size: "180 KB" }],
    submitted: false,
  },
  {
    id: 3,
    subject: "Análise e Projeto Orientado a Objetos",
    subjectColor: "var(--amber)",
    SubjectIcon: BookOpen,
    professor: "Prof.ª Jessyca K. Franquitto",
    title: "Slides — Padrões de Projeto (Design Patterns)",
    description: "Material da aula sobre Padrões de Projeto: Singleton, Factory, Observer e Strategy. Estudar para a prova.",
    date: "17/03/2026",
    type: "material",
    attachments: [{ name: "Aula07_DesignPatterns.pdf", size: "3.8 MB" }, { name: "Exemplos_Java.zip", size: "890 KB" }],
    submitted: false,
  },
  {
    id: 4,
    subject: "Mentalidade Criativa e Empreendedora",
    subjectColor: "var(--purple)",
    SubjectIcon: Lightbulb,
    professor: "Prof.º Danilo",
    title: "Trabalho — Protótipo Tecnológico",
    description: "Desenvolver um protótipo funcional de solução tecnológica para o ambiente universitário. Grupos de até 4 pessoas. Apresentação ao vivo na última aula.",
    date: "10/03/2026",
    deadline: "12/04/2026",
    type: "atividade",
    attachments: [{ name: "Prototipo.pdf", size: "320 KB" }],
    submitted: true,
    submittedFile: "UniTime_Prototipo_IgorLuis.pdf",
  },
  {
    id: 5,
    subject: "Estrutura de Dados",
    subjectColor: "var(--accent)",
    SubjectIcon: Code,
    professor: "Prof.º João (Goku)",
    title: "Material — Grafos e Algoritmos de Busca",
    description: "Slides e código de exemplo sobre grafos, BFS e DFS. Revisem antes da próxima aula.",
    date: "19/03/2026",
    type: "material",
    attachments: [{ name: "Aula09_Grafos.pdf", size: "2.1 MB" }, { name: "grafo_bfs_dfs.py", size: "4 KB" }],
    submitted: false,
  },
  {
    id: 6,
    subject: "Programação Front-End",
    subjectColor: "var(--green)",
    SubjectIcon: Monitor,
    professor: "Prof.ª Emil E. Golombieski",
    title: "Aviso — Aula prática no laboratório",
    description: "A aula de quinta (20/03) será no Lab 2 em vez da Sala 37. Tragam seus notebooks carregados. Vamos trabalhar com React na prática.",
    date: "18/03/2026",
    type: "aviso",
    attachments: [],
    submitted: false,
  },
  {
    id: 7,
    subject: "Análise e Projeto Orientado a Objetos",
    subjectColor: "var(--amber)",
    SubjectIcon: BookOpen,
    professor: "Prof.ª Jessyca K. Franquitto",
    title: "Trabalho — Diagrama de Classes UML",
    description: "Modelar um sistema de sua escolha usando diagrama de classes UML. Mínimo 8 classes com herança, composição e interfaces. Entregar no formato .astah ou imagem PNG.",
    date: "12/03/2026",
    deadline: "08/04/2026",
    type: "atividade",
    attachments: [{ name: "Roteiro_DiagramaClasses.pdf", size: "150 KB" }],
    submitted: true,
    submittedFile: "DiagramaUML_UniTime.astah",
  },
];

function ForumView() {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"todos" | "atividade" | "material" | "aviso">("todos");

  const subjects = [
    { name: "Análise e Projeto Orientado a Objetos", professor: "Prof.ª Jessyca K. Franquitto", color: "var(--amber)", Icon: BookOpen },
    { name: "Estrutura de Dados", professor: "Prof.º João (Goku)", color: "var(--accent)", Icon: Code },
    { name: "Programação Front-End", professor: "Prof.ª Emil E. Golombieski", color: "var(--green)", Icon: Monitor },
    { name: "Mentalidade Criativa e Empreendedora", professor: "Prof.º Danilo", color: "var(--purple)", Icon: Lightbulb },
  ];

  const handleSubmit = (id: number) => {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, submitted: true, submittedFile: "Trabalho_Igor_Luis.pdf" } : p));
    setUploadingId(null);
  };

  const typeConfig = {
    atividade: { label: "Atividade", color: "var(--red)", Icon: FileText },
    material: { label: "Material", color: "var(--accent)", Icon: Download },
    aviso: { label: "Aviso", color: "var(--amber)", Icon: AlertCircle },
  };

  // Subject list view
  if (!selectedSubject) {
    return (
      <div className="animate-fade-up space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} style={{ color: "var(--accent)" }} />
          <h1 className="text-2xl font-bold tracking-tight">Fórum</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Escolha uma disciplina para acessar o fórum, atividades e materiais.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((s) => {
            const subPosts = posts.filter((p) => p.subject === s.name);
            const pending = subPosts.filter((p) => p.type === "atividade" && !p.submitted).length;
            const total = subPosts.length;
            return (
              <button
                key={s.name}
                onClick={() => setSelectedSubject(s.name)}
                className="p-5 rounded-2xl text-left card-hover group"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${s.color}12` }}>
                    <s.Icon size={22} style={{ color: s.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>{s.name}</h3>
                    <p className="text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>{s.professor}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>{total} posts</span>
                      {pending > 0 && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg" style={{ background: "var(--red-soft)", color: "var(--red)" }}>{pending} pendente{pending > 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} className="mt-2 transition-transform group-hover:translate-x-1" style={{ color: "var(--text-muted)" }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Subject detail view
  const currentSubject = subjects.find((s) => s.name === selectedSubject)!;
  const subjectPosts = posts.filter((p) => p.subject === selectedSubject && (filter === "todos" || p.type === filter));

  return (
    <div className="animate-fade-up space-y-6">
      {/* Back + title */}
      <div>
        <button onClick={() => { setSelectedSubject(null); setFilter("todos"); }} className="flex items-center gap-1 text-xs font-medium mb-3 transition-colors hover:underline" style={{ color: "var(--accent)" }}>
          <ChevronRight size={12} style={{ transform: "rotate(180deg)" }} /> Voltar para disciplinas
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${currentSubject.color}12` }}>
            <currentSubject.Icon size={20} style={{ color: currentSubject.color }} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{selectedSubject}</h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{currentSubject.professor}</p>
          </div>
        </div>
      </div>

      {/* Pending deadlines highlight */}
      {(() => {
        const pendingPosts = posts.filter((p) => p.subject === selectedSubject && p.type === "atividade" && !p.submitted && p.deadline);
        if (pendingPosts.length === 0) return null;
        return (
          <div className="space-y-2">
            {pendingPosts.map((p) => {
              const deadlineDate = new Date(p.deadline!.split("/").reverse().join("-"));
              const now = new Date();
              const diffMs = deadlineDate.getTime() - now.getTime();
              const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
              const isOverdue = diffDays < 0;
              const isUrgent = diffDays >= 0 && diffDays <= 3;
              const color = isOverdue ? "var(--red)" : isUrgent ? "var(--amber)" : "var(--accent)";
              const bg = isOverdue ? "var(--red-soft)" : isUrgent ? "var(--amber-soft)" : "var(--accent-soft)";
              const timeText = isOverdue ? `Atrasado ${Math.abs(diffDays)} dia${Math.abs(diffDays) > 1 ? "s" : ""}` : diffDays === 0 ? "Vence HOJE" : diffDays === 1 ? "Vence amanhã" : `Faltam ${diffDays} dias`;

              return (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: bg, border: `1px solid ${color}25` }}>
                  <AlertCircle size={16} style={{ color }} />
                  <div className="flex-1">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{p.title}</span>
                    <span className="text-[11px] block" style={{ color: "var(--text-muted)" }}>Prazo: {p.deadline}</span>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ background: `${color}18`, color }}>{timeText}</span>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "todos" as const, label: "Todos" },
          { id: "atividade" as const, label: "Atividades" },
          { id: "material" as const, label: "Materiais" },
          { id: "aviso" as const, label: "Avisos" },
        ].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} className="px-4 py-2 rounded-xl text-xs font-medium transition-all" style={{ background: filter === f.id ? "var(--accent)" : "var(--bg-card)", color: filter === f.id ? "white" : "var(--text-secondary)", border: `1px solid ${filter === f.id ? "transparent" : "var(--border)"}` }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {subjectPosts.map((post) => {
          const tc = typeConfig[post.type];
          const isExpanded = expandedPost === post.id;
          const isOverdue = post.deadline && new Date(post.deadline.split("/").reverse().join("-")) < new Date() && !post.submitted;

          return (
            <div key={post.id} className="rounded-2xl overflow-hidden forum-post-hover" style={{ background: "var(--bg-card)", border: `1px solid ${isExpanded ? currentSubject.color + "40" : "var(--border)"}` }}>
              <button onClick={() => setExpandedPost(isExpanded ? null : post.id)} className="w-full p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${tc.color}12` }}>
                    <tc.Icon size={16} style={{ color: tc.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-lg font-medium" style={{ background: `${tc.color}12`, color: tc.color }}>{tc.label}</span>
                      {post.type === "atividade" && post.submitted && <span className="text-[10px] px-2 py-0.5 rounded-lg font-medium" style={{ background: "var(--green-soft)", color: "var(--green)" }}>Enviado</span>}
                      {isOverdue && <span className="text-[10px] px-2 py-0.5 rounded-lg font-medium" style={{ background: "var(--red-soft)", color: "var(--red)" }}>Atrasado</span>}
                    </div>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{post.date}</span>
                      {post.deadline && <span className="text-[11px]" style={{ color: isOverdue ? "var(--red)" : "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>Prazo: {post.deadline}</span>}
                      {post.attachments.length > 0 && <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--text-muted)" }}><Paperclip size={10} />{post.attachments.length} arquivo{post.attachments.length > 1 ? "s" : ""}</span>}
                    </div>
                  </div>
                  <ChevronRight size={14} className="flex-shrink-0 transition-transform" style={{ color: "var(--text-muted)", transform: isExpanded ? "rotate(90deg)" : "none" }} />
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <p className="text-sm leading-relaxed pt-3" style={{ color: "var(--text-secondary)" }}>{post.description}</p>

                  {post.attachments.length > 0 && (
                    <div className="space-y-2">
                      {post.attachments.map((att) => (
                        <div key={att.name} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01]" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                          <Paperclip size={14} style={{ color: currentSubject.color }} />
                          <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>{att.name}</span>
                          <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{att.size}</span>
                          <Download size={14} style={{ color: "var(--accent)" }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {post.type === "atividade" && (
                    <div className="p-3 rounded-xl" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                      {post.submitted ? (
                        <div className="flex items-center gap-3">
                          <CheckSquare size={16} style={{ color: "var(--green)" }} />
                          <div>
                            <span className="text-sm font-medium" style={{ color: "var(--green)" }}>Trabalho enviado</span>
                            <span className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color: "var(--text-muted)" }}><Paperclip size={10} />{post.submittedFile}</span>
                          </div>
                        </div>
                      ) : uploadingId === post.id ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-2 rounded-lg" style={{ border: "1px dashed var(--accent)" }}>
                            <FileText size={14} style={{ color: "var(--accent)" }} />
                            <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>Trabalho_Igor_Luis.pdf</span>
                            <button onClick={() => setUploadingId(null)} className="p-1"><X size={12} style={{ color: "var(--red)" }} /></button>
                          </div>
                          <button onClick={() => handleSubmit(post.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: "var(--accent)" }}>
                            <Send size={14} /> Enviar
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setUploadingId(post.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ color: "var(--accent)", border: "1px dashed rgba(0,168,157,0.3)" }}>
                          <Upload size={14} /> Enviar trabalho
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {subjectPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare size={28} className="mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Nenhuma postagem neste filtro</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ FINANCEIRO ============
function FinanceiroView() {
  const [expandedBill, setExpandedBill] = useState<number | null>(null);

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <DollarSign size={20} style={{ color: "var(--green)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--green-soft)" }}>
              <DollarSign size={18} style={{ color: "var(--green)" }} />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: "var(--green)" }}>R$ 431,27</div>
          <div className="text-xs font-medium mt-1" style={{ color: "var(--text-muted)" }}>Mensalidade Atual</div>
        </Card>
        <Card>
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-soft)" }}>
              <Calendar size={18} style={{ color: "var(--accent)" }} />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight" style={{ color: "var(--accent)" }}>08/04/2026</div>
          <div className="text-xs font-medium mt-1" style={{ color: "var(--text-muted)" }}>Proximo Vencimento</div>
        </Card>
        <Card>
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--green-soft)" }}>
              <CheckSquare size={18} style={{ color: "var(--green)" }} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--green)" }}>Em dia</span>
            <span className="text-[11px] px-2.5 py-1 rounded-lg font-medium" style={{ background: "var(--green-soft)", color: "var(--green)" }}>OK</span>
          </div>
          <div className="text-xs font-medium mt-1" style={{ color: "var(--text-muted)" }}>Situacao</div>
        </Card>
      </div>

      {/* Cobrancas em Aberto */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <FileText size={16} style={{ color: "var(--amber)" }} />
          <h2 className="font-semibold text-sm">Cobrancas em Aberto</h2>
        </div>
        <div className="space-y-3">
          {[
            { id: 1042419307, desc: "Mensalidade Competencia 2026/4", valor: "R$ 431,27", venc: "08/04/2026", status: "Pendente", statusColor: "var(--amber)" },
          ].map((bill) => (
            <div key={bill.id} className="rounded-xl p-4" style={{ background: "var(--bg-primary)", borderLeft: `3px solid ${bill.statusColor}` }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg" style={{ background: "var(--bg-card)", color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>#{bill.id}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-lg font-medium" style={{ background: `${bill.statusColor}18`, color: bill.statusColor }}>{bill.status}</span>
                  </div>
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{bill.desc}</div>
                  <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Vencimento: {bill.venc}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{bill.valor}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {["PIX", "Cartao", "Boleto"].map((method) => (
                      <button
                        key={method}
                        className="text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-[1.02]"
                        style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid rgba(0,168,157,0.15)" }}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Historico de Pagamentos */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <CreditCard size={16} style={{ color: "var(--green)" }} />
          <h2 className="font-semibold text-sm">Historico de Pagamentos</h2>
        </div>
        <div className="space-y-2.5">
          {[
            { comp: "2026/3", valor: "R$ 431,27", pago: "05/03/2026", status: "Pago", color: "var(--green)" },
            { comp: "2026/2", valor: "R$ 431,27", pago: "07/02/2026", status: "Pago", color: "var(--green)" },
            { comp: "2026/1", valor: "R$ 431,27", pago: "08/01/2026", status: "Pago", color: "var(--green)" },
          ].map((p) => (
            <div key={p.comp} className="flex items-center justify-between p-3 rounded-xl row-hover" style={{ background: "var(--bg-primary)" }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                <div>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Competencia {p.comp}</span>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Pago em {p.pago}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{p.valor}</div>
                <span className="text-[11px] px-2 py-0.5 rounded-lg font-medium" style={{ background: `${p.color}18`, color: p.color }}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Acesso Rapido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Negociacao de Dividas", desc: "Renegociar parcelas em atraso", Icon: DollarSign, color: "var(--amber)" },
          { label: "2a Via de Boleto", desc: "Gerar segunda via do boleto", Icon: FileText, color: "var(--accent)" },
        ].map((item) => (
          <button key={item.label} className="text-left rounded-2xl p-5 transition-all hover:scale-[1.01]" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}18` }}>
                <item.Icon size={18} style={{ color: item.color }} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.label}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</div>
              </div>
              <ChevronRight size={14} className="ml-auto" style={{ color: "var(--text-muted)" }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ SERVICOS ============
function ServicosView() {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <Briefcase size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Servicos</h1>
      </div>

      {/* Horas Complementares */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Award size={16} style={{ color: "var(--accent)" }} />
          <h2 className="font-semibold text-sm">Horas Complementares</h2>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>45h concluidas de 120h</span>
            <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>37,5%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--bg-primary)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: "37.5%", background: "var(--accent)" }} />
          </div>
        </div>

        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>Faltam 75h para completar</p>

        {/* Categories */}
        <div className="space-y-2">
          {[
            { label: "Eventos academicos", hours: "20h", color: "var(--green)" },
            { label: "Cursos online", hours: "15h", color: "var(--accent)" },
            { label: "Monitoria", hours: "10h", color: "var(--amber)" },
            { label: "Extensao", hours: "0h", color: "var(--text-muted)" },
          ].map((cat) => (
            <div key={cat.label} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: "var(--bg-primary)" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{cat.label}</span>
              </div>
              <span className="text-xs font-semibold" style={{ color: cat.color, fontFamily: "var(--font-jetbrains)" }}>{cat.hours}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick access grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Carteirinha Online", desc: "Gerar carteirinha digital", Icon: CreditCard, color: "var(--accent)" },
          { title: "Documentacao Academica", desc: "Historico, atestados e comprovantes", Icon: FileText, color: "var(--green)" },
          { title: "Declaracoes", desc: "Declaracao de matricula e frequencia", Icon: FileText, color: "var(--amber)" },
          { title: "Solicitacao de Servicos", desc: "Abrir chamado academico", Icon: Send, color: "var(--purple)" },
          { title: "Atualizar Dados Cadastrais", desc: "Alterar endereco, telefone, email", Icon: Users, color: "var(--red)" },
          { title: "Guia do Estudante", desc: "Manual do aluno UniCesumar", Icon: BookOpen, color: "var(--accent)" },
        ].map((item) => (
          <button
            key={item.title}
            className="text-left rounded-2xl p-5 transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color}18` }}>
              <item.Icon size={20} style={{ color: item.color }} />
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{item.title}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Solicitacoes Recentes */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <FileText size={16} style={{ color: "var(--accent)" }} />
          <h2 className="font-semibold text-sm">Solicitacoes Recentes</h2>
        </div>
        <div className="space-y-2.5">
          {[
            { id: "2026-0847", desc: "Declaracao de Matricula", date: "15/03/2026", status: "Concluido", color: "var(--green)" },
            { id: "2026-0823", desc: "Trancamento de Disciplina", date: "10/03/2026", status: "Em analise", color: "var(--amber)" },
            { id: "2026-0801", desc: "2a Via Carteirinha", date: "02/03/2026", status: "Concluido", color: "var(--green)" },
          ].map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg" style={{ background: "var(--bg-card)", color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>#{s.id}</span>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{s.desc}</span>
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{s.date}</div>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-lg font-medium flex-shrink-0" style={{ background: `${s.color}18`, color: s.color }}>{s.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============ BIBLIOTECA ============
function BibliotecaView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const materiaisPorDisciplina = [
    { subject: "Estrutura de Dados", color: "var(--accent)", items: ["Algoritmos - Thomas Cormen (e-book)", "Estrutura de Dados em C - Celes (PDF)"] },
    { subject: "APOO", color: "var(--amber)", items: ["Design Patterns - Gang of Four (e-book)", "UML Essencial - Martin Fowler (PDF)"] },
    { subject: "Programacao Front-End", color: "var(--green)", items: ["JavaScript: The Good Parts (e-book)", "MDN Web Docs (link)"] },
    { subject: "Mentalidade Criativa", color: "var(--purple)", items: ["Lean Startup - Eric Ries (e-book)", "Business Model Canvas (PDF)"] },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Biblioteca</h1>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Pesquisar livros, artigos e materiais..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
        />
      </div>

      {/* Acesso Rapido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Biblioteca Digital", desc: "Acervo de e-books e materiais digitais", Icon: BookOpen, color: "var(--accent)" },
          { title: "Pesquisa de Artigos", desc: "Base de dados cientificos e academicos", Icon: Search, color: "var(--green)" },
          { title: "IEEE Xplore", desc: "Periodicos de engenharia e tecnologia", Icon: Globe, color: "var(--amber)" },
          { title: "Repositorio Institucional", desc: "Trabalhos academicos da UniCesumar", Icon: Database, color: "var(--purple)" },
        ].map((item) => (
          <button
            key={item.title}
            className="text-left rounded-2xl p-5 transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color}18` }}>
              <item.Icon size={20} style={{ color: item.color }} />
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{item.title}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Materiais por Disciplina */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={16} style={{ color: "var(--accent)" }} />
          <h2 className="font-semibold text-sm">Materiais por Disciplina</h2>
        </div>
        <div className="space-y-2">
          {materiaisPorDisciplina.map((disc) => (
            <div key={disc.subject} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <button
                className="w-full flex items-center justify-between p-3.5 text-left transition-all"
                style={{ background: expandedSubject === disc.subject ? "var(--bg-primary)" : "transparent" }}
                onClick={() => setExpandedSubject(expandedSubject === disc.subject ? null : disc.subject)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: disc.color }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{disc.subject}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-lg" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>{disc.items.length} materiais</span>
                </div>
                <ChevronDown
                  size={14}
                  style={{
                    color: "var(--text-muted)",
                    transform: expandedSubject === disc.subject ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              {expandedSubject === disc.subject && (
                <div className="px-3.5 pb-3.5 space-y-2">
                  {disc.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: "var(--bg-primary)" }}>
                      <FileText size={14} style={{ color: disc.color }} />
                      <span className="text-sm" style={{ color: "var(--text-primary)" }}>{item}</span>
                      <ExternalLink size={12} className="ml-auto flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Emprestimos Ativos */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={16} style={{ color: "var(--amber)" }} />
          <h2 className="font-semibold text-sm">Emprestimos Ativos</h2>
        </div>
        <div className="space-y-2.5">
          {[
            { title: "Algoritmos e Estrutura de Dados", retirado: "10/03", devolucao: "24/03", status: "No prazo", color: "var(--green)" },
            { title: "Clean Code - Robert C. Martin", retirado: "05/03", devolucao: "19/03", status: "Atrasado", color: "var(--red)" },
          ].map((emp) => (
            <div key={emp.title} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--bg-primary)", borderLeft: `3px solid ${emp.color}` }}>
              <div>
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{emp.title}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>Retirado: {emp.retirado} · Devolucao: {emp.devolucao}</div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-lg font-medium flex-shrink-0" style={{ background: `${emp.color}18`, color: emp.color }}>{emp.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============ SOBRE O PROJETO ============
function SobreView() {
  return (
    <div className="animate-fade-up space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Info size={20} style={{ color: "var(--accent)" }} />
          <h1 className="text-2xl font-bold tracking-tight">Sobre o Projeto</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Documentacao tecnica e visao geral do sistema UniTime
        </p>
      </div>

      {/* Estrutura Obrigatoria */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Rocket size={18} style={{ color: "var(--accent)" }} />
          <h2 className="text-lg font-bold">Estrutura do Projeto</h2>
        </div>
        <div className="space-y-5">
          {[
            { label: "Nome do Sistema", value: "UniTime — Gestao de Tempo Academico", color: "var(--accent)" },
            { label: "Problema", value: "Estudantes universitarios enfrentam dificuldade para organizar horarios, prazos de trabalhos, provas e atividades extracurriculares. A falta de uma ferramenta centralizada causa atrasos, esquecimentos e queda na produtividade academica.", color: "var(--red)" },
            { label: "Solucao", value: "Uma plataforma web integrada que reune gerenciamento de horarios, lista de tarefas com prioridades, calendario academico, timer Pomodoro, bloco de notas e analise de produtividade — tudo em um unico ambiente digital.", color: "var(--green)" },
            { label: "Como Funciona", value: "O aluno acessa o sistema via navegador, cadastra suas disciplinas e horarios, adiciona tarefas com prazos e prioridades, utiliza o Pomodoro para sessoes de estudo focado, e acompanha sua evolucao pelo painel de produtividade com graficos semanais.", color: "var(--amber)" },
            { label: "Tecnologias Usadas", value: "Next.js 16 (React 19) — Framework web full-stack | TypeScript — Tipagem segura | Tailwind CSS 4 — Estilizacao utility-first | Lucide React — Biblioteca de icones | Vercel — Hospedagem e deploy automatico", color: "var(--purple)" },
            { label: "Publico-alvo", value: "Estudantes universitarios de todos os cursos, especialmente da area de Tecnologia da Informacao, que buscam melhorar sua organizacao e produtividade academica.", color: "var(--accent)" },
            { label: "Diferencial", value: "Integracao de multiplas ferramentas de produtividade (horarios, tarefas, Pomodoro, notas, analytics) em um unico sistema, com interface moderna dark mode, experiencia fluida e foco total no contexto universitario brasileiro.", color: "var(--green)" },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl" style={{ background: "var(--bg-primary)", borderLeft: `3px solid ${item.color}` }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: item.color }}>{item.label}</div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Arquitetura do Sistema */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Server size={18} style={{ color: "var(--purple)" }} />
          <h2 className="text-lg font-bold">Arquitetura do Sistema</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { Icon: Layers, label: "Tipo", value: "Aplicacao Web (SPA)", color: "var(--accent)" },
            { Icon: Cloud, label: "Arquitetura", value: "Cliente-Servidor com API REST", color: "var(--green)" },
            { Icon: Globe, label: "Infraestrutura", value: "Deploy em nuvem (Vercel)", color: "var(--amber)" },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl text-center" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${item.color}12` }}>
                <item.Icon size={18} style={{ color: item.color }} />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: item.color }}>{item.label}</div>
              <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Fluxo de Dados */}
        <div className="p-5 rounded-xl mb-6" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>Fluxo de Dados (Diagrama de Processos)</h3>
          <div className="flex items-center justify-center gap-3 flex-wrap flex-col md:flex-row">
            {[
              { label: "Usuario", sub: "Login / Cadastro", color: "var(--accent)", Icon: Users },
              { label: "Interface", sub: "Dashboard / Telas", color: "var(--green)", Icon: Smartphone },
              { label: "Processamento", sub: "Logica de Negocio", color: "var(--amber)", Icon: Cpu },
              { label: "Banco de Dados", sub: "PostgreSQL", color: "var(--purple)", Icon: Database },
              { label: "Resposta", sub: "Feedback Visual", color: "var(--red)", Icon: BarChart3 },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="p-3 rounded-xl text-center min-w-[120px]" style={{ background: `${step.color}08`, border: `1px solid ${step.color}25` }}>
                  <step.Icon size={20} className="mx-auto mb-2" style={{ color: step.color }} />
                  <div className="text-xs font-bold" style={{ color: step.color }}>{step.label}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{step.sub}</div>
                </div>
                {i < 4 && <ArrowRight size={16} style={{ color: "var(--text-muted)" }} />}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Casos de Uso */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Users size={18} style={{ color: "var(--green)" }} />
          <h2 className="text-lg font-bold">Casos de Uso</h2>
        </div>
        <div className="space-y-4">
          {[
            {
              actor: "Aluno",
              cases: [
                "Cadastra suas disciplinas e horarios no gerenciador",
                "Adiciona tarefas com prazo e prioridade (alta, media, baixa)",
                "Inicia sessao Pomodoro de 25 min para estudar com foco",
                "Consulta calendario para ver provas e entregas do mes",
                "Cria notas rapidas com lembretes e informacoes importantes",
                "Visualiza graficos de produtividade semanal e por disciplina",
              ],
              color: "var(--accent)",
              Icon: GraduationCap,
            },
            {
              actor: "Sistema",
              cases: [
                "Sugere prioridade baseada na proximidade do prazo",
                "Envia alerta visual quando uma tarefa esta proxima do vencimento",
                "Calcula automaticamente horas estudadas e media diaria",
                "Alterna automaticamente entre foco e pausa no Pomodoro",
                "Exibe aulas do dia baseado no dia da semana atual",
              ],
              color: "var(--green)",
              Icon: Cpu,
            },
            {
              actor: "Professor",
              cases: [
                "Visualiza grade de horarios e turmas atribuidas",
                "Acompanha entregas e prazos dos alunos",
                "Recebe notificacoes de alteracoes no calendario academico",
              ],
              color: "var(--amber)",
              Icon: BookOpen,
            },
          ].map((group) => (
            <div key={group.actor} className="p-4 rounded-xl" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${group.color}12` }}>
                  <group.Icon size={16} style={{ color: group.color }} />
                </div>
                <span className="text-sm font-bold" style={{ color: group.color }}>{group.actor}</span>
              </div>
              <div className="space-y-2 pl-10">
                {group.cases.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight size={12} className="mt-0.5 flex-shrink-0" style={{ color: group.color }} />
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modelagem de Dados (DER) */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Database size={18} style={{ color: "var(--amber)" }} />
          <h2 className="text-lg font-bold">Modelagem de Dados (DER)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              entity: "Usuario",
              fields: ["id (PK)", "nome", "email", "senha_hash", "ra_aluno", "tipo (aluno/professor/coordenador)", "curso", "semestre", "created_at"],
              color: "var(--accent)",
              Icon: Users,
            },
            {
              entity: "Tarefa",
              fields: ["id (PK)", "usuario_id (FK)", "texto", "prioridade (alta/media/baixa)", "concluida", "data_prazo", "created_at"],
              color: "var(--green)",
              Icon: CheckSquare,
            },
            {
              entity: "Disciplina",
              fields: ["id (PK)", "nome", "sala", "cor", "professor_id (FK)", "curso_id (FK)"],
              color: "var(--amber)",
              Icon: BookOpen,
            },
            {
              entity: "Horario",
              fields: ["id (PK)", "disciplina_id (FK)", "dia_semana", "hora_inicio", "hora_fim"],
              color: "var(--purple)",
              Icon: Clock,
            },
            {
              entity: "Nota",
              fields: ["id (PK)", "usuario_id (FK)", "texto", "created_at"],
              color: "var(--red)",
              Icon: StickyNote,
            },
            {
              entity: "Evento",
              fields: ["id (PK)", "titulo", "data", "tipo (prova/entrega/seminario)", "disciplina_id (FK)", "cor"],
              color: "var(--accent)",
              Icon: Calendar,
            },
          ].map((ent) => (
            <div key={ent.entity} className="p-4 rounded-xl" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${ent.color}12` }}>
                  <ent.Icon size={14} style={{ color: ent.color }} />
                </div>
                <span className="text-sm font-bold" style={{ color: ent.color }}>{ent.entity}</span>
              </div>
              <div className="space-y-1">
                {ent.fields.map((f) => (
                  <div key={f} className="text-xs px-2 py-1 rounded-lg" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-jetbrains)" }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Relacionamentos */}
        <div className="p-4 rounded-xl" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <GitBranch size={16} style={{ color: "var(--purple)" }} />
            <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Relacionamentos</span>
          </div>
          <div className="space-y-2">
            {[
              { rel: "Usuario 1:N Tarefa", desc: "Um usuario pode ter varias tarefas" },
              { rel: "Usuario 1:N Nota", desc: "Um usuario pode ter varias notas" },
              { rel: "Disciplina 1:N Horario", desc: "Uma disciplina pode ter varios horarios na semana" },
              { rel: "Disciplina 1:N Evento", desc: "Uma disciplina pode ter varios eventos (provas, entregas)" },
              { rel: "Usuario N:N Disciplina", desc: "Alunos podem cursar varias disciplinas, e cada disciplina tem varios alunos (tabela intermediaria: Matricula)" },
              { rel: "Professor 1:N Disciplina", desc: "Um professor pode lecionar varias disciplinas" },
            ].map((r) => (
              <div key={r.rel} className="flex items-start gap-3 p-2 rounded-lg">
                <code className="text-xs px-2 py-1 rounded-lg flex-shrink-0" style={{ background: "var(--accent-soft)", color: "var(--accent)", fontFamily: "var(--font-jetbrains)" }}>{r.rel}</code>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Viabilidade Tecnica */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Shield size={18} style={{ color: "var(--red)" }} />
          <h2 className="text-lg font-bold">Viabilidade Tecnica</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              Icon: CheckSquare,
              question: "Isso e possivel hoje?",
              answer: "Sim. Todas as tecnologias utilizadas sao maduras, open-source e amplamente adotadas no mercado. O Next.js e um dos frameworks mais populares para aplicacoes web, e a Vercel oferece hospedagem gratuita para projetos academicos.",
              color: "var(--green)",
            },
            {
              Icon: Code,
              question: "Qual tecnologia seria usada?",
              answer: "Frontend: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4. Backend: API Routes do Next.js + PostgreSQL (Neon). Hospedagem: Vercel (CDN global). Autenticacao: Clerk ou NextAuth.",
              color: "var(--accent)",
            },
            {
              Icon: DollarSign,
              question: "Qual o custo aproximado?",
              answer: "MVP (prototipo): R$ 0 — usando planos gratuitos da Vercel, Neon e Clerk. Producao completa: R$ 50-150/mes para servidor, banco de dados e dominio personalizado. Escala: R$ 300-800/mes para 10.000+ usuarios.",
              color: "var(--amber)",
            },
            {
              Icon: Clock,
              question: "Tempo de desenvolvimento?",
              answer: "Prototipo funcional (atual): 2-3 semanas. MVP com backend completo: 2-3 meses (1 dev). Versao completa com app mobile: 4-6 meses (equipe de 2-3 devs).",
              color: "var(--purple)",
            },
          ].map((item) => (
            <div key={item.question} className="p-4 rounded-xl" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color}12` }}>
                  <item.Icon size={14} style={{ color: item.color }} />
                </div>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.question}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Visao de Produto */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Rocket size={18} style={{ color: "var(--accent)" }} />
          <h2 className="text-lg font-bold">Visao de Produto</h2>
        </div>
        <div className="space-y-4">
          {[
            {
              Icon: Users,
              question: "Quem usaria?",
              answer: "Estudantes universitarios de todas as areas, com foco inicial em alunos de cursos de Tecnologia (ADS, CC, SI, Engenharias). Potencial para expansao para ensino medio, pos-graduacao e cursos tecnicos. Professores e coordenadores tambem se beneficiam com visao de turmas e prazos.",
              color: "var(--accent)",
            },
            {
              Icon: Rocket,
              question: "Poderia virar startup?",
              answer: "Sim. O mercado de EdTech no Brasil movimenta bilhoes por ano. O UniTime se posiciona como uma alternativa brasileira ao Notion/Todoist voltada para o contexto academico. Modelo de negocio: freemium — gratuito para funcoes basicas, plano Pro (R$ 9,90/mes) com IA, integracao com sistemas academicos e relatorios avancados.",
              color: "var(--green)",
            },
            {
              Icon: TrendingUp,
              question: "Como escalar?",
              answer: "Fase 1: UniCesumar (validacao interna). Fase 2: Outras universidades de Ponta Grossa. Fase 3: Expansao estadual/nacional via parcerias com IES. Fase 4: App mobile (React Native) + API aberta para integracao com sistemas de gestao academica (TOTVS, RM). Infraestrutura: Vercel + Neon escalam automaticamente com a demanda.",
              color: "var(--amber)",
            },
          ].map((item) => (
            <div key={item.question} className="p-5 rounded-xl" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${item.color}12` }}>
                  <item.Icon size={18} style={{ color: item.color }} />
                </div>
                <span className="font-bold" style={{ color: item.color }}>{item.question}</span>
              </div>
              <p className="text-sm leading-relaxed pl-11" style={{ color: "var(--text-secondary)" }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Creditos */}
      <div className="text-center py-6" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          UniTime -- Mentalidade Criativa e Empreendedora
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Igor Schiniegoski Pallisser & Luis Boratto · UniCesumar · ADS · 2026
        </p>
      </div>
    </div>
  );
}

// ============ BOLETIM VIEW ============
const BOLETIM_COLS = ["TUT", "TEO", "TEO1", "TEO2", "PRA", "PRA1", "PRA2", "PRA3", "PRA4", "INT", "INT1", "INT2", "BIM1", "BIM2", "BIM3", "BIM4"];

const BOLETIM_DATA = [
  {
    subject: "Análise e Projeto Orientado a Objetos",
    professor: "Prof.ª Jessyca K. Franquitto",
    color: "var(--amber)",
    Icon: BookOpen,
    grades: { TUT: "--", TEO: "--", TEO1: "--", TEO2: "--", PRA: "--", PRA1: 8.0, PRA2: 7.5, PRA3: "--", PRA4: "--", INT: "--", INT1: "--", INT2: "--", BIM1: 7.8, BIM2: "--", BIM3: "--", BIM4: "--" } as Record<string, number | string>,
  },
  {
    subject: "Estrutura de Dados",
    professor: "Prof.º João (Goku)",
    color: "var(--accent)",
    Icon: Code,
    grades: { TUT: "--", TEO: "--", TEO1: "--", TEO2: "--", PRA: "--", PRA1: 7.0, PRA2: 6.5, PRA3: "--", PRA4: "--", INT: "--", INT1: "--", INT2: "--", BIM1: 6.8, BIM2: "--", BIM3: "--", BIM4: "--" } as Record<string, number | string>,
  },
  {
    subject: "Mentalidade Criativa e Empreendedora",
    professor: "Prof.º Danilo",
    color: "var(--purple)",
    Icon: Lightbulb,
    grades: { TUT: "--", TEO: "--", TEO1: "--", TEO2: "--", PRA: "--", PRA1: 8.5, PRA2: 9.0, PRA3: "--", PRA4: "--", INT: "--", INT1: "--", INT2: "--", BIM1: 8.8, BIM2: "--", BIM3: "--", BIM4: "--" } as Record<string, number | string>,
  },
  {
    subject: "Programação Front-End",
    professor: "Prof.ª Emil E. Golombieski",
    color: "var(--green)",
    Icon: Monitor,
    grades: { TUT: "--", TEO: "--", TEO1: "--", TEO2: "--", PRA: "--", PRA1: 9.0, PRA2: 8.5, PRA3: "--", PRA4: "--", INT: "--", INT1: "--", INT2: "--", BIM1: 8.8, BIM2: "--", BIM3: "--", BIM4: "--" } as Record<string, number | string>,
  },
];

function BoletimView() {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <Award size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Boletim</h1>
      </div>

      {/* Subject cards with media - click to expand */}
      <div className="space-y-3">
        {BOLETIM_DATA.map((d) => {
          const numericGrades = Object.entries(d.grades).filter(([, v]) => typeof v === "number") as [string, number][];
          const bimGrades = Object.entries(d.grades).filter(([k, v]) => k.startsWith("BIM") && typeof v === "number") as [string, number][];
          const avg = bimGrades.length > 0 ? bimGrades.reduce((s, [, v]) => s + v, 0) / bimGrades.length : 0;
          const isExpanded = expandedSubject === d.subject;
          const mediaColor = avg >= 7 ? "var(--green)" : avg >= 4 ? "var(--amber)" : avg > 0 ? "var(--red)" : "var(--text-muted)";

          return (
            <div key={d.subject}>
              {/* Main row - always visible */}
              <button
                onClick={() => setExpandedSubject(isExpanded ? null : d.subject)}
                className="w-full p-4 rounded-2xl text-left card-hover flex items-center gap-4"
                style={{ background: "var(--bg-card)", border: `1px solid ${isExpanded ? d.color + "40" : "var(--border)"}` }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${d.color}12` }}>
                  <d.Icon size={20} style={{ color: d.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{d.subject}</h3>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{d.professor}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold" style={{ color: mediaColor, fontFamily: "var(--font-jetbrains)" }}>
                    {avg > 0 ? avg.toFixed(1) : "--"}
                  </div>
                  <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>média</div>
                </div>
                <ChevronRight size={16} className="flex-shrink-0 transition-transform ml-2" style={{ color: "var(--text-muted)", transform: isExpanded ? "rotate(90deg)" : "none" }} />
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="mt-2 p-5 rounded-2xl animate-fade-up" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  {/* Composition explanation */}
                  <div className="text-xs font-medium mb-4" style={{ color: "var(--text-secondary)" }}>
                    Composição da nota: Trabalho (5.0) + Prova (5.0) = 10.0 por bimestre
                  </div>

                  {/* BIM grades - the main ones students care about */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {["BIM1", "BIM2", "BIM3", "BIM4"].map((bim, i) => {
                      const val = d.grades[bim];
                      const isNumber = typeof val === "number";
                      return (
                        <div key={bim} className="p-4 rounded-xl text-center" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: d.color }}>{i + 1}º Bimestre</div>
                          <div className="text-3xl font-bold" style={{ color: isNumber ? (val >= 7 ? "var(--green)" : val < 4 ? "var(--red)" : "var(--amber)") : "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>
                            {isNumber ? val.toFixed(1) : "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Detailed breakdown - smaller */}
                  <details className="group">
                    <summary className="text-xs font-medium cursor-pointer flex items-center gap-1 mb-3" style={{ color: "var(--accent)" }}>
                      <ChevronRight size={12} className="transition-transform group-open:rotate-90" />
                      Ver todas as notas detalhadas
                    </summary>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2">
                      {Object.entries(d.grades).filter(([k]) => !k.startsWith("BIM")).map(([key, val]) => {
                        const isNumber = typeof val === "number";
                        return (
                          <div key={key} className="p-2 rounded-lg text-center" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                            <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{key}</div>
                            <div className="text-sm font-bold mt-0.5" style={{ color: isNumber ? "var(--text-primary)" : "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>
                              {isNumber ? val.toFixed(1) : "-"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </details>

                  {/* Summary bar */}
                  <div className="flex items-center gap-6 mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Média Final</span>
                      <span className="text-xl font-bold block" style={{ color: mediaColor, fontFamily: "var(--font-jetbrains)" }}>{avg > 0 ? avg.toFixed(1) : "--"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Notas</span>
                      <span className="text-xl font-bold block" style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains)" }}>{numericGrades.length}/{Object.keys(d.grades).length}</span>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-lg" style={{ background: "var(--amber-soft)", color: "var(--amber)" }}>Em andamento</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ PERFIL VIEW ============
function PerfilView() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("unitime-theme") === "dark" ? "dark" : "light";
    }
    return "light";
  });

  const toggleTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("unitime-theme", newTheme);
  };

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifDeadline, setNotifDeadline] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div className="animate-fade-up space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <Settings size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--accent), #a78bfa)" }}>
            IS
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Igor S. Pallisser</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>RA: 12345678</span>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>ADS - Analise e Desenvolvimento de Sistemas</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>3o Semestre</span>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>UniCesumar Ponta Grossa</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Aparencia */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Sun size={16} style={{ color: "var(--amber)" }} />
          <h2 className="font-semibold text-sm">Aparencia</h2>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Tema</span>
          <div className="flex gap-2">
            <button
              onClick={() => toggleTheme("light")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: theme === "light" ? "var(--accent)" : "var(--bg-primary)",
                color: theme === "light" ? "white" : "var(--text-secondary)",
                border: `1px solid ${theme === "light" ? "transparent" : "var(--border)"}`,
              }}
            >
              <Sun size={16} />
              Claro
            </button>
            <button
              onClick={() => toggleTheme("dark")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: theme === "dark" ? "var(--accent)" : "var(--bg-primary)",
                color: theme === "dark" ? "white" : "var(--text-secondary)",
                border: `1px solid ${theme === "dark" ? "transparent" : "var(--border)"}`,
              }}
            >
              <Moon size={16} />
              Escuro
            </button>
          </div>
        </div>
      </Card>

      {/* Dados Pessoais */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <User size={16} style={{ color: "var(--accent)" }} />
            <h2 className="font-semibold text-sm">Dados Pessoais</h2>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]" style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid rgba(0,168,157,0.15)" }}>
            Editar Dados
          </button>
        </div>
        <div className="space-y-4">
          {[
            { Icon: User, label: "Nome", value: "Igor Schiniegoski Pallisser" },
            { Icon: Mail, label: "Email", value: "igor.pallisser@aluno.unicesumar.edu.br" },
            { Icon: Phone, label: "Telefone", value: "(42) 99999-0000" },
            { Icon: MapPin, label: "Endereco", value: "Ponta Grossa, PR" },
          ].map((field) => (
            <div key={field.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent-soft)" }}>
                <field.Icon size={14} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{field.label}</div>
                <div className="text-sm" style={{ color: "var(--text-primary)" }}>{field.value}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Configuracoes */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Settings size={16} style={{ color: "var(--purple)" }} />
          <h2 className="font-semibold text-sm">Configuracoes</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "Notificacoes por email", enabled: notifEmail, toggle: () => setNotifEmail(!notifEmail), Icon: Bell },
            { label: "Lembretes de prazos", enabled: notifDeadline, toggle: () => setNotifDeadline(!notifDeadline), Icon: Clock },
            { label: "Modo compacto", enabled: compactMode, toggle: () => setCompactMode(!compactMode), Icon: Ruler },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--purple-soft)" }}>
                  <setting.Icon size={14} style={{ color: "var(--purple)" }} />
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{setting.label}</span>
              </div>
              <button onClick={setting.toggle} className="transition-all duration-200">
                {setting.enabled ? (
                  <ToggleRight size={28} style={{ color: "var(--accent)" }} />
                ) : (
                  <ToggleLeft size={28} style={{ color: "var(--text-muted)" }} />
                )}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============ COMMAND PALETTE ============
function CommandPalette({ open, onClose, setTab }: { open: boolean; onClose: () => void; setTab: (t: Tab) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (open) setQuery("");
  }, [open]);

  const tabs: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; description: string }[] = [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard, description: "Visao geral e resumo" },
    { id: "horarios", label: "Horarios", Icon: Calendar, description: "Grade de aulas semanal" },
    { id: "tarefas", label: "Tarefas", Icon: CheckSquare, description: "Lista de tarefas e pendencias" },
    { id: "calendario", label: "Calendario", Icon: Calendar, description: "Eventos e datas importantes" },
    { id: "boletim", label: "Boletim", Icon: Award, description: "Notas e medias por disciplina" },
    { id: "forum", label: "Forum", Icon: MessageSquare, description: "Forum academico e atividades" },
    { id: "financeiro", label: "Financeiro", Icon: DollarSign, description: "Mensalidades e pagamentos" },
    { id: "servicos", label: "Servicos", Icon: Briefcase, description: "Servicos e solicitacoes" },
    { id: "biblioteca", label: "Biblioteca", Icon: BookOpen, description: "Acervo e materiais digitais" },
    { id: "sobre", label: "Sobre o Projeto", Icon: Info, description: "Documentacao e arquitetura" },
    { id: "perfil", label: "Perfil", Icon: User, description: "Dados pessoais e configuracoes" },
  ];

  const taskResults = INITIAL_TASKS.filter((t) =>
    query.length > 0 && t.text.toLowerCase().includes(query.toLowerCase())
  );

  const noteResults = INITIAL_NOTES.filter((n) =>
    query.length > 0 && n.text.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTabs = tabs.filter((t) =>
    query.length === 0 || t.label.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: Tab) => {
    setTab(id);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden animate-fade-up"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <Search size={18} style={{ color: "var(--text-muted)" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar paginas, tarefas, notas..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && filteredTabs.length > 0) handleSelect(filteredTabs[0].id);
            }}
          />
          <kbd className="text-[10px] px-2 py-1 rounded-lg font-medium" style={{ background: "var(--bg-primary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {filteredTabs.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-2" style={{ color: "var(--text-muted)" }}>Paginas</p>
              {filteredTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all hover:scale-[1.01]"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-soft)" }}>
                    <t.Icon size={16} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <div className="font-medium">{t.label}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.description}</div>
                  </div>
                  <ChevronRight size={14} className="ml-auto" style={{ color: "var(--text-muted)" }} />
                </button>
              ))}
            </div>
          )}

          {taskResults.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-2" style={{ color: "var(--text-muted)" }}>Tarefas</p>
              {taskResults.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelect("tarefas")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--green-soft)" }}>
                    <CheckSquare size={16} style={{ color: "var(--green)" }} />
                  </div>
                  <div>
                    <div className="font-medium">{t.text}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Tarefa · {t.date}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {noteResults.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-2" style={{ color: "var(--text-muted)" }}>Notas</p>
              {noteResults.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleSelect("dashboard")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--amber-soft)" }}>
                    <StickyNote size={16} style={{ color: "var(--amber)" }} />
                  </div>
                  <div>
                    <div className="font-medium">{n.text}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Nota · {n.date}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length > 0 && filteredTabs.length === 0 && taskResults.length === 0 && noteResults.length === 0 && (
            <div className="text-center py-8">
              <Search size={32} className="mx-auto mb-3" style={{ color: "var(--text-muted)", opacity: 0.4 }} />
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Nenhum resultado para &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ MAIN ============
export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  // Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCmdOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("unitime-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const notifTypeColors: Record<Notification["type"], string> = {
    prazo: "var(--red)",
    nota: "var(--green)",
    aviso: "var(--amber)",
    forum: "var(--accent)",
  };

  const views: Record<Tab, React.ReactNode> = {
    dashboard: <DashboardView setTab={setTab} notifications={notifications} />,
    horarios: <HorariosView />,
    tarefas: <TarefasView />,
    calendario: <CalendarioView />,
    boletim: <BoletimView />,
    forum: <ForumView />,
    financeiro: <FinanceiroView />,
    servicos: <ServicosView />,
    biblioteca: <BibliotecaView />,
    sobre: <SobreView />,
    perfil: <PerfilView />,
  };

  return (
    <div className="flex min-h-screen noise-bg" style={{ background: "var(--bg-primary)", fontFamily: "var(--font-dm-sans)" }}>
      <Sidebar tab={tab} setTab={setTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 p-4 md:p-8 overflow-auto md:ml-0 w-full">
        {/* Top bar with hamburger + search + notifications */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <Menu size={20} style={{ color: "var(--text-secondary)" }} />
          </button>
          <div className="ml-auto flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:scale-[1.02]"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <Bell size={18} style={{ color: "var(--text-muted)" }} />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: "var(--red)" }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div
                  className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl overflow-hidden z-50 animate-fade-up"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                >
                  <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Notificacoes</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-lg font-medium" style={{ background: "var(--red-soft)", color: "var(--red)" }}>
                        {unreadCount} novas
                      </span>
                    )}
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className="w-full flex items-start gap-3 px-4 py-3 text-left transition-all"
                        style={{
                          background: notif.read ? "transparent" : "rgba(0,168,157,0.04)",
                          borderBottom: "1px solid var(--border)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = notif.read ? "transparent" : "rgba(0,168,157,0.04)")}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background: notifTypeColors[notif.type], opacity: notif.read ? 0.3 : 1 }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm" style={{ color: notif.read ? "var(--text-muted)" : "var(--text-primary)" }}>
                            {notif.text}
                          </p>
                          <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>
                            {notif.time}
                          </span>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--accent)" }} />
                        )}
                      </button>
                    ))}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="w-full px-4 py-3 text-xs font-medium text-center transition-all"
                      style={{ color: "var(--accent)", borderTop: "1px solid var(--border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Search button */}
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:scale-[1.02]"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              <Search size={15} />
              <span className="hidden sm:inline">Buscar...</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded-md font-medium hidden sm:inline" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>Ctrl+K</kbd>
            </button>
          </div>
        </div>
        {views[tab]}
      </main>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} setTab={setTab} />
    </div>
  );
}
