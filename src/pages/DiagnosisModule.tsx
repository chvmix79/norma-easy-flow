import { useAppStore } from "@/lib/store";
import { CheckCircle2, XCircle, RefreshCw, ArrowRight, Info } from "lucide-react";

const DiagnosisModule = () => {
  const { diagnosis, company, isDiagnosisComplete, runDiagnosisForCompany, setPage } = useAppStore();

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-4 animate-fade-in">
        <p className="text-muted-foreground text-sm">Primero debes registrar tu empresa.</p>
        <button
          onClick={() => setPage("company")}
          className="px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
          style={{ background: "var(--gradient-primary)" }}
        >
          Registrar empresa
        </button>
      </div>
    );
  }

  const applicable = diagnosis.filter((d) => d.applies);
  const notApplicable = diagnosis.filter((d) => !d.applies);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Diagnóstico Normativo</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Análisis automático de normativas aplicables para <strong>{company.nombre}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runDiagnosisForCompany}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Re-ejecutar
          </button>
          {isDiagnosisComplete && (
            <button
              onClick={() => setPage("compliance-plan")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
              style={{ background: "var(--gradient-primary)" }}
            >
              Ver plan <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Summary banner */}
      {isDiagnosisComplete && (
        <div
          className="rounded-xl p-5 text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🔍</div>
            <div>
              <p className="font-bold">Diagnóstico completado</p>
              <p className="text-white/70 text-sm">
                {applicable.length} normativas aplican · {notApplicable.length} no aplican · {applicable.reduce((s, n) => s + n.totalTareas, 0)} tareas generadas
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Normativas aplicables", value: applicable.length },
              { label: "Tareas generadas", value: applicable.reduce((s, n) => s + n.totalTareas, 0) },
              { label: "Cumplimiento inicial", value: "0%" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-lg p-3 text-center">
                <p className="text-xl font-extrabold">{stat.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engine rules applied */}
      <div className="bg-card rounded-xl border border-border shadow-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-info" />
          <h3 className="font-semibold text-sm text-foreground">Criterios del motor de reglas aplicados</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          {[
            { label: "Empleados", value: `${company.empleados}`, note: company.empleados > 10 ? "SG-SST completo" : "SG-SST simplificado" },
            { label: "Datos personales", value: company.manejaDatosPersonales ? "Sí" : "No", note: company.manejaDatosPersonales ? "→ Habeas Data aplica" : "→ Habeas Data no aplica" },
            { label: "Sector", value: company.sector, note: ["financiero","logistica"].includes(company.sector) ? "→ SAGRILAFT probable" : "Verificar reglas" },
            { label: "Tamaño", value: company.tipo, note: company.tipo === "grande" ? "→ PTEE obligatorio" : "PTEE no aplica" },
            { label: "Riesgo", value: company.nivelRiesgo, note: company.nivelRiesgo === "alto" ? "→ SEGINFO aplica" : "Verificar reglas" },
          ].map((rule) => (
            <div key={rule.label} className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{rule.label}</p>
              <p className="text-sm font-semibold text-foreground capitalize">{rule.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{rule.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Applicable normatives */}
      <div>
        <h2 className="font-semibold text-foreground text-base mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          Normativas que aplican ({applicable.length})
        </h2>
        <div className="space-y-3">
          {applicable.map((item) => (
            <div
              key={item.normative.code}
              className="bg-card rounded-xl border border-success/30 shadow-card p-5 card-hover"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${item.normative.color}15` }}
                >
                  {item.normative.icono}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: item.normative.color }}
                    >
                      {item.normative.code}
                    </span>
                    <span className="status-green text-xs px-2 py-0.5 rounded-full font-medium">
                      ✓ Aplica
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.totalTareas} tareas generadas
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{item.normative.nombre}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.normative.descripcion}</p>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Regulador:</span> {item.normative.entidadReguladora}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Base legal:</span> {item.normative.leyBase}
                    </p>
                  </div>
                  <div className="mt-3 p-3 bg-muted/40 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">¿Por qué aplica?</span> {item.reason}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Not applicable */}
      {notApplicable.length > 0 && (
        <div>
          <h2 className="font-semibold text-foreground text-base mb-3 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-muted-foreground" />
            No aplican ({notApplicable.length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {notApplicable.map((item) => (
              <div key={item.normative.code} className="bg-card rounded-xl border border-border p-4 opacity-60">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.normative.icono}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.normative.code}</p>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisModule;
