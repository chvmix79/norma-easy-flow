import { useAppStore } from "@/lib/store";
import {
  TrendingUp, AlertTriangle, CheckCircle2, Clock, Shield,
  ChevronRight, Activity, Target, ArrowUpRight
} from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const Dashboard = () => {
  const { kpis, diagnosis, tasks, alerts, setPage, company } = useAppStore();

  if (!kpis || !company) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">¡Bienvenido a Compliance360!</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            Registra tu empresa y ejecuta el diagnóstico normativo para comenzar.
          </p>
        </div>
        <button
          onClick={() => setPage("company")}
          className="px-6 py-3 rounded-lg text-white font-semibold text-sm"
          style={{ background: "var(--gradient-primary)" }}
        >
          Registrar empresa
        </button>
      </div>
    );
  }

  const cumplimientoColor =
    kpis.cumplimientoTotal >= 70 ? "hsl(var(--success))" :
    kpis.cumplimientoTotal >= 40 ? "hsl(var(--warning))" :
                                   "hsl(var(--danger))";

  const recentTasks = tasks.filter((t) => t.estado !== "completado").slice(0, 5);
  const unreadAlerts = alerts.filter((a) => !a.leida).slice(0, 4);
  const activeNorm = diagnosis.filter((d) => d.applies);

  const radialData = [
    { name: "Cumplimiento", value: kpis.cumplimientoTotal, fill: cumplimientoColor }
  ];

  const barData = kpis.cumplimientoPorNormativa.slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-foreground">Dashboard de Cumplimiento</h1>
        <p className="text-muted-foreground text-sm">
          {company.nombre} · {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Cumplimiento Total",
            value: `${kpis.cumplimientoTotal}%`,
            sub: "del plan completado",
            icon: <Target className="w-5 h-5" />,
            color: "primary",
            gradient: "var(--gradient-primary)",
          },
          {
            label: "Tareas Pendientes",
            value: kpis.tareasPendientes,
            sub: "por completar",
            icon: <Clock className="w-5 h-5" />,
            color: "warning",
            gradient: "var(--gradient-warning)",
          },
          {
            label: "Tareas Vencidas",
            value: kpis.tareasVencidas,
            sub: "requieren atención",
            icon: <AlertTriangle className="w-5 h-5" />,
            color: "danger",
            gradient: "var(--gradient-danger)",
          },
          {
            label: "Alertas Activas",
            value: kpis.alertasActivas,
            sub: "sin leer",
            icon: <Activity className="w-5 h-5" />,
            color: "info",
            gradient: "linear-gradient(135deg, hsl(var(--info)), hsl(210 70% 60%))",
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-xl p-4 shadow-card border border-border card-hover">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{ background: kpi.gradient }}
              >
                {kpi.icon}
              </div>
            </div>
            <p className="text-2xl font-extrabold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Main charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Radial gauge */}
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <h3 className="font-semibold text-foreground text-sm mb-4">Cumplimiento General</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="65%" outerRadius="85%"
                  data={radialData}
                  startAngle={90} endAngle={-270}
                >
                  <RadialBar
                    dataKey="value"
                    background={{ fill: "hsl(var(--muted))" }}
                    cornerRadius={8}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-extrabold" style={{ color: cumplimientoColor }}>
                  {kpis.cumplimientoTotal}%
                </p>
                <p className="text-xs text-muted-foreground">completado</p>
              </div>
            </div>
            <div className="w-full mt-4 space-y-2">
              {[
                { label: "Completadas", val: tasks.filter(t=>t.estado==="completado").length, color: "success" },
                { label: "En proceso", val: tasks.filter(t=>t.estado==="en_proceso").length, color: "warning" },
                { label: "Vencidas", val: tasks.filter(t=>t.estado==="vencido").length, color: "danger" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`semaphore-${s.color === "success" ? "green" : s.color === "warning" ? "yellow" : "red"}`} />
                    <span className="text-muted-foreground">{s.label}</span>
                  </div>
                  <span className="font-semibold text-foreground">{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar chart — cumplimiento por normativa */}
        <div className="lg:col-span-2 bg-card rounded-xl p-5 shadow-card border border-border">
          <h3 className="font-semibold text-foreground text-sm mb-4">Cumplimiento por Normativa</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="normativa" tick={{ fontSize: 9 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Tooltip
                formatter={(v: number) => [`${v}%`, "Cumplimiento"]}
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
              />
              <Bar dataKey="porcentaje" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.porcentaje >= 70 ? "hsl(var(--success))" :
                      entry.porcentaje >= 40 ? "hsl(var(--warning))" :
                                               "hsl(var(--danger))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Active normatives */}
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Normativas Aplicables</h3>
            <button
              onClick={() => setPage("diagnosis")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Ver diagnóstico <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {activeNorm.slice(0, 5).map((n) => (
              <div key={n.normative.code} className="flex items-center gap-3">
                <span className="text-lg">{n.normative.icono}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{n.normative.code}</p>
                  <div className="progress-bar-track mt-1">
                    <div
                      className="progress-bar-fill-primary"
                      style={{
                        width: `${n.cumplimiento}%`,
                        background:
                          n.cumplimiento >= 70 ? "var(--gradient-success)" :
                          n.cumplimiento >= 40 ? "var(--gradient-warning)" :
                                                 "var(--gradient-danger)",
                      }}
                    />
                  </div>
                </div>
                <span
                  className="text-xs font-bold flex-shrink-0"
                  style={{
                    color:
                      n.cumplimiento >= 70 ? "hsl(var(--success))" :
                      n.cumplimiento >= 40 ? "hsl(var(--warning))" :
                                             "hsl(var(--danger))",
                  }}
                >
                  {n.cumplimiento}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent alerts */}
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Alertas Recientes</h3>
            <button
              onClick={() => setPage("alerts")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Ver todas <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {unreadAlerts.length === 0 && (
              <div className="flex items-center gap-2 text-success text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sin alertas pendientes. ¡Excelente!</span>
              </div>
            )}
            {unreadAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div
                  className={`semaphore-${alert.semaforo === "verde" ? "green" : alert.semaforo === "amarillo" ? "yellow" : "red"} mt-1.5 flex-shrink-0`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{alert.titulo}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Ver plan de cumplimiento", page: "compliance-plan", icon: "📋", color: "var(--gradient-primary)" },
          { label: "Gestionar evidencias", page: "evidence", icon: "📂", color: "var(--gradient-success)" },
          { label: "Generar reporte", page: "reports", icon: "📄", color: "var(--gradient-warning)" },
          { label: "Consultar asistente IA", page: "ai-assistant", icon: "🤖", color: "linear-gradient(135deg, hsl(270 60% 50%), hsl(270 60% 65%))" },
        ].map((action) => (
          <button
            key={action.page}
            onClick={() => setPage(action.page)}
            className="flex items-center gap-3 p-4 rounded-xl text-white text-left text-sm font-medium hover:opacity-90 active:scale-95 transition-all shadow-card"
            style={{ background: action.color }}
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-xs font-semibold leading-tight">{action.label}</span>
            <ArrowUpRight className="w-3 h-3 ml-auto flex-shrink-0 opacity-70" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
