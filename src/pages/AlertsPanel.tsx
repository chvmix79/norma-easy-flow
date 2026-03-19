import { useAppStore } from "@/lib/store";
import { Alert } from "@/lib/types";
import { Bell, CheckCircle2, AlertTriangle, XCircle, Info, BellOff } from "lucide-react";

const severityConfig = {
  danger:  { icon: <XCircle className="w-4 h-4" />, className: "status-red", semaforo: "🔴" },
  warning: { icon: <AlertTriangle className="w-4 h-4" />, className: "status-yellow", semaforo: "🟡" },
  success: { icon: <CheckCircle2 className="w-4 h-4" />, className: "status-green", semaforo: "🟢" },
  info:    { icon: <Info className="w-4 h-4" />, className: "status-blue", semaforo: "🔵" },
};

const AlertCard = ({ alert }: { alert: Alert }) => {
  const { markAlertRead } = useAppStore();
  const cfg = severityConfig[alert.severidad];

  return (
    <div className={`bg-card rounded-xl border shadow-card p-4 transition-all ${alert.leida ? "opacity-60" : ""} ${alert.semaforo === "rojo" ? "border-danger/40" : alert.semaforo === "amarillo" ? "border-warning/40" : "border-border"}`}>
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
            alert.severidad === "danger" ? "bg-danger/10 text-danger" :
            alert.severidad === "warning" ? "bg-warning/10 text-warning-foreground" :
            alert.severidad === "success" ? "bg-success/10 text-success" :
            "bg-info/10 text-info"
          }`}
        >
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span>{cfg.semaforo}</span>
            <p className="text-sm font-semibold text-foreground">{alert.titulo}</p>
            {!alert.leida && (
              <span className="w-2 h-2 rounded-full bg-danger flex-shrink-0" />
            )}
            {alert.normativaCode && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {alert.normativaCode}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{alert.descripcion}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-muted-foreground">
              {new Date(alert.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            {!alert.leida && (
              <button
                onClick={() => markAlertRead(alert.id)}
                className="text-xs text-primary hover:underline"
              >
                Marcar como leída
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertsPanel = () => {
  const { alerts } = useAppStore();
  const unread = alerts.filter((a) => !a.leida);
  const read = alerts.filter((a) => a.leida);

  const rojos = alerts.filter((a) => a.semaforo === "rojo").length;
  const amarillos = alerts.filter((a) => a.semaforo === "amarillo").length;
  const verdes = alerts.filter((a) => a.semaforo === "verde").length;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-extrabold text-foreground">Alertas y Notificaciones</h1>
        <p className="text-muted-foreground text-sm mt-1">Panel de semáforo de cumplimiento normativo.</p>
      </div>

      {/* Semaphore */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Al día", count: verdes, color: "success", dot: "green", desc: "Sin problemas" },
          { label: "Por vencer", count: amarillos, color: "warning", dot: "yellow", desc: "Atención pronto" },
          { label: "Vencido", count: rojos, color: "danger", dot: "red", desc: "Acción urgente" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 border ${s.count > 0 && s.dot === "red" ? "border-danger/40 bg-danger/5" : s.count > 0 && s.dot === "yellow" ? "border-warning/40 bg-warning/5" : "border-border bg-card"} shadow-card`}>
            <div className={`semaphore-${s.dot} mb-3 ${s.count > 0 && s.dot === "red" ? "pulse-red" : ""}`} />
            <p className="text-2xl font-extrabold text-foreground">{s.count}</p>
            <p className="text-sm font-semibold text-foreground">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Unread alerts */}
      {unread.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-danger" />
            <h2 className="font-semibold text-foreground text-sm">Sin leer ({unread.length})</h2>
          </div>
          <div className="space-y-3">
            {unread.map((a) => <AlertCard key={a.id} alert={a} />)}
          </div>
        </div>
      )}

      {/* Read alerts */}
      {read.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BellOff className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-foreground text-sm">Leídas ({read.length})</h2>
          </div>
          <div className="space-y-3">
            {read.map((a) => <AlertCard key={a.id} alert={a} />)}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <CheckCircle2 className="w-12 h-12 text-success/40" />
          <p className="text-muted-foreground text-sm">Sin alertas activas. ¡Tu empresa está al día!</p>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
