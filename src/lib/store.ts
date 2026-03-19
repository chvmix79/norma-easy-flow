// ============================================================
// COMPLIANCE360 COLOMBIA — Mock Data & App State Store
// ============================================================

import { Company, ComplianceTask, Alert, AppUser, AppliedNormative, DashboardKPIs, Evidence, Comment } from "./types";
import { runDiagnosis, generateTasks } from "./rulesEngine";
import { create } from "zustand";

// ── Demo company ──────────────────────────────────────────────

export const DEMO_COMPANY: Company = {
  id: "empresa-demo-001",
  nombre: "TechSolutions Colombia S.A.S.",
  nit: "901.234.567-8",
  sector: "tecnologia",
  empleados: 45,
  ciudad: "Bogotá D.C.",
  tipo: "pyme",
  manejaDatosPersonales: true,
  nivelRiesgo: "medio",
  creadoEn: "2024-01-15",
};

// ── Demo user ─────────────────────────────────────────────────

export const DEMO_USER: AppUser = {
  id: "user-001",
  nombre: "Ana María García",
  email: "ana.garcia@techsolutions.com.co",
  rol: "compliance_officer",
  empresaId: "empresa-demo-001",
};

// ── Pre-computed demo tasks with some progress ────────────────

function buildDemoState() {
  const diagnosis = runDiagnosis(DEMO_COMPANY);
  const tasks = generateTasks(DEMO_COMPANY, diagnosis);

  // Simulate some completed tasks for demo
  const completedIds = [tasks[0]?.id, tasks[1]?.id, tasks[3]?.id, tasks[7]?.id, tasks[8]?.id];
  const inProgressIds = [tasks[2]?.id, tasks[4]?.id, tasks[9]?.id];
  const overdueIds = [tasks[5]?.id];

  const updatedTasks = tasks.map((t) => {
    if (completedIds.includes(t.id)) {
      const demoEvidence: Evidence = {
        id: `ev-${t.id}`,
        tareaId: t.id,
        nombre: "Evidencia_Completada.pdf",
        tipo: "documento",
        url: "#",
        tamaño: "245 KB",
        version: 1,
        subidoPor: "Ana María García",
        fechaSubida: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        historial: [],
      };
      const demoComment: Comment = {
        id: `cmt-${t.id}`,
        autor: "Ana María García",
        rol: "compliance_officer",
        texto: "Tarea completada y documentada correctamente.",
        fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      };
      return { ...t, estado: "completado" as const, evidencias: [demoEvidence], comentarios: [demoComment] };
    }
    if (inProgressIds.includes(t.id)) return { ...t, estado: "en_proceso" as const };
    if (overdueIds.includes(t.id)) {
      return {
        ...t,
        estado: "vencido" as const,
        fechaVencimiento: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      };
    }
    return t;
  });

  // Update normative cumplimiento
  const updatedDiagnosis = diagnosis.map((d) => {
    if (!d.applies) return d;
    const normTasks = updatedTasks.filter((t) => t.normativaCode === d.normative.code);
    const completed = normTasks.filter((t) => t.estado === "completado").length;
    const total = normTasks.length;
    return {
      ...d,
      tareasCompletadas: completed,
      totalTareas: total,
      cumplimiento: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  return { tasks: updatedTasks, diagnosis: updatedDiagnosis };
}

const { tasks: DEMO_TASKS, diagnosis: DEMO_DIAGNOSIS } = buildDemoState();

// ── Demo alerts ───────────────────────────────────────────────

export const DEMO_ALERTS: Alert[] = [
  {
    id: "alert-001",
    titulo: "Capacitación SST vencida",
    descripcion: "La capacitación anual en Seguridad y Salud en el Trabajo venció hace 3 días.",
    severidad: "danger",
    semaforo: "rojo",
    leida: false,
    fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    normativaCode: "SG-SST",
    tareaId: DEMO_TASKS[5]?.id,
  },
  {
    id: "alert-002",
    titulo: "Registro bases de datos — próximo a vencer",
    descripcion: "El registro de bases de datos ante la SIC vence en 5 días.",
    severidad: "warning",
    semaforo: "amarillo",
    leida: false,
    fecha: new Date().toISOString(),
    normativaCode: "HABEAS_DATA",
  },
  {
    id: "alert-003",
    titulo: "Controles de acceso implementados",
    descripcion: "Los controles de acceso y doble factor de autenticación fueron configurados exitosamente.",
    severidad: "success",
    semaforo: "verde",
    leida: true,
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    normativaCode: "SEGINFO",
  },
  {
    id: "alert-004",
    titulo: "Nueva normativa SAGRILAFT",
    descripcion: "La Superintendencia de Sociedades actualizó los lineamientos del SAGRILAFT. Revise las nuevas obligaciones.",
    severidad: "info",
    semaforo: "amarillo",
    leida: false,
    fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    normativaCode: "SAGRILAFT",
  },
  {
    id: "alert-005",
    titulo: "Política de tratamiento de datos — pendiente de aprobación",
    descripcion: "La política de tratamiento de datos fue redactada pero aún no ha sido aprobada por la gerencia.",
    severidad: "warning",
    semaforo: "amarillo",
    leida: false,
    fecha: new Date().toISOString(),
    normativaCode: "HABEAS_DATA",
  },
];

// ── KPIs ──────────────────────────────────────────────────────

function computeKPIs(tasks: ComplianceTask[], diagnosis: AppliedNormative[]): DashboardKPIs {
  const completed = tasks.filter((t) => t.estado === "completado").length;
  const total = tasks.length;
  const cumplimientoTotal = total > 0 ? Math.round((completed / total) * 100) : 0;

  const activeDiag = diagnosis.filter((d) => d.applies);

  return {
    cumplimientoTotal,
    tareasPendientes: tasks.filter((t) => t.estado === "pendiente").length,
    tareasVencidas: tasks.filter((t) => t.estado === "vencido").length,
    tareasCompletadasHoy: 2,
    alertasActivas: DEMO_ALERTS.filter((a) => !a.leida).length,
    normativasAplicables: activeDiag.length,
    riesgosPorNormativa: activeDiag.map((d) => ({
      normativa: d.normative.code,
      riesgo: 100 - d.cumplimiento,
    })),
    cumplimientoPorNormativa: activeDiag.map((d) => ({
      normativa: d.normative.nombre.split(" ").slice(0, 3).join(" "),
      porcentaje: d.cumplimiento,
      color: d.normative.color,
    })),
    tendencia: [
      { mes: "Ene", porcentaje: 0 },
      { mes: "Feb", porcentaje: 8 },
      { mes: "Mar", porcentaje: 15 },
      { mes: "Abr", porcentaje: 22 },
      { mes: "May", porcentaje: 30 },
      { mes: "Jun", porcentaje: Math.round((completed / total) * 100) },
    ],
  };
}

// ── Zustand store ─────────────────────────────────────────────

interface AppState {
  // Auth
  isAuthenticated: boolean;
  currentUser: AppUser | null;

  // Company
  company: Company | null;
  isCompanyRegistered: boolean;

  // Diagnosis
  diagnosis: AppliedNormative[];
  isDiagnosisComplete: boolean;

  // Tasks
  tasks: ComplianceTask[];

  // Alerts
  alerts: Alert[];

  // KPIs
  kpis: DashboardKPIs | null;

  // UI state
  currentPage: string;

  // Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setPage: (page: string) => void;
  registerCompany: (company: Omit<Company, "id" | "creadoEn">) => void;
  runDiagnosisForCompany: () => void;
  updateTask: (taskId: string, updates: Partial<ComplianceTask>) => void;
  addEvidence: (taskId: string, evidence: Omit<Evidence, "id" | "fechaSubida">) => void;
  addComment: (taskId: string, comment: Omit<Comment, "id" | "fecha">) => void;
  markAlertRead: (alertId: string) => void;
  loadDemoData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  currentUser: null,
  company: null,
  isCompanyRegistered: false,
  diagnosis: [],
  isDiagnosisComplete: false,
  tasks: [],
  alerts: [],
  kpis: null,
  currentPage: "login",

  login: (email, password) => {
    // Demo credentials
    if (
      (email === "demo@compliance360.co" || email === DEMO_USER.email) &&
      password === "demo1234"
    ) {
      set({
        isAuthenticated: true,
        currentUser: DEMO_USER,
        currentPage: "dashboard",
      });
      get().loadDemoData();
      return true;
    }
    return false;
  },

  logout: () =>
    set({
      isAuthenticated: false,
      currentUser: null,
      currentPage: "login",
      company: null,
      isCompanyRegistered: false,
      diagnosis: [],
      isDiagnosisComplete: false,
      tasks: [],
      alerts: [],
      kpis: null,
    }),

  setPage: (page) => set({ currentPage: page }),

  registerCompany: (companyData) => {
    const company: Company = {
      ...companyData,
      id: `empresa-${Date.now()}`,
      creadoEn: new Date().toISOString().split("T")[0],
    };
    set({ company, isCompanyRegistered: true });
  },

  runDiagnosisForCompany: () => {
    const { company } = get();
    if (!company) return;
    const diag = runDiagnosis(company);
    const tasks = generateTasks(company, diag);
    const kpis = computeKPIs(tasks, diag);
    set({
      diagnosis: diag,
      isDiagnosisComplete: true,
      tasks,
      alerts: DEMO_ALERTS,
      kpis,
      currentPage: "diagnosis",
    });
  },

  updateTask: (taskId, updates) => {
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates, actualizadoEn: new Date().toISOString() } : t
      );
      const diagnosis = state.diagnosis.map((d) => {
        if (!d.applies) return d;
        const normTasks = tasks.filter((t) => t.normativaCode === d.normative.code);
        const completed = normTasks.filter((t) => t.estado === "completado").length;
        const total = normTasks.length;
        return { ...d, tareasCompletadas: completed, cumplimiento: total > 0 ? Math.round((completed / total) * 100) : 0 };
      });
      const kpis = computeKPIs(tasks, diagnosis);
      return { tasks, diagnosis, kpis };
    });
  },

  addEvidence: (taskId, evidence) => {
    const newEvidence: Evidence = {
      ...evidence,
      id: `ev-${Date.now()}`,
      fechaSubida: new Date().toISOString(),
    };
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, evidencias: [...t.evidencias, newEvidence] } : t
      ),
    }));
  },

  addComment: (taskId, comment) => {
    const newComment: Comment = {
      ...comment,
      id: `cmt-${Date.now()}`,
      fecha: new Date().toISOString(),
    };
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, comentarios: [...t.comentarios, newComment] } : t
      ),
    }));
  },

  markAlertRead: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, leida: true } : a)),
    }));
  },

  loadDemoData: () => {
    const kpis = computeKPIs(DEMO_TASKS, DEMO_DIAGNOSIS);
    set({
      company: DEMO_COMPANY,
      isCompanyRegistered: true,
      diagnosis: DEMO_DIAGNOSIS,
      isDiagnosisComplete: true,
      tasks: DEMO_TASKS,
      alerts: DEMO_ALERTS,
      kpis,
    });
  },
}));
