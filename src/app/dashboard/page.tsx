"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Clock, CheckSquare, Calendar, BarChart3, Timer, StickyNote, TrendingUp,
  LayoutDashboard, Plus, Trash2, Play, Pause, RotateCcw, ChevronRight,
  BookOpen, Laptop, Globe, Calculator, Code, Flame, Award, Coffee,
  Sun, X
} from "lucide-react";

// ============ TYPES ============
type Task = { id: number; text: string; done: boolean; priority: "alta" | "media" | "baixa"; date: string };
type Note = { id: number; text: string; date: string };
type Tab = "dashboard" | "horarios" | "tarefas" | "calendario" | "pomodoro" | "notas" | "produtividade";

// ============ DATA ============
const SCHEDULE = [
  { day: "Segunda", items: [{ time: "08:00", name: "Estrutura de Dados", room: "Sala 201", color: "var(--accent)", Icon: Code }, { time: "10:00", name: "Banco de Dados", room: "Lab 3", color: "var(--green)", Icon: Laptop }] },
  { day: "Terça", items: [{ time: "08:00", name: "Eng. de Software", room: "Sala 105", color: "var(--amber)", Icon: BookOpen }, { time: "14:00", name: "Redes", room: "Lab 1", color: "var(--red)", Icon: Globe }] },
  { day: "Quarta", items: [{ time: "08:00", name: "Estrutura de Dados", room: "Sala 201", color: "var(--accent)", Icon: Code }, { time: "10:00", name: "Matemática Discreta", room: "Sala 302", color: "var(--purple)", Icon: Calculator }] },
  { day: "Quinta", items: [{ time: "08:00", name: "Eng. de Software", room: "Sala 105", color: "var(--amber)", Icon: BookOpen }, { time: "14:00", name: "Banco de Dados", room: "Lab 3", color: "var(--green)", Icon: Laptop }] },
  { day: "Sexta", items: [{ time: "08:00", name: "Redes", room: "Lab 1", color: "var(--red)", Icon: Globe }, { time: "10:00", name: "Matemática Discreta", room: "Sala 302", color: "var(--purple)", Icon: Calculator }] },
];

const CALENDAR_EVENTS = [
  { day: 3, title: "Prova Estrutura de Dados", color: "var(--red)" },
  { day: 7, title: "Entrega Trabalho BD", color: "var(--amber)" },
  { day: 12, title: "Seminário Eng. Software", color: "var(--accent)" },
  { day: 15, title: "Semana Acadêmica", color: "var(--green)" },
  { day: 20, title: "Prova Redes", color: "var(--red)" },
  { day: 25, title: "Entrega TCC Parcial", color: "var(--purple)" },
];

const INITIAL_TASKS: Task[] = [
  { id: 1, text: "Estudar para prova de Estrutura de Dados", done: false, priority: "alta", date: "03/04" },
  { id: 2, text: "Finalizar relatório de Banco de Dados", done: false, priority: "alta", date: "07/04" },
  { id: 3, text: "Preparar slides do seminário", done: true, priority: "media", date: "12/04" },
  { id: 4, text: "Revisar matéria de Redes", done: false, priority: "media", date: "20/04" },
  { id: 5, text: "Ler capítulo 5 de Matemática Discreta", done: true, priority: "baixa", date: "10/04" },
  { id: 6, text: "Fazer exercícios de programação", done: false, priority: "baixa", date: "15/04" },
];

const INITIAL_NOTES: Note[] = [
  { id: 1, text: "Lembrar de pegar o livro na biblioteca", date: "18/03" },
  { id: 2, text: "Grupo do seminário: Igor, Luís, Ana, Carlos", date: "15/03" },
  { id: 3, text: "Professor de Redes mudou o horário da prova", date: "19/03" },
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

// ============ SIDEBAR ============
function Sidebar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; Icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
    { id: "horarios", Icon: Calendar, label: "Horários" },
    { id: "tarefas", Icon: CheckSquare, label: "Tarefas" },
    { id: "calendario", Icon: Calendar, label: "Calendário" },
    { id: "pomodoro", Icon: Timer, label: "Pomodoro" },
    { id: "notas", Icon: StickyNote, label: "Notas" },
    { id: "produtividade", Icon: TrendingUp, label: "Produtividade" },
  ];

  return (
    <aside className="w-[260px] flex-shrink-0 flex flex-col h-screen sticky top-0" style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}>
      <Link href="/" className="flex items-center gap-3 px-6 py-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--accent), #818cf8)" }}>
          <Clock size={18} className="text-white" />
        </div>
        <span className="text-lg font-semibold tracking-tight">
          Uni<span style={{ color: "var(--accent)" }}>Time</span>
        </span>
      </Link>

      <nav className="flex-1 py-5 px-3 space-y-0.5">
        <p className="text-[10px] font-medium tracking-widest uppercase px-4 mb-3" style={{ color: "var(--text-muted)" }}>Menu</p>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group"
            style={{
              background: tab === item.id ? "var(--accent-soft)" : "transparent",
              color: tab === item.id ? "var(--accent)" : "var(--text-secondary)",
              border: tab === item.id ? "1px solid rgba(99,102,241,0.15)" : "1px solid transparent",
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
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>ADS · 3º Semestre</div>
          </div>
        </div>
      </div>
    </aside>
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
      <div className="grid grid-cols-4 gap-4">
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

      <div className="grid grid-cols-2 gap-5">
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
            {(SCHEDULE[Math.min(Math.max(today.getDay() - 1, 0), 4)]?.items || SCHEDULE[0].items).map((item, i) => (
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
                <div className="w-full rounded-xl transition-all" style={{ height: `${(d.hours / 7) * 100}%`, background: isHigh ? "linear-gradient(to top, var(--accent), #818cf8)" : "var(--bg-elevated)" }} />
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
      <div className="grid grid-cols-5 gap-4">
        {SCHEDULE.map((day) => (
          <div key={day.day} className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 text-center text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, var(--accent), #818cf8)" }}>{day.day}</div>
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
        <button onClick={addTask} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--accent), #818cf8)" }}>
          <Plus size={16} /> Adicionar
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
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
        <div className="grid grid-cols-7 text-center text-xs font-semibold py-3 text-white" style={{ background: "linear-gradient(135deg, var(--accent), #818cf8)" }}>
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
            <button onClick={() => setRunning(!running)} className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all hover:scale-[1.02]" style={{ background: running ? "var(--red)" : "linear-gradient(135deg, var(--accent), #818cf8)" }}>
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
        <button onClick={addNote} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: "linear-gradient(135deg, var(--accent), #818cf8)" }}>
          <Plus size={16} /> Salvar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
    { name: "Banco de Dados", hours: 6.2, pct: 23, color: "var(--green)", Icon: Laptop },
    { name: "Eng. de Software", hours: 5.8, pct: 21, color: "var(--amber)", Icon: BookOpen },
    { name: "Redes", hours: 4.1, pct: 15, color: "var(--red)", Icon: Globe },
    { name: "Matemática Discreta", hours: 2.7, pct: 10, color: "var(--purple)", Icon: Calculator },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp size={20} style={{ color: "var(--purple)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Análise de Produtividade</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
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
              <div className="w-full rounded-xl transition-all" style={{ height: `${(d.hours / maxH) * 100}%`, background: d.hours >= avgH ? "linear-gradient(to top, var(--accent), #818cf8)" : "var(--bg-elevated)" }} />
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

// ============ MAIN ============
export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("dashboard");

  const views: Record<Tab, React.ReactNode> = {
    dashboard: <DashboardView setTab={setTab} />,
    horarios: <HorariosView />,
    tarefas: <TarefasView />,
    calendario: <CalendarioView />,
    pomodoro: <PomodoroView />,
    notas: <NotasView />,
    produtividade: <ProdutividadeView />,
  };

  return (
    <div className="flex min-h-screen noise-bg" style={{ background: "var(--bg-primary)", fontFamily: "var(--font-dm-sans)" }}>
      <Sidebar tab={tab} setTab={setTab} />
      <main className="flex-1 p-8 overflow-auto">{views[tab]}</main>
    </div>
  );
}
