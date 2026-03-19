import { useAppStore } from "@/lib/store";
import { FileText, Download, Building2, Shield, CheckCircle2, Clock, XCircle } from "lucide-react";

const AuditReports = () => {
  const { company, diagnosis, tasks, kpis } = useAppStore();

  if (!company || !kpis) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-4 animate-fade-in">
        <p className="text-muted-foreground text-sm">Registra tu empresa y ejecuta el diagnóstico primero.</p>
      </div>
    );
  }

  const activeNorm = diagnosis.filter((d) => d.applies);
  const completed = tasks.filter((t) => t.estado === "completado").length;
  const pending = tasks.filter((t) => t.estado === "pendiente").length;
  const overdue = tasks.filter((t) => t.estado === "vencido").length;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Reportes para Auditoría</h1>
          <p className="text-muted-foreground text-sm mt-1">Genera reportes descargables del estado de cumplimiento.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-all"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Download className="w-4 h-4" /> Descargar PDF
        </button>
      </div>

      {/* Report preview */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        {/* Report header */}
        <div className="p-6 text-white" style={{ background: "var(--gradient-hero)" }}>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8" />
            <div>
              <h2 className="text-lg font-extrabold">Compliance360 Colombia</h2>
              <p className="text-white/70 text-sm">Reporte de Cumplimiento Normativo</p>
            </div>
          </div>
          <p className="text-white/60 text-xs">
            Generado el {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Company data */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Datos de la Empresa</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: "Razón social", value: company.nombre },
                { label: "NIT", value: company.nit },
                { label: "Ciudad", value: company.ciudad },
                { label: "Sector", value: company.sector },
                { label: "Empleados", value: company.empleados.toString() },
                { label: "Tipo", value: company.tipo },
              ].map((f) => (
                <div key={f.label} className="bg-muted/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="text-sm font-semibold text-foreground capitalize mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Compliance summary */}
          <section>
            <h3 className="font-semibold text-foreground text-sm mb-3">Resumen de Cumplimiento</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Cumplimiento", value: `${kpis.cumplimientoTotal}%`, icon: <Shield className="w-4 h-4" />, color: kpis.cumplimientoTotal >= 70 ? "success" : kpis.cumplimientoTotal >= 40 ? "warning" : "danger" },
                { label: "Completadas", value: completed, icon: <CheckCircle2 className="w-4 h-4" />, color: "success" },
                { label: "Pendientes", value: pending, icon: <Clock className="w-4 h-4" />, color: "warning" },
                { label: "Vencidas", value: overdue, icon: <XCircle className="w-4 h-4" />, color: "danger" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl p-4 text-center ${s.color === "success" ? "bg-success/10" : s.color === "warning" ? "bg-warning/10" : "bg-danger/10"}`}>
                  <div className={`flex justify-center mb-2 ${s.color === "success" ? "text-success" : s.color === "warning" ? "text-warning-foreground" : "text-danger"}`}>{s.icon}</div>
                  <p className="text-xl font-extrabold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Normatives table */}
          <section>
            <h3 className="font-semibold text-foreground text-sm mb-3">Estado por Normativa</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground pb-2">Normativa</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground pb-2">Regulador</th>
                    <th className="text-center text-xs font-semibold text-muted-foreground pb-2">Tareas</th>
                    <th className="text-center text-xs font-semibold text-muted-foreground pb-2">Cumplimiento</th>
                    <th className="text-center text-xs font-semibold text-muted-foreground pb-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activeNorm.map((n) => (
                    <tr key={n.normative.code} className="hover:bg-muted/30">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span>{n.normative.icono}</span>
                          <div>
                            <p className="font-semibold text-foreground text-xs">{n.normative.code}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[180px]">{n.normative.leyBase}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">{n.normative.entidadReguladora}</td>
                      <td className="py-3 text-center text-xs text-foreground">{n.tareasCompletadas}/{n.totalTareas}</td>
                      <td className="py-3 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="progress-bar-track w-16">
                            <div className="progress-bar-fill-primary" style={{ width: `${n.cumplimiento}%`, background: n.cumplimiento >= 70 ? "var(--gradient-success)" : n.cumplimiento >= 40 ? "var(--gradient-warning)" : "var(--gradient-danger)" }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color: n.cumplimiento >= 70 ? "hsl(var(--success))" : n.cumplimiento >= 40 ? "hsl(var(--warning))" : "hsl(var(--danger))" }}>{n.cumplimiento}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${n.cumplimiento >= 70 ? "status-green" : n.cumplimiento >= 40 ? "status-yellow" : "status-red"}`}>
                          {n.cumplimiento >= 70 ? "Al día" : n.cumplimiento >= 40 ? "En progreso" : "Requiere atención"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="border-t border-border pt-4 text-xs text-muted-foreground text-center">
            Reporte generado por Compliance360 Colombia · {new Date().getFullYear()} · Confidencial
          </div>
        </div>
      </div>

      {/* Available reports */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { title: "Reporte de Cumplimiento", desc: "Estado general y por normativa", icon: "📊" },
          { title: "Plan de Acción", desc: "Todas las tareas con fechas y responsables", icon: "📋" },
          { title: "Inventario de Evidencias", desc: "Documentos y evidencias cargadas", icon: "📂" },
        ].map((r) => (
          <div key={r.title} className="bg-card rounded-xl border border-border shadow-card p-4 flex items-start gap-3 card-hover cursor-pointer" onClick={() => window.print()}>
            <span className="text-2xl">{r.icon}</span>
            <div>
              <p className="text-sm font-semibold text-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-primary hover:underline">
                <Download className="w-3 h-3" /> Descargar PDF
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditReports;
