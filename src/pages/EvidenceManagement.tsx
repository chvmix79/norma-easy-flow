import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Evidence } from "@/lib/types";
import { NORMATIVES } from "@/lib/rulesEngine";
import { Upload, FileText, Image, Link, Award, Calendar, User, Clock } from "lucide-react";

const EvidenceManagement = () => {
  const { tasks, addEvidence, currentUser } = useAppStore();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ nombre: "", tipo: "documento" as Evidence["tipo"] });

  const allEvidences = tasks.flatMap((t) =>
    t.evidencias.map((e) => ({ ...e, taskTitulo: t.titulo, normativaCode: t.normativaCode }))
  );

  const handleFakeUpload = async (taskId: string) => {
    if (!uploadForm.nombre.trim() || !currentUser) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1000));
    addEvidence(taskId, {
      tareaId: taskId,
      nombre: `${uploadForm.nombre}.pdf`,
      tipo: uploadForm.tipo,
      url: "#",
      tamaño: `${Math.floor(Math.random() * 900 + 100)} KB`,
      version: 1,
      subidoPor: currentUser.nombre,
      historial: [],
    });
    setUploading(false);
    setUploadForm({ nombre: "", tipo: "documento" });
    setSelectedTask(null);
  };

  const typeIcon = (tipo: Evidence["tipo"]) => {
    const map = { documento: <FileText className="w-4 h-4" />, imagen: <Image className="w-4 h-4" />, enlace: <Link className="w-4 h-4" />, certificado: <Award className="w-4 h-4" /> };
    return map[tipo];
  };

  const tasksWithPending = tasks.filter((t) => t.estado !== "completado");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-extrabold text-foreground">Gestión de Evidencias</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Sube y gestiona documentos, certificados e imágenes como evidencia de cumplimiento.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total evidencias", value: allEvidences.length, icon: <FileText className="w-5 h-5" /> },
          { label: "Tareas con evidencia", value: tasks.filter((t) => t.evidencias.length > 0).length, icon: <Award className="w-5 h-5" /> },
          { label: "Tareas sin evidencia", value: tasks.filter((t) => t.evidencias.length === 0 && t.estado === "completado").length, icon: <Clock className="w-5 h-5" /> },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border shadow-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">{s.icon}<span className="text-xs">{s.label}</span></div>
            <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload panel */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Subir nueva evidencia</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Seleccionar tarea</label>
              <select
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={selectedTask ?? ""}
                onChange={(e) => setSelectedTask(e.target.value || null)}
              >
                <option value="">-- Seleccionar tarea --</option>
                {tasksWithPending.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.normativaCode}] {t.titulo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Nombre del documento</label>
              <input
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={uploadForm.nombre}
                onChange={(e) => setUploadForm((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej: Política_SST_2025"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Tipo de evidencia</label>
              <div className="grid grid-cols-2 gap-2">
                {(["documento", "imagen", "certificado", "enlace"] as Evidence["tipo"][]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setUploadForm((f) => ({ ...f, tipo: t }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all capitalize ${
                      uploadForm.tipo === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {typeIcon(t)} {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop zone */}
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Arrastra archivos aquí o haz clic para seleccionar</p>
              <p className="text-xs text-muted-foreground/60 mt-1">PDF, DOCX, PNG, JPG — máx. 20MB</p>
            </div>

            <button
              onClick={() => selectedTask && handleFakeUpload(selectedTask)}
              disabled={!selectedTask || !uploadForm.nombre || uploading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90"
              style={{ background: "var(--gradient-primary)" }}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Subiendo...
                </>
              ) : (
                <><Upload className="w-4 h-4" /> Subir evidencia</>
              )}
            </button>
          </div>
        </div>

        {/* Evidence list */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">
            Evidencias registradas ({allEvidences.length})
          </h3>
          {allEvidences.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No hay evidencias registradas aún.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin pr-1">
              {allEvidences.map((ev) => {
                const norm = NORMATIVES[ev.normativaCode as keyof typeof NORMATIVES];
                return (
                  <div key={ev.id} className="flex items-start gap-3 p-3 bg-muted/40 rounded-xl hover:bg-muted transition-colors">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: norm?.color ?? "hsl(var(--primary))" }}
                    >
                      {typeIcon(ev.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{ev.nombre}</p>
                      <p className="text-xs text-muted-foreground truncate">{ev.taskTitulo}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="w-3 h-3" /> {ev.subidoPor}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" /> {new Date(ev.fechaSubida).toLocaleDateString("es-CO")}
                        </span>
                        {ev.tamaño && <span className="text-xs text-muted-foreground">{ev.tamaño}</span>}
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0"
                      style={{ background: norm?.color }}
                    >
                      v{ev.version}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvidenceManagement;
