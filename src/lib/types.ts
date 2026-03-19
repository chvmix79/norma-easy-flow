// ============================================================
// COMPLIANCE360 COLOMBIA — TypeScript Types
// ============================================================

export type Sector =
  | "salud"
  | "logistica"
  | "comercio"
  | "financiero"
  | "manufactura"
  | "tecnologia"
  | "educacion"
  | "construccion"
  | "servicios"
  | "otro";

export type CompanySize = "micro" | "pyme" | "grande";
export type RiskLevel = "bajo" | "medio" | "alto";
export type UserRole = "admin" | "compliance_officer" | "auditor";

export interface Company {
  id: string;
  nombre: string;
  nit: string;
  sector: Sector;
  empleados: number;
  ciudad: string;
  tipo: CompanySize;
  manejaDatosPersonales: boolean;
  nivelRiesgo: RiskLevel;
  creadoEn: string;
  logo?: string;
}

// ── Normatives ──────────────────────────────────────────────

export type NormativeCode =
  | "SG-SST"
  | "HABEAS_DATA"
  | "SEGINFO"
  | "SAGRILAFT"
  | "PTEE"
  | "CODIGO_SUSTANTIVO"
  | "RETIE";

export interface Normative {
  code: NormativeCode;
  nombre: string;
  descripcion: string;
  entidadReguladora: string;
  leyBase: string;
  icono: string;
  color: string;
}

export interface AppliedNormative {
  normative: Normative;
  applies: boolean;
  reason: string;
  cumplimiento: number; // 0-100
  totalTareas: number;
  tareasCompletadas: number;
}

// ── Tasks / Obligations ─────────────────────────────────────

export type TaskStatus = "pendiente" | "en_proceso" | "completado" | "vencido";
export type TaskPriority = "baja" | "media" | "alta" | "critica";

export interface ComplianceTask {
  id: string;
  normativaCode: NormativeCode;
  titulo: string;
  descripcion: string;
  responsable: string;
  fechaVencimiento: string;
  prioridad: TaskPriority;
  estado: TaskStatus;
  evidencias: Evidence[];
  comentarios: Comment[];
  creadoEn: string;
  actualizadoEn: string;
}

// ── Evidence ─────────────────────────────────────────────────

export type EvidenceType = "documento" | "imagen" | "enlace" | "certificado";

export interface Evidence {
  id: string;
  tareaId: string;
  nombre: string;
  tipo: EvidenceType;
  url: string;
  tamaño?: string;
  version: number;
  subidoPor: string;
  fechaSubida: string;
  historial?: EvidenceHistoryEntry[];
}

export interface EvidenceHistoryEntry {
  version: number;
  subidoPor: string;
  fecha: string;
  cambios: string;
}

// ── Comments ─────────────────────────────────────────────────

export interface Comment {
  id: string;
  autor: string;
  rol: UserRole;
  texto: string;
  fecha: string;
}

// ── Alerts ───────────────────────────────────────────────────

export type AlertSeverity = "info" | "warning" | "danger" | "success";
export type AlertStatus = "verde" | "amarillo" | "rojo";

export interface Alert {
  id: string;
  tareaId?: string;
  titulo: string;
  descripcion: string;
  severidad: AlertSeverity;
  semaforo: AlertStatus;
  leida: boolean;
  fecha: string;
  normativaCode?: NormativeCode;
}

// ── Dashboard KPIs ────────────────────────────────────────────

export interface DashboardKPIs {
  cumplimientoTotal: number;
  tareasPendientes: number;
  tareasVencidas: number;
  tareasCompletadasHoy: number;
  alertasActivas: number;
  normativasAplicables: number;
  riesgosPorNormativa: { normativa: string; riesgo: number }[];
  cumplimientoPorNormativa: { normativa: string; porcentaje: number; color: string }[];
  tendencia: { mes: string; porcentaje: number }[];
}

// ── AI Chat ───────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ── Auth / Users ──────────────────────────────────────────────

export interface AppUser {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  empresaId: string;
  avatar?: string;
}
