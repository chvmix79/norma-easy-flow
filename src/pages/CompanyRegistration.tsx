import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Company, Sector, CompanySize, RiskLevel } from "@/lib/types";
import { Building2, Save, CheckCircle2, ArrowRight } from "lucide-react";

const SECTORES: { value: Sector; label: string }[] = [
  { value: "salud", label: "🏥 Salud" },
  { value: "logistica", label: "🚚 Logística" },
  { value: "comercio", label: "🛍️ Comercio" },
  { value: "financiero", label: "🏦 Financiero" },
  { value: "manufactura", label: "🏭 Manufactura" },
  { value: "tecnologia", label: "💻 Tecnología" },
  { value: "educacion", label: "📚 Educación" },
  { value: "construccion", label: "🏗️ Construcción" },
  { value: "servicios", label: "🛎️ Servicios" },
  { value: "otro", label: "🏢 Otro" },
];

const CompanyRegistration = () => {
  const { company, registerCompany, runDiagnosisForCompany, setPage } = useAppStore();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<Omit<Company, "id" | "creadoEn">>({
    nombre: company?.nombre ?? "",
    nit: company?.nit ?? "",
    sector: company?.sector ?? "tecnologia",
    empleados: company?.empleados ?? 0,
    ciudad: company?.ciudad ?? "",
    tipo: company?.tipo ?? "pyme",
    manejaDatosPersonales: company?.manejaDatosPersonales ?? false,
    nivelRiesgo: company?.nivelRiesgo ?? "medio",
  });

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    registerCompany(form);
    setSaved(true);
  };

  const handleDiagnosis = () => {
    registerCompany(form);
    runDiagnosisForCompany();
  };

  const field = "w-full px-3 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";
  const label = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-foreground flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" /> Datos de la Empresa
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Esta información se usará para determinar automáticamente qué normativas aplican a tu empresa.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/30 rounded-xl text-success text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">¡Empresa guardada exitosamente!</p>
            <p className="text-success/80 text-xs mt-0.5">Ahora puedes ejecutar el diagnóstico normativo automático.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
        <h2 className="font-semibold text-foreground text-sm border-b border-border pb-3">
          Información General
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Nombre de la empresa *</label>
            <input
              className={field}
              value={form.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              placeholder="Ej: Mi Empresa S.A.S."
              required
            />
          </div>
          <div>
            <label className={label}>NIT *</label>
            <input
              className={field}
              value={form.nit}
              onChange={(e) => set("nit", e.target.value)}
              placeholder="Ej: 900.123.456-7"
              required
            />
          </div>
          <div>
            <label className={label}>Ciudad *</label>
            <input
              className={field}
              value={form.ciudad}
              onChange={(e) => set("ciudad", e.target.value)}
              placeholder="Ej: Bogotá D.C."
              required
            />
          </div>
          <div>
            <label className={label}>Número de empleados *</label>
            <input
              type="number"
              min={0}
              className={field}
              value={form.empleados || ""}
              onChange={(e) => set("empleados", Number(e.target.value))}
              placeholder="Ej: 45"
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Sector económico *</label>
            <select
              className={field}
              value={form.sector}
              onChange={(e) => set("sector", e.target.value as Sector)}
            >
              {SECTORES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Tipo de empresa *</label>
            <select
              className={field}
              value={form.tipo}
              onChange={(e) => set("tipo", e.target.value as CompanySize)}
            >
              <option value="micro">Microempresa (1-10 empleados)</option>
              <option value="pyme">PYME (11-200 empleados)</option>
              <option value="grande">Grande (+200 empleados)</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Nivel de riesgo percibido *</label>
            <select
              className={field}
              value={form.nivelRiesgo}
              onChange={(e) => set("nivelRiesgo", e.target.value as RiskLevel)}
            >
              <option value="bajo">🟢 Bajo</option>
              <option value="medio">🟡 Medio</option>
              <option value="alto">🔴 Alto</option>
            </select>
          </div>
          <div>
            <label className={label}>¿Maneja datos personales?</label>
            <div className="flex gap-3 mt-1">
              {[
                { val: true, label: "✅ Sí, manejo datos personales" },
                { val: false, label: "❌ No manejo datos personales" },
              ].map((opt) => (
                <button
                  key={String(opt.val)}
                  type="button"
                  onClick={() => set("manejaDatosPersonales", opt.val)}
                  className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                    form.manejaDatosPersonales === opt.val
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info boxes */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          {[
            { icon: "🦺", title: "SG-SST", desc: `${form.empleados > 0 ? "Aplica" : "No aplica"} con ${form.empleados} empleados` },
            { icon: "🔒", title: "Habeas Data", desc: form.manejaDatosPersonales ? "Aplica — maneja datos" : "Revisar en diagnóstico" },
            { icon: "⚖️", title: "SAGRILAFT", desc: form.tipo === "grande" ? "Probable aplicación" : "Depende del sector" },
          ].map((box) => (
            <div key={box.title} className="bg-muted/40 rounded-lg p-3 flex items-start gap-2">
              <span className="text-lg">{box.icon}</span>
              <div>
                <p className="text-xs font-semibold text-foreground">{box.title}</p>
                <p className="text-xs text-muted-foreground">{box.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
          >
            <Save className="w-4 h-4" /> Guardar datos
          </button>
          <button
            type="button"
            onClick={handleDiagnosis}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
            style={{ background: "var(--gradient-primary)" }}
          >
            Ejecutar diagnóstico <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Help box */}
      <div className="bg-info/10 border border-info/20 rounded-xl p-4 text-sm text-info">
        <p className="font-semibold mb-1">💡 ¿Para qué sirven estos datos?</p>
        <p className="text-info/80 text-xs leading-relaxed">
          El motor de reglas normativo analiza automáticamente el sector, tamaño, número de empleados y manejo de datos personales para determinar exactamente qué normativas aplican a tu empresa y generar un plan de cumplimiento personalizado.
        </p>
      </div>
    </div>
  );
};

export default CompanyRegistration;
