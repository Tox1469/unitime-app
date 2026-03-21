"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Clock, CheckSquare, Calendar, BarChart3, Timer, StickyNote, TrendingUp,
  LayoutDashboard, Plus, Trash2, Play, Pause, RotateCcw, ChevronRight,
  BookOpen, Laptop, Globe, Calculator, Code, Flame, Award, Coffee,
  Sun, X, Info, Server, Database, Users, Rocket, DollarSign, Shield,
  Layers, ArrowRight, GitBranch, Cpu, Cloud, Smartphone, GraduationCap,
  Search, Menu, Lightbulb, Monitor, MessageSquare, FileText, Upload,
  Download, Paperclip, Send, AlertCircle, CreditCard, Briefcase,
  ExternalLink, ChevronDown
} from "lucide-react";

// ============ TYPES ============
type Task = { id: number; text: string; done: boolean; priority: "alta" | "media" | "baixa"; date: string };
type Note = { id: number; text: string; date: string };
type Tab = "dashboard" | "horarios" | "tarefas" | "calendario" | "pomodoro" | "notas" | "produtividade" | "boletim" | "forum" | "financeiro" | "servicos" | "biblioteca" | "sobre";

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

const PROD_DATA = [
  { label: "Seg", hours: 4.5 },
  { label: "Ter", hours: 3.2 },
  { label: "Qua", hours: 5.1 },
  { label: "Qui", hours: 2.8 },
  { label: "Sex", hours: 4.0 },
  { label: "Sáb", hours: 6.2 },
  { label: "Dom", hours: 1.5 },
];

const GRADES_DATA = [
  { subject: "Análise e Projeto Orientado a Objetos", professor: "Prof.ª Jessyca K. Franquitto", n1: 8.0, n2: 7.5, n3: "--" as string | number, color: "var(--amber)", Icon: BookOpen },
  { subject: "Estrutura de Dados", professor: "Prof.º João (Goku)", n1: 7.0, n2: 6.5, n3: "--" as string | number, color: "var(--accent)", Icon: Code },
  { subject: "Programação Front-End", professor: "Prof.ª Emil E. Golombieski", n1: 9.0, n2: 8.5, n3: "--" as string | number, color: "var(--green)", Icon: Monitor },
  { subject: "Mentalidade Criativa e Empreendedora", professor: "Prof.º Danilo", n1: 8.5, n2: 9.0, n3: "--" as string | number, color: "var(--purple)", Icon: Lightbulb },
];

// ============ SIDEBAR ============
function Sidebar({ tab, setTab, open, onClose }: { tab: Tab; setTab: (t: Tab) => void; open: boolean; onClose: () => void }) {
  const items: { id: Tab; Icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
    { id: "horarios", Icon: Calendar, label: "Horarios" },
    { id: "tarefas", Icon: CheckSquare, label: "Tarefas" },
    { id: "calendario", Icon: Calendar, label: "Calendario" },
    { id: "pomodoro", Icon: Timer, label: "Pomodoro" },
    { id: "notas", Icon: StickyNote, label: "Notas" },
    { id: "produtividade", Icon: TrendingUp, label: "Produtividade" },
    { id: "boletim", Icon: Award, label: "Boletim" },
    { id: "forum", Icon: MessageSquare, label: "Fórum" },
    { id: "financeiro", Icon: DollarSign, label: "Financeiro" },
    { id: "servicos", Icon: Briefcase, label: "Serviços" },
    { id: "biblioteca", Icon: BookOpen, label: "Biblioteca" },
    { id: "sobre", Icon: Info, label: "Sobre o Projeto" },
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
        style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}
      >
        <Link href="/" className="flex items-center gap-3 px-6 py-6" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--accent), #00c4b8)" }}>
            <Clock size={18} className="text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Uni<span style={{ color: "var(--accent)" }}>Time</span>
          </span>
        </Link>

        <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-medium tracking-widest uppercase px-4 mb-3" style={{ color: "var(--text-muted)" }}>Menu</p>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group"
              style={{
                background: tab === item.id ? "var(--accent-soft)" : "transparent",
                color: tab === item.id ? "var(--accent)" : "var(--text-secondary)",
                border: tab === item.id ? "1px solid rgba(0,168,157,0.15)" : "1px solid transparent",
              }}
            >
              <item.Icon size={18} />
              {item.label}
              {tab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />}
            </button>
          ))}
        </nav>

        <div className="px-4 py-5" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, var(--accent), #a78bfa)" }}>IS</div>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Igor S. Pallisser</div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>ADS · 3o Semestre</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ============ CARD COMPONENT ============
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-5 ${className}`} style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      {children}
    </div>
  );
}

// ============ VIEWS ============
function DashboardView({ setTab }: { setTab: (t: Tab) => void }) {
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
          { Icon: CheckSquare, label: "Concluídas", value: "2", color: "var(--green)", bg: "var(--green-soft)" },
          { Icon: Flame, label: "Pomodoros Hoje", value: "3", color: "var(--red)", bg: "var(--red-soft)" },
          { Icon: Clock, label: "Horas Estudadas", value: "4.5h", color: "var(--accent)", bg: "var(--accent-soft)" },
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

      {/* Weekly chart */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} style={{ color: "var(--purple)" }} />
            <h2 className="font-semibold text-sm">Produtividade Semanal</h2>
          </div>
          <button onClick={() => setTab("produtividade")} className="flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
            Detalhes <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex items-end gap-3 h-36">
          {PROD_DATA.map((d) => {
            const isHigh = d.hours > 4;
            return (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-medium" style={{ color: isHigh ? "var(--accent)" : "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{d.hours}h</span>
                <div className="w-full rounded-xl transition-all" style={{ height: `${(d.hours / 7) * 100}%`, background: isHigh ? "linear-gradient(to top, var(--accent), #00c4b8)" : "var(--bg-elevated)" }} />
                <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{d.label}</span>
              </div>
            );
          })}
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

function PomodoroView() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"foco" | "pausa">("foco");
  const [sessions, setSessions] = useState(0);

  const reset = useCallback((m: "foco" | "pausa") => { setMode(m); setMinutes(m === "foco" ? 25 : 5); setSeconds(0); setRunning(false); }, []);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSeconds((p) => {
        if (p === 0) {
          if (minutes === 0) { setRunning(false); if (mode === "foco") { setSessions((s) => s + 1); reset("pausa"); } else { reset("foco"); } return 0; }
          setMinutes((m) => m - 1); return 59;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, minutes, mode, reset]);

  const total = mode === "foco" ? 25 * 60 : 5 * 60;
  const elapsed = total - (minutes * 60 + seconds);
  const progress = (elapsed / total) * 100;
  const circumference = 2 * Math.PI * 118;

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <Timer size={20} style={{ color: "var(--red)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Pomodoro Timer</h1>
      </div>

      <div className="flex justify-center">
        <Card className="text-center max-w-md w-full">
          <div className="flex gap-2 justify-center mb-10">
            {[
              { m: "foco" as const, label: "Foco · 25min", color: "var(--accent)" },
              { m: "pausa" as const, label: "Pausa · 5min", color: "var(--green)" },
            ].map((b) => (
              <button key={b.m} onClick={() => reset(b.m)} className="px-5 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: mode === b.m ? `${b.color}` : "var(--bg-primary)", color: mode === b.m ? "white" : "var(--text-secondary)", border: `1px solid ${mode === b.m ? "transparent" : "var(--border)"}` }}>
                {b.label}
              </button>
            ))}
          </div>

          <div className="relative w-64 h-64 mx-auto mb-10">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="118" fill="none" stroke="var(--bg-primary)" strokeWidth="6" />
              <circle cx="128" cy="128" r="118" fill="none" stroke={mode === "foco" ? "var(--accent)" : "var(--green)"} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress / 100)} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold tracking-tighter" style={{ fontFamily: "var(--font-jetbrains)", color: "var(--text-primary)" }}>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <div className="text-xs font-medium mt-2 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                {mode === "foco" ? "Tempo de Foco" : "Intervalo"}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center mb-8">
            <button onClick={() => setRunning(!running)} className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all hover:scale-[1.02]" style={{ background: running ? "var(--red)" : "linear-gradient(135deg, var(--accent), #00c4b8)" }}>
              {running ? <><Pause size={18} /> Pausar</> : <><Play size={18} /> Iniciar</>}
            </button>
            <button onClick={() => reset(mode)} className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          <div className="flex justify-center gap-8 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Flame size={14} style={{ color: "var(--accent)" }} />
                <span className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{sessions}</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Sessões</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Award size={14} style={{ color: "var(--green)" }} />
                <span className="text-2xl font-bold" style={{ color: "var(--green)" }}>{(sessions * 25 / 60).toFixed(1)}h</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Total</span>
            </div>
          </div>
        </Card>
      </div>
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

function ProdutividadeView() {
  const maxH = Math.max(...PROD_DATA.map((d) => d.hours));
  const totalH = PROD_DATA.reduce((s, d) => s + d.hours, 0);
  const avgH = totalH / 7;

  const subjects = [
    { name: "Estrutura de Dados", hours: 8.5, pct: 31, color: "var(--accent)", Icon: Code },
    { name: "Programação Front-End", hours: 7.2, pct: 26, color: "var(--green)", Icon: Monitor },
    { name: "Análise e Projeto OO", hours: 6.0, pct: 22, color: "var(--amber)", Icon: BookOpen },
    { name: "Mentalidade Criativa", hours: 3.5, pct: 13, color: "var(--purple)", Icon: Lightbulb },
    { name: "Estudos Extras", hours: 2.1, pct: 8, color: "var(--red)", Icon: Flame },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp size={20} style={{ color: "var(--purple)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Análise de Produtividade</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Semanal", value: `${totalH.toFixed(1)}h`, Icon: Clock, color: "var(--accent)", bg: "var(--accent-soft)" },
          { label: "Média Diária", value: `${avgH.toFixed(1)}h`, Icon: BarChart3, color: "var(--green)", bg: "var(--green-soft)" },
          { label: "Melhor Dia", value: `${maxH}h`, Icon: Award, color: "var(--amber)", bg: "var(--amber-soft)" },
        ].map((s) => (
          <Card key={s.label}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
              <s.Icon size={18} style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-bold tracking-tight" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold text-sm mb-5">Horas por Dia</h2>
        <div className="flex items-end gap-4 h-48">
          {PROD_DATA.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-sm font-bold" style={{ color: d.hours >= avgH ? "var(--accent)" : "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{d.hours}h</span>
              <div className="w-full rounded-xl transition-all" style={{ height: `${(d.hours / maxH) * 100}%`, background: d.hours >= avgH ? "linear-gradient(to top, var(--accent), #00c4b8)" : "var(--bg-elevated)" }} />
              <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{d.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-sm mb-5">Tempo por Disciplina</h2>
        <div className="space-y-4">
          {subjects.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}12` }}>
                <s.Icon size={14} style={{ color: s.color }} />
              </div>
              <span className="text-sm w-44 flex-shrink-0" style={{ color: "var(--text-primary)" }}>{s.name}</span>
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "var(--bg-primary)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)` }} />
              </div>
              <span className="text-sm font-medium w-12 text-right" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-jetbrains)" }}>{s.hours}h</span>
              <span className="text-xs w-10 text-right font-medium" style={{ color: s.color }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </Card>
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
  const [filter, setFilter] = useState<"todos" | "atividade" | "material" | "aviso">("todos");
  const [subjectFilter, setSubjectFilter] = useState<string>("todas");
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const filtered = posts.filter((p) => {
    if (filter !== "todos" && p.type !== filter) return false;
    if (subjectFilter !== "todas" && p.subject !== subjectFilter) return false;
    return true;
  });

  const subjects = Array.from(new Set(posts.map((p) => p.subject)));

  const handleSubmit = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, submitted: true, submittedFile: "Trabalho_Igor_Luis.pdf" } : p
      )
    );
    setUploadingId(null);
  };

  const typeConfig = {
    atividade: { label: "Atividade", color: "var(--red)", Icon: FileText },
    material: { label: "Material", color: "var(--accent)", Icon: Download },
    aviso: { label: "Aviso", color: "var(--amber)", Icon: AlertCircle },
  };

  const pendingCount = posts.filter((p) => p.type === "atividade" && !p.submitted).length;
  const submittedCount = posts.filter((p) => p.type === "atividade" && p.submitted).length;
  const materialCount = posts.filter((p) => p.type === "material").length;

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Fórum Acadêmico</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { Icon: AlertCircle, label: "Pendentes", value: String(pendingCount), color: "var(--red)", bg: "var(--red-soft)" },
          { Icon: CheckSquare, label: "Enviados", value: String(submittedCount), color: "var(--green)", bg: "var(--green-soft)" },
          { Icon: Download, label: "Materiais", value: String(materialCount), color: "var(--accent)", bg: "var(--accent-soft)" },
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "todos" as const, label: "Todos" },
            { id: "atividade" as const, label: "Atividades" },
            { id: "material" as const, label: "Materiais" },
            { id: "aviso" as const, label: "Avisos" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: filter === f.id ? "var(--accent)" : "var(--bg-card)",
                color: filter === f.id ? "white" : "var(--text-secondary)",
                border: `1px solid ${filter === f.id ? "transparent" : "var(--border)"}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-4 py-2 rounded-xl text-xs font-medium outline-none cursor-pointer"
          style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
        >
          <option value="todas">Todas as disciplinas</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.map((post) => {
          const tc = typeConfig[post.type];
          const isExpanded = expandedPost === post.id;
          const isOverdue = post.deadline && new Date(post.deadline.split("/").reverse().join("-")) < new Date() && !post.submitted;

          return (
            <div
              key={post.id}
              className="rounded-2xl overflow-hidden transition-all"
              style={{ background: "var(--bg-card)", border: `1px solid ${isExpanded ? post.subjectColor + "40" : "var(--border)"}` }}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                className="w-full p-5 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${post.subjectColor}12` }}>
                    <post.SubjectIcon size={18} style={{ color: post.subjectColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: post.subjectColor }}>{post.subject}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-lg font-medium" style={{ background: `${tc.color}12`, color: tc.color }}>
                        {tc.label}
                      </span>
                      {post.type === "atividade" && post.submitted && (
                        <span className="text-[10px] px-2 py-0.5 rounded-lg font-medium" style={{ background: "var(--green-soft)", color: "var(--green)" }}>
                          Enviado
                        </span>
                      )}
                      {isOverdue && (
                        <span className="text-[10px] px-2 py-0.5 rounded-lg font-medium" style={{ background: "var(--red-soft)", color: "var(--red)" }}>
                          Atrasado
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{post.professor}</span>
                      <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{post.date}</span>
                      {post.deadline && (
                        <span className="text-[11px]" style={{ color: isOverdue ? "var(--red)" : "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>
                          Prazo: {post.deadline}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="flex-shrink-0 transition-transform"
                    style={{ color: "var(--text-muted)", transform: isExpanded ? "rotate(90deg)" : "none" }}
                  />
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <p className="text-sm leading-relaxed pt-4" style={{ color: "var(--text-secondary)" }}>
                    {post.description}
                  </p>

                  {/* Attachments */}
                  {post.attachments.length > 0 && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Arquivos</div>
                      <div className="space-y-2">
                        {post.attachments.map((att) => (
                          <div
                            key={att.name}
                            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                            style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}
                          >
                            <Paperclip size={14} style={{ color: post.subjectColor }} />
                            <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>{att.name}</span>
                            <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>{att.size}</span>
                            <Download size={14} style={{ color: "var(--accent)" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit area (only for atividade) */}
                  {post.type === "atividade" && (
                    <div className="p-4 rounded-xl" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                      {post.submitted ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--green-soft)" }}>
                            <CheckSquare size={16} style={{ color: "var(--green)" }} />
                          </div>
                          <div>
                            <div className="text-sm font-medium" style={{ color: "var(--green)" }}>Trabalho enviado</div>
                            <div className="text-[11px] flex items-center gap-1.5 mt-0.5" style={{ color: "var(--text-muted)" }}>
                              <Paperclip size={10} />
                              {post.submittedFile}
                            </div>
                          </div>
                        </div>
                      ) : uploadingId === post.id ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-card)", border: "1px dashed var(--accent)" }}>
                            <FileText size={16} style={{ color: "var(--accent)" }} />
                            <span className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>Trabalho_Igor_Luis.pdf</span>
                            <button onClick={() => setUploadingId(null)} className="p-1 rounded-lg hover:bg-red-500/10">
                              <X size={14} style={{ color: "var(--red)" }} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleSubmit(post.id)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, var(--accent), #00c4b8)" }}
                          >
                            <Send size={14} /> Enviar Trabalho
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setUploadingId(post.id)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                          style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px dashed rgba(0,168,157,0.3)" }}
                        >
                          <Upload size={14} /> Anexar e enviar trabalho
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare size={32} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Nenhuma postagem encontrada</p>
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
            <div key={p.comp} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
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
function BoletimView() {
  const getMedia = (n1: string | number, n2: string | number, n3: string | number) => {
    const grades = [n1, n2, n3].filter((g) => typeof g === "number") as number[];
    if (grades.length === 0) return null;
    return grades.reduce((a, b) => a + b, 0) / grades.length;
  };

  const getStatus = (media: number | null, n3: string | number) => {
    if (media === null) return { label: "Em andamento", color: "var(--amber)" };
    if (typeof n3 === "string") return { label: "Em andamento", color: "var(--amber)" };
    if (media >= 7) return { label: "Aprovado", color: "var(--green)" };
    if (media < 4) return { label: "Reprovado", color: "var(--red)" };
    return { label: "Em andamento", color: "var(--amber)" };
  };

  const allMedias = GRADES_DATA.map((g) => getMedia(g.n1, g.n2, g.n3)).filter((m) => m !== null) as number[];
  const avgAll = allMedias.length > 0 ? allMedias.reduce((a, b) => a + b, 0) / allMedias.length : 0;
  const approvedCount = GRADES_DATA.filter((g) => {
    const m = getMedia(g.n1, g.n2, g.n3);
    return m !== null && typeof g.n3 === "number" && m >= 7;
  }).length;

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <Award size={20} style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Boletim Academico</h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Disciplinas", value: String(GRADES_DATA.length), Icon: BookOpen, color: "var(--accent)", bg: "var(--accent-soft)" },
          { label: "Aprovadas", value: String(approvedCount), Icon: CheckSquare, color: "var(--green)", bg: "var(--green-soft)" },
          { label: "Media Geral", value: avgAll.toFixed(1), Icon: TrendingUp, color: "var(--purple)", bg: "var(--purple-soft, rgba(168,85,247,0.1))" },
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

      {/* Grades table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Disciplina", "Professor", "N1", "N2", "N3", "Media", "Status"].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GRADES_DATA.map((g) => {
                const media = getMedia(g.n1, g.n2, g.n3);
                const status = getStatus(media, g.n3);
                return (
                  <tr key={g.subject} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${g.color}12` }}>
                          <g.Icon size={14} style={{ color: g.color }} />
                        </div>
                        <span className="font-medium" style={{ color: "var(--text-primary)" }}>{g.subject}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3" style={{ color: "var(--text-secondary)" }}>{g.professor}</td>
                    <td className="py-3 px-3 font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains)" }}>{typeof g.n1 === "number" ? g.n1.toFixed(1) : g.n1}</td>
                    <td className="py-3 px-3 font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains)" }}>{typeof g.n2 === "number" ? g.n2.toFixed(1) : g.n2}</td>
                    <td className="py-3 px-3 font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains)" }}>{typeof g.n3 === "number" ? g.n3.toFixed(1) : g.n3}</td>
                    <td className="py-3 px-3 font-bold" style={{ color: media !== null && media >= 7 ? "var(--green)" : media !== null && media < 4 ? "var(--red)" : "var(--amber)", fontFamily: "var(--font-jetbrains)" }}>
                      {media !== null ? media.toFixed(1) : "--"}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ background: `${status.color}12`, color: status.color }}>
                        {status.label}
                      </span>
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
    { id: "pomodoro", label: "Pomodoro", Icon: Timer, description: "Timer de estudo focado" },
    { id: "notas", label: "Notas", Icon: StickyNote, description: "Bloco de notas rapidas" },
    { id: "produtividade", label: "Produtividade", Icon: TrendingUp, description: "Analise de horas e desempenho" },
    { id: "boletim", label: "Boletim", Icon: Award, description: "Notas e medias por disciplina" },
    { id: "sobre", label: "Sobre o Projeto", Icon: Info, description: "Documentacao e arquitetura" },
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
                  onClick={() => handleSelect("notas")}
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

  const views: Record<Tab, React.ReactNode> = {
    dashboard: <DashboardView setTab={setTab} />,
    horarios: <HorariosView />,
    tarefas: <TarefasView />,
    calendario: <CalendarioView />,
    pomodoro: <PomodoroView />,
    notas: <NotasView />,
    produtividade: <ProdutividadeView />,
    boletim: <BoletimView />,
    forum: <ForumView />,
    financeiro: <FinanceiroView />,
    servicos: <ServicosView />,
    biblioteca: <BibliotecaView />,
    sobre: <SobreView />,
  };

  return (
    <div className="flex min-h-screen noise-bg" style={{ background: "var(--bg-primary)", fontFamily: "var(--font-dm-sans)" }}>
      <Sidebar tab={tab} setTab={setTab} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 p-4 md:p-8 overflow-auto md:ml-0 w-full">
        {/* Top bar with hamburger + search */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <Menu size={20} style={{ color: "var(--text-secondary)" }} />
          </button>
          <div className="ml-auto">
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
