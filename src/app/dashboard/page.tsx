"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ============ TYPES ============
type Task = { id: number; text: string; done: boolean; priority: "alta" | "media" | "baixa"; date: string };
type Note = { id: number; text: string; date: string };
type Tab = "dashboard" | "horarios" | "tarefas" | "calendario" | "pomodoro" | "notas" | "produtividade";

// ============ DATA ============
const SCHEDULE = [
  { day: "Segunda", items: [{ time: "08:00", name: "Estrutura de Dados", room: "Sala 201", color: "#6366f1" }, { time: "10:00", name: "Banco de Dados", room: "Lab 3", color: "#22c55e" }] },
  { day: "Terça", items: [{ time: "08:00", name: "Eng. de Software", room: "Sala 105", color: "#f59e0b" }, { time: "14:00", name: "Redes", room: "Lab 1", color: "#ef4444" }] },
  { day: "Quarta", items: [{ time: "08:00", name: "Estrutura de Dados", room: "Sala 201", color: "#6366f1" }, { time: "10:00", name: "Matemática Discreta", room: "Sala 302", color: "#8b5cf6" }] },
  { day: "Quinta", items: [{ time: "08:00", name: "Eng. de Software", room: "Sala 105", color: "#f59e0b" }, { time: "14:00", name: "Banco de Dados", room: "Lab 3", color: "#22c55e" }] },
  { day: "Sexta", items: [{ time: "08:00", name: "Redes", room: "Lab 1", color: "#ef4444" }, { time: "10:00", name: "Matemática Discreta", room: "Sala 302", color: "#8b5cf6" }] },
];

const CALENDAR_EVENTS = [
  { day: 3, title: "Prova Estrutura de Dados", color: "#ef4444" },
  { day: 7, title: "Entrega Trabalho BD", color: "#f59e0b" },
  { day: 12, title: "Seminário Eng. Software", color: "#6366f1" },
  { day: 15, title: "Semana Acadêmica", color: "#22c55e" },
  { day: 20, title: "Prova Redes", color: "#ef4444" },
  { day: 25, title: "Entrega TCC Parcial", color: "#8b5cf6" },
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

const PRODUCTIVITY_DATA = [
  { label: "Seg", hours: 4.5 },
  { label: "Ter", hours: 3.2 },
  { label: "Qua", hours: 5.1 },
  { label: "Qui", hours: 2.8 },
  { label: "Sex", hours: 4.0 },
  { label: "Sáb", hours: 6.2 },
  { label: "Dom", hours: 1.5 },
];

// ============ COMPONENTS ============
function Sidebar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; icon: string; label: string }[] = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "horarios", icon: "🗓️", label: "Horários" },
    { id: "tarefas", icon: "✅", label: "Tarefas" },
    { id: "calendario", icon: "📆", label: "Calendário" },
    { id: "pomodoro", icon: "🍅", label: "Pomodoro" },
    { id: "notas", icon: "📝", label: "Notas" },
    { id: "produtividade", icon: "📈", label: "Produtividade" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r h-screen sticky top-0" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <Link href="/" className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: "var(--accent)" }}>U</div>
        <span className="text-lg font-bold text-white">UniTime</span>
      </Link>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              background: tab === item.id ? "var(--accent)" : "transparent",
              color: tab === item.id ? "white" : "var(--muted)",
            }}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "#6366f1" }}>IS</div>
          <div>
            <div className="text-sm font-medium text-white">Igor S. Pallisser</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>ADS • 3º Semestre</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function DashboardView({ setTab }: { setTab: (t: Tab) => void }) {
  const today = new Date();
  const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Bom dia, Igor! 👋</h1>
        <p style={{ color: "var(--muted)" }}>{dayNames[today.getDay()]}, {today.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: "📚", label: "Tarefas Pendentes", value: "4", color: "#f59e0b" },
          { icon: "✅", label: "Concluídas", value: "2", color: "#22c55e" },
          { icon: "🍅", label: "Pomodoros Hoje", value: "3", color: "#ef4444" },
          { icon: "⏰", label: "Horas Estudadas", value: "4.5h", color: "#6366f1" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
            </div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Today Schedule */}
        <div className="p-5 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Aulas de Hoje</h2>
            <button onClick={() => setTab("horarios")} className="text-xs" style={{ color: "var(--accent-light)" }}>Ver tudo →</button>
          </div>
          <div className="space-y-3">
            {(SCHEDULE[Math.min(today.getDay() - 1, 4)]?.items || SCHEDULE[0].items).map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--background)" }}>
                <div className="w-1 h-10 rounded-full" style={{ background: item.color }} />
                <div>
                  <div className="text-sm font-medium text-white">{item.name}</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{item.time} • {item.room}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="p-5 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Próximas Tarefas</h2>
            <button onClick={() => setTab("tarefas")} className="text-xs" style={{ color: "var(--accent-light)" }}>Ver tudo →</button>
          </div>
          <div className="space-y-3">
            {INITIAL_TASKS.filter((t) => !t.done).slice(0, 4).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--background)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: task.priority === "alta" ? "#ef4444" : task.priority === "media" ? "#f59e0b" : "#22c55e" }} />
                  <span className="text-sm text-white">{task.text}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--card)", color: "var(--muted)" }}>{task.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly productivity mini */}
      <div className="p-5 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Produtividade da Semana</h2>
          <button onClick={() => setTab("produtividade")} className="text-xs" style={{ color: "var(--accent-light)" }}>Ver detalhes →</button>
        </div>
        <div className="flex items-end gap-3 h-32">
          {PRODUCTIVITY_DATA.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>{d.hours}h</span>
              <div className="w-full rounded-t-lg transition-all" style={{ height: `${(d.hours / 7) * 100}%`, background: d.hours > 4 ? "var(--accent)" : "var(--border)" }} />
              <span className="text-xs" style={{ color: "var(--muted)" }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HorariosView() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">🗓️ Gerenciador de Horários</h1>
      <div className="grid grid-cols-5 gap-4">
        {SCHEDULE.map((day) => (
          <div key={day.day} className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 text-center font-semibold text-white text-sm" style={{ background: "var(--accent)" }}>{day.day}</div>
            <div className="p-3 space-y-2">
              {day.items.map((item, i) => (
                <div key={i} className="p-3 rounded-lg" style={{ background: "var(--background)", borderLeft: `3px solid ${item.color}` }}>
                  <div className="text-xs font-mono mb-1" style={{ color: "var(--accent-light)" }}>{item.time}</div>
                  <div className="text-sm font-medium text-white">{item.name}</div>
                  <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{item.room}</div>
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

  const priorityColor = (p: string) => (p === "alta" ? "#ef4444" : p === "media" ? "#f59e0b" : "#22c55e");
  const priorityLabel = (p: string) => (p === "alta" ? "Alta" : p === "media" ? "Média" : "Baixa");

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">✅ Lista de Tarefas</h1>
      <div className="flex gap-3">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Adicionar nova tarefa..."
          className="flex-1 px-4 py-2.5 rounded-lg text-white outline-none"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        />
        <button onClick={addTask} className="px-6 py-2.5 rounded-lg text-white font-medium" style={{ background: "var(--accent)" }}>
          Adicionar
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Todas", count: tasks.length },
          { label: "Pendentes", count: tasks.filter((t) => !t.done).length },
          { label: "Concluídas", count: tasks.filter((t) => t.done).length },
        ].map((f) => (
          <div key={f.label} className="p-3 rounded-lg text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="text-xl font-bold text-white">{f.count}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>{f.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 p-4 rounded-xl transition-all group" style={{ background: "var(--card)", border: "1px solid var(--border)", opacity: task.done ? 0.5 : 1 }}>
            <button onClick={() => toggleTask(task.id)} className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all" style={{ borderColor: task.done ? "var(--accent)" : "var(--border)", background: task.done ? "var(--accent)" : "transparent" }}>
              {task.done && <span className="text-white text-xs">✓</span>}
            </button>
            <span className={`flex-1 text-sm ${task.done ? "line-through" : ""}`} style={{ color: task.done ? "var(--muted)" : "white" }}>{task.text}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${priorityColor(task.priority)}20`, color: priorityColor(task.priority) }}>
              {priorityLabel(task.priority)}
            </span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>{task.date}</span>
            <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-sm transition-all" style={{ color: "var(--danger)" }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarioView() {
  const daysInMonth = 31;
  const firstDay = 1; // Tuesday (0=Sun)
  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">📆 Calendário — Abril 2026</h1>
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-7 text-center text-sm font-medium py-3" style={{ background: "var(--accent)" }}>
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <div key={d} className="text-white">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const event = CALENDAR_EVENTS.find((e) => e.day === day);
            return (
              <div key={i} className="p-2 min-h-[80px] border-t border-r" style={{ borderColor: "var(--border)", background: day ? "transparent" : "var(--background)" }}>
                {day && (
                  <>
                    <div className="text-sm font-medium text-white mb-1">{day}</div>
                    {event && (
                      <div className="text-xs p-1 rounded" style={{ background: `${event.color}20`, color: event.color }}>
                        {event.title}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-4 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-semibold text-white mb-3">Próximos Eventos</h3>
        <div className="space-y-2">
          {CALENDAR_EVENTS.map((e, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "var(--background)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: e.color }} />
              <span className="text-sm text-white">{e.title}</span>
              <span className="text-xs ml-auto" style={{ color: "var(--muted)" }}>{e.day}/04</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PomodoroView() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"foco" | "pausa">("foco");
  const [sessions, setSessions] = useState(0);

  const reset = useCallback((newMode: "foco" | "pausa") => {
    setMode(newMode);
    setMinutes(newMode === "foco" ? 25 : 5);
    setSeconds(0);
    setRunning(false);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          if (minutes === 0) {
            setRunning(false);
            if (mode === "foco") {
              setSessions((s) => s + 1);
              reset("pausa");
            } else {
              reset("foco");
            }
            return 0;
          }
          setMinutes((m) => m - 1);
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, minutes, mode, reset]);

  const progress = mode === "foco" ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100 : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100;

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">🍅 Pomodoro Timer</h1>
      <div className="flex justify-center">
        <div className="p-10 rounded-2xl text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex gap-3 justify-center mb-8">
            <button onClick={() => reset("foco")} className="px-6 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: mode === "foco" ? "var(--accent)" : "var(--background)", color: "white" }}>
              Foco (25min)
            </button>
            <button onClick={() => reset("pausa")} className="px-6 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: mode === "pausa" ? "#22c55e" : "var(--background)", color: "white" }}>
              Pausa (5min)
            </button>
          </div>

          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="118" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle cx="128" cy="128" r="118" fill="none" stroke={mode === "foco" ? "var(--accent)" : "#22c55e"} strokeWidth="8" strokeDasharray={`${2 * Math.PI * 118}`} strokeDashoffset={`${2 * Math.PI * 118 * (1 - progress / 100)}`} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold font-mono text-white">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <div className="text-sm mt-2" style={{ color: "var(--muted)" }}>
                {mode === "foco" ? "Tempo de Foco" : "Pausa"}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => setRunning(!running)} className="px-8 py-3 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105" style={{ background: running ? "#ef4444" : "var(--accent)" }}>
              {running ? "⏸ Pausar" : "▶ Iniciar"}
            </button>
            <button onClick={() => reset(mode)} className="px-6 py-3 rounded-xl font-semibold transition-all" style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
              🔄 Resetar
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "var(--accent-light)" }}>{sessions}</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>Sessões Completas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{(sessions * 25 / 60).toFixed(1)}h</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>Tempo Total</div>
            </div>
          </div>
        </div>
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
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">📝 Bloco de Notas</h1>
      <div className="flex gap-3">
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          placeholder="Escreva uma nota rápida..."
          className="flex-1 px-4 py-2.5 rounded-lg text-white outline-none"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        />
        <button onClick={addNote} className="px-6 py-2.5 rounded-lg text-white font-medium" style={{ background: "var(--accent)" }}>
          Salvar
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="p-4 rounded-xl group relative" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <button onClick={() => deleteNote(note.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all text-sm" style={{ color: "var(--danger)" }}>✕</button>
            <p className="text-sm text-white">{note.text}</p>
            <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>{note.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProdutividadeView() {
  const maxHours = Math.max(...PRODUCTIVITY_DATA.map((d) => d.hours));
  const totalHours = PRODUCTIVITY_DATA.reduce((sum, d) => sum + d.hours, 0);
  const avgHours = totalHours / 7;

  const subjects = [
    { name: "Estrutura de Dados", hours: 8.5, pct: 31, color: "#6366f1" },
    { name: "Banco de Dados", hours: 6.2, pct: 23, color: "#22c55e" },
    { name: "Eng. de Software", hours: 5.8, pct: 21, color: "#f59e0b" },
    { name: "Redes", hours: 4.1, pct: 15, color: "#ef4444" },
    { name: "Matemática Discreta", hours: 2.7, pct: 10, color: "#8b5cf6" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-white">📈 Análise de Produtividade</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total da Semana", value: `${totalHours.toFixed(1)}h`, icon: "⏱️", color: "var(--accent-light)" },
          { label: "Média Diária", value: `${avgHours.toFixed(1)}h`, icon: "📊", color: "#22c55e" },
          { label: "Melhor Dia", value: `${maxHours}h`, icon: "🏆", color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h2 className="font-semibold text-white mb-4">Horas por Dia</h2>
        <div className="flex items-end gap-4 h-48">
          {PRODUCTIVITY_DATA.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-sm font-mono font-bold" style={{ color: "var(--accent-light)" }}>{d.hours}h</span>
              <div className="w-full rounded-t-xl transition-all" style={{ height: `${(d.hours / maxHours) * 100}%`, background: d.hours >= avgHours ? "var(--accent)" : "var(--border)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>{d.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
          <div className="w-3 h-0.5 rounded" style={{ background: "var(--accent)" }} />
          <span className="text-xs" style={{ color: "var(--muted)" }}>Acima da média</span>
          <div className="w-3 h-0.5 rounded ml-3" style={{ background: "var(--border)" }} />
          <span className="text-xs" style={{ color: "var(--muted)" }}>Abaixo da média</span>
        </div>
      </div>

      <div className="p-5 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h2 className="font-semibold text-white mb-4">Tempo por Disciplina</h2>
        <div className="space-y-3">
          {subjects.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
              <span className="text-sm text-white w-48">{s.name}</span>
              <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "var(--background)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
              <span className="text-sm font-mono w-16 text-right" style={{ color: "var(--muted)" }}>{s.hours}h</span>
              <span className="text-xs w-10 text-right" style={{ color: s.color }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
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
    <div className="flex min-h-screen" style={{ background: "var(--background)" }}>
      <Sidebar tab={tab} setTab={setTab} />
      <main className="flex-1 p-8 overflow-auto">{views[tab]}</main>
    </div>
  );
}
