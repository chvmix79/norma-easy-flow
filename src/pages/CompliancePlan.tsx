import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ComplianceTask, NormativeCode, TaskStatus } from "@/lib/types";
import { NORMATIVES } from "@/lib/rulesEngine";
import {
  CheckCircle2, Clock, AlertTriangle, XCircle, Filter,
  ChevronDown, ChevronUp, Upload, MessageSquare, Edit3
} from "lucide-react";

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string; icon: React.ReactNode }> = {
  pendiente:   { label: "Pendiente",   className: "status-blue",   icon: <Clock className="w-3 h-3" /> },
  en_proceso:  { label: "En proceso",  className: "status-yellow", icon: <Edit3 className="w-3 h-3" /> },
  completado:  { label: "Completado",  className: "status-green",  icon: <CheckCircle2 className="w-3 h-3" /> },
  vencido:     { label: "Vencido",     className: "status-red",    icon: <XCircle className="w-3 h-3" /> },
};

const PRIORITY_CONFIG = {
  baja:    { label: "Baja",    color: "hsl(var(--muted-foreground))" },
  media:   { label: "Media",   color: "hsl(var(--info))" },
  alta:    { label: "Alta",    color: "hsl(var(--warning))" },
  critica: { label: "Crítica", color: "hsl(var(--danger))" },
};

const TaskRow = ({ task }: { task: ComplianceTask }) => {
  const { updateTask, addComment, currentUser } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");

  const norm = NORMATIVES[task.normativaCode];
  const status = STATUS_CONFIG[task.estado];
  const priority = PRIORITY_CONFIG[task.prioridad];
  const isOverdue = new Date(task.fechaVencimiento) < new Date() && task.estado !== "completado";

  const handleStatusChange = (status: TaskStatus) => {
    updateTask(task.id, { estado: status });
  };

  const handleComment = () => {
    if (!newComment.trim() || !currentUser) return;
    addComment(task.id, { autor: currentUser.nombre, rol: currentUser.rol, texto: newComment });
    setNewComment("");
  };

  return (
    <div className={`bg-card rounded-xl border shadow-card transition-all ${isOverdue ? "border-danger/40" : "border-border"}`}>
      {/* Task header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/30 rounded-xl"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Priority dot */}
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: priority.color }} />

        {/* Normative badge */}
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0"
          style={{ background: norm.color }}
        >
          {task.normativaCode}
        </span>

        {/* Title */}
        <p className="flex-1 text-sm font-medium text-foreground truncate">{task.titulo}</p>

        {/* Status */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${status.className}`}>
          {status.icon} {status.label}
        </span>

        {/* Due date */}
        <span className={`text-xs flex-shrink-0 ${isOverdue ? "text-danger font-semibold" : "text-muted-foreground"}`}>
          {isOverdue ? "⚠️ " : ""}
          {new Date(task.fechaVencimiento).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
        </span>

        {/* Expand */}
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">{task.descripcion}</p>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-muted/40 rounded-lg p-2">
              <p className="text-muted-foreground">Responsable</p>
              <p className="font-medium text-foreground mt-0.5">{task.responsable}</p>
            </div>
            <div className="bg-muted/40 rounded-lg p-2">
              <p className="text-muted-foreground">Vencimiento</p>
              <p className={`font-medium mt-0.5 ${isOverdue ? "text-danger" : "text-foreground"}`}>
                {new Date(task.fechaVencimiento).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="bg-muted/40 rounded-lg p-2">
              <p className="text-muted-foreground">Prioridad</p>
              <p className="font-medium mt-0.5" style={{ color: priority.color }}>{priority.label}</p>
            </div>
          </div>

          {/* Status change */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Cambiar estado:</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    task.estado === s
                      ? `${STATUS_CONFIG[s].className} ring-2 ring-offset-1 ring-primary/30`
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {STATUS_CONFIG[s].icon} {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Evidences */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">
              Evidencias ({task.evidencias.length})
            </p>
            {task.evidencias.length > 0 ? (
              <div className="space-y-1.5">
                {task.evidencias.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2 text-xs">
                    <span>📄</span>
                    <span className="flex-1 truncate text-foreground">{ev.nombre}</span>
                    <span className="text-muted-foreground">{ev.tamaño}</span>
                  </div>
                ))}
              </div>
            ) : (
              <button
                onClick={() => {}}
                className="flex items-center gap-2 text-xs text-primary hover:underline"
              >
                <Upload className="w-3.5 h-3.5" /> Subir evidencia
              </button>
            )}
          </div>

          {/* Comments */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">
              Comentarios ({task.comentarios.length})
            </p>
            {task.comentarios.map((c) => (
              <div key={c.id} className="bg-muted/40 rounded-lg p-3 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold text-foreground">{c.autor}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(c.fecha).toLocaleDateString("es-CO")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{c.texto}</p>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                placeholder="Agregar comentario..."
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button
                onClick={handleComment}
                className="px-3 py-2 rounded-lg text-white text-xs font-medium"
                style={{ background: "var(--gradient-primary)" }}
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CompliancePlan = () => {
  const { tasks, diagnosis, setPage } = useAppStore();
  const [filterNorm, setFilterNorm] = useState<NormativeCode | "all">("all");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"fecha" | "prioridad">("fecha");

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-4 animate-fade-in">
        <p className="text-muted-foreground text-sm">Primero ejecuta el diagnóstico normativo.</p>
        <button
          onClick={() => setPage("diagnosis")}
          className="px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
          style={{ background: "var(--gradient-primary)" }}
        >
          Ir al diagnóstico
        </button>
      </div>
    );
  }

  const activeNorms = diagnosis.filter((d) => d.applies).map((d) => d.normative);

  const filtered = tasks
    .filter((t) => filterNorm === "all" || t.normativaCode === filterNorm)
    .filter((t) => filterStatus === "all" || t.estado === filterStatus)
    .sort((a, b) => {
      if (sortBy === "fecha") return new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime();
      const p = { critica: 0, alta: 1, media: 2, baja: 3 };
      return p[a.prioridad] - p[b.prioridad];
    });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Plan de Cumplimiento</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {tasks.length} tareas generadas automáticamente · {tasks.filter((t) => t.estado === "completado").length} completadas
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="w-3.5 h-3.5" />
          <span>Ordenar por:</span>
          <select
            className="text-xs border border-border rounded-md px-2 py-1 bg-card text-foreground"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "fecha" | "prioridad")}
          >
            <option value="fecha">Fecha de vencimiento</option>
            <option value="prioridad">Prioridad</option>
          </select>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pendiente", "en_proceso", "completado", "vencido"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s as TaskStatus | "all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterStatus === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {s === "all" ? `Todas (${tasks.length})` :
             s === "pendiente" ? `Pendientes (${tasks.filter(t=>t.estado==="pendiente").length})` :
             s === "en_proceso" ? `En proceso (${tasks.filter(t=>t.estado==="en_proceso").length})` :
             s === "completado" ? `Completadas (${tasks.filter(t=>t.estado==="completado").length})` :
             `Vencidas (${tasks.filter(t=>t.estado==="vencido").length})`}
          </button>
        ))}
      </div>

      {/* Normative filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterNorm("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filterNorm === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}
        >
          Todas las normativas
        </button>
        {activeNorms.map((n) => (
          <button
            key={n.code}
            onClick={() => setFilterNorm(n.code)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${filterNorm === n.code ? "text-white border-transparent" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}
            style={filterNorm === n.code ? { background: n.color } : undefined}
          >
            {n.icono} {n.code}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No hay tareas con los filtros seleccionados.
          </div>
        )}
        {filtered.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default CompliancePlan;
