// ============================================================
// COMPLIANCE360 COLOMBIA — Rules Engine
// Determines which normatives apply based on company profile
// ============================================================

import { Company, NormativeCode, Normative, AppliedNormative } from "./types";

export const NORMATIVES: Record<NormativeCode, Normative> = {
  "SG-SST": {
    code: "SG-SST",
    nombre: "Sistema de Gestión de Seguridad y Salud en el Trabajo",
    descripcion:
      "Conjunto de acciones para identificar peligros, evaluar y controlar riesgos en el trabajo. Obligatorio para todas las empresas colombianas según el Decreto 1072 de 2015.",
    entidadReguladora: "Ministerio del Trabajo",
    leyBase: "Decreto 1072/2015, Resolución 0312/2019",
    icono: "🦺",
    color: "#0d9488",
  },
  HABEAS_DATA: {
    code: "HABEAS_DATA",
    nombre: "Protección de Datos Personales (Habeas Data)",
    descripcion:
      "Regulación del tratamiento de datos personales. Toda empresa que recopile, almacene o procese datos personales debe cumplir con la Ley 1581 de 2012 y el Decreto 1377 de 2013.",
    entidadReguladora: "Superintendencia de Industria y Comercio (SIC)",
    leyBase: "Ley 1581/2012, Decreto 1377/2013",
    icono: "🔒",
    color: "#7c3aed",
  },
  SEGINFO: {
    code: "SEGINFO",
    nombre: "Seguridad de la Información (ISO 27001 / CONPES 3854)",
    descripcion:
      "Marco para proteger la confidencialidad, integridad y disponibilidad de la información empresarial.",
    entidadReguladora: "MinTIC / Icontec",
    leyBase: "CONPES 3854/2016, ISO/IEC 27001",
    icono: "🛡️",
    color: "#1d4ed8",
  },
  SAGRILAFT: {
    code: "SAGRILAFT",
    nombre: "Sistema de Autocontrol y Gestión de Riesgo de LA/FT/FPADM",
    descripcion:
      "Sistema de prevención de lavado de activos y financiación del terrorismo. Obligatorio para empresas en sectores de riesgo y con ingresos superiores a los umbrales definidos.",
    entidadReguladora: "Superintendencia de Sociedades",
    leyBase: "Circular Externa 100-000016/2020",
    icono: "⚖️",
    color: "#b45309",
  },
  PTEE: {
    code: "PTEE",
    nombre: "Programa de Transparencia y Ética Empresarial",
    descripcion:
      "Programa para prevenir el soborno transnacional y la corrupción. Obligatorio para empresas con ingresos superiores a 40.000 SMMLV o activos superiores a 80.000 SMMLV.",
    entidadReguladora: "Superintendencia de Sociedades",
    leyBase: "Ley 2195/2022, Decreto 2011/2019",
    icono: "🤝",
    color: "#059669",
  },
  CODIGO_SUSTANTIVO: {
    code: "CODIGO_SUSTANTIVO",
    nombre: "Código Sustantivo del Trabajo",
    descripcion:
      "Marco normativo laboral colombiano. Regula las relaciones entre empleadores y trabajadores, incluyendo contratos, salarios, prestaciones y derechos laborales.",
    entidadReguladora: "Ministerio del Trabajo",
    leyBase: "Código Sustantivo del Trabajo (CST)",
    icono: "📋",
    color: "#dc2626",
  },
  RETIE: {
    code: "RETIE",
    nombre: "Reglamento Técnico de Instalaciones Eléctricas (RETIE)",
    descripcion:
      "Norma técnica obligatoria para instalaciones eléctricas de baja, media y alta tensión en Colombia.",
    entidadReguladora: "Ministerio de Minas y Energía",
    leyBase: "Resolución 90708/2013",
    icono: "⚡",
    color: "#f59e0b",
  },
};

// ── Rule definitions ─────────────────────────────────────────

interface Rule {
  normativeCode: NormativeCode;
  evaluate: (company: Company) => { applies: boolean; reason: string };
}

const RULES: Rule[] = [
  {
    normativeCode: "SG-SST",
    evaluate: (c) => {
      if (c.empleados >= 1) {
        const level =
          c.empleados > 10
            ? "completo"
            : c.empleados > 1
            ? "simplificado (hasta 10 empleados)"
            : "básico (emprendedor)";
        return {
          applies: true,
          reason: `Obligatorio para toda empresa con empleados. Con ${c.empleados} empleados aplica el nivel ${level} según Resolución 0312/2019.`,
        };
      }
      return { applies: false, reason: "Sin empleados registrados." };
    },
  },
  {
    normativeCode: "HABEAS_DATA",
    evaluate: (c) => {
      if (c.manejaDatosPersonales) {
        return {
          applies: true,
          reason:
            "La empresa maneja datos personales. Debe implementar políticas de tratamiento, registrar bases de datos ante la SIC y garantizar derechos ARCO.",
        };
      }
      return {
        applies: false,
        reason: "No maneja datos personales de terceros.",
      };
    },
  },
  {
    normativeCode: "SEGINFO",
    evaluate: (c) => {
      const highRisk = c.nivelRiesgo === "alto";
      const techSector = c.sector === "tecnologia" || c.sector === "financiero";
      const handles = c.manejaDatosPersonales;
      if (highRisk || techSector || handles) {
        return {
          applies: true,
          reason: `Aplica por ${[
            highRisk ? "nivel de riesgo alto" : "",
            techSector ? "sector tecnológico/financiero" : "",
            handles ? "manejo de datos personales" : "",
          ]
            .filter(Boolean)
            .join(", ")}.`,
        };
      }
      return {
        applies: false,
        reason: "No cumple criterios para seguridad de la información avanzada.",
      };
    },
  },
  {
    normativeCode: "SAGRILAFT",
    evaluate: (c) => {
      const riesgo = c.nivelRiesgo === "alto" || c.nivelRiesgo === "medio";
      const sectorRiesgo =
        c.sector === "financiero" ||
        c.sector === "logistica" ||
        c.sector === "comercio";
      const grande = c.tipo === "grande" || c.empleados > 200;
      if ((riesgo && sectorRiesgo) || grande) {
        return {
          applies: true,
          reason: `Aplica por ${[
            grande ? "tamaño de empresa grande" : "",
            riesgo && sectorRiesgo ? `sector ${c.sector} con nivel de riesgo ${c.nivelRiesgo}` : "",
          ]
            .filter(Boolean)
            .join(" y ")}.`,
        };
      }
      return {
        applies: false,
        reason: "No supera los umbrales de obligatoriedad del SAGRILAFT.",
      };
    },
  },
  {
    normativeCode: "PTEE",
    evaluate: (c) => {
      if (c.tipo === "grande" || c.empleados > 200) {
        return {
          applies: true,
          reason:
            "Empresa grande con más de 200 empleados. Obligatorio según Ley 2195/2022 para prevención de soborno y corrupción.",
        };
      }
      return {
        applies: false,
        reason: "No supera el umbral de ingresos/activos para PTEE.",
      };
    },
  },
  {
    normativeCode: "CODIGO_SUSTANTIVO",
    evaluate: (c) => {
      if (c.empleados >= 1) {
        return {
          applies: true,
          reason: "Toda empresa con al menos un trabajador debe cumplir el Código Sustantivo del Trabajo.",
        };
      }
      return { applies: false, reason: "Sin empleados." };
    },
  },
  {
    normativeCode: "RETIE",
    evaluate: (c) => {
      if (c.sector === "manufactura" || c.sector === "construccion") {
        return {
          applies: true,
          reason: `Sector ${c.sector} requiere cumplimiento del RETIE para instalaciones eléctricas industriales.`,
        };
      }
      return {
        applies: false,
        reason: "No aplica al sector registrado.",
      };
    },
  },
];

// ── Main function ─────────────────────────────────────────────

export function runDiagnosis(company: Company): AppliedNormative[] {
  return RULES.map((rule) => {
    const { applies, reason } = rule.evaluate(company);
    const normative = NORMATIVES[rule.normativeCode];
    return {
      normative,
      applies,
      reason,
      cumplimiento: 0, // starts at 0
      totalTareas: applies ? getInitialTaskCount(rule.normativeCode, company) : 0,
      tareasCompletadas: 0,
    };
  });
}

function getInitialTaskCount(code: NormativeCode, company: Company): number {
  const map: Record<NormativeCode, number> = {
    "SG-SST": company.empleados > 10 ? 12 : 7,
    HABEAS_DATA: 8,
    SEGINFO: 10,
    SAGRILAFT: 14,
    PTEE: 9,
    CODIGO_SUSTANTIVO: 6,
    RETIE: 5,
  };
  return map[code];
}

// ── Task generator ────────────────────────────────────────────

import { ComplianceTask, NormativeCode as NC } from "./types";

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function generateTasks(
  company: Company,
  appliedNormatives: AppliedNormative[]
): ComplianceTask[] {
  const tasks: ComplianceTask[] = [];
  let idCounter = 1;

  const mk = (
    normativaCode: NC,
    titulo: string,
    descripcion: string,
    days: number,
    prioridad: ComplianceTask["prioridad"]
  ): ComplianceTask => ({
    id: `task-${idCounter++}`,
    normativaCode,
    titulo,
    descripcion,
    responsable: "Responsable de Cumplimiento",
    fechaVencimiento: addDays(days),
    prioridad,
    estado: "pendiente",
    evidencias: [],
    comentarios: [],
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  });

  const active = appliedNormatives.filter((n) => n.applies).map((n) => n.normative.code);

  if (active.includes("SG-SST")) {
    tasks.push(
      mk("SG-SST", "Designar responsable del SG-SST", "Nombrar oficialmente al coordinador de seguridad y salud en el trabajo mediante acto administrativo.", 15, "critica"),
      mk("SG-SST", "Realizar evaluación inicial del SG-SST", "Aplicar los estándares mínimos de la Resolución 0312/2019 para medir el estado actual.", 30, "alta"),
      mk("SG-SST", "Elaborar política de SST", "Redactar, aprobar y socializar la política de seguridad y salud en el trabajo.", 30, "alta"),
      mk("SG-SST", "Conformar el COPASST o Vigía SST", "Elegir o designar el Comité Paritario o Vigía de Seguridad y Salud en el Trabajo según número de empleados.", 45, "alta"),
      mk("SG-SST", "Identificar peligros y valorar riesgos (GTC-45)", "Aplicar la Guía Técnica Colombiana GTC-45 para identificar todos los peligros del lugar de trabajo.", 60, "alta"),
      mk("SG-SST", "Capacitación anual en SST a empleados", "Realizar la jornada de capacitación anual obligatoria en SST para todos los trabajadores.", 90, "media"),
      mk("SG-SST", "Plan de emergencias y evacuación", "Elaborar e implementar el plan de emergencias, señalización y rutas de evacuación.", 60, "alta"),
    );
    if (company.empleados > 10) {
      tasks.push(
        mk("SG-SST", "Programa de medicina preventiva", "Implementar programa de vigilancia epidemiológica y exámenes médicos ocupacionales.", 90, "media"),
        mk("SG-SST", "Registro de accidentes e incidentes", "Implementar el sistema de reporte e investigación de accidentes de trabajo e incidentes.", 45, "alta"),
        mk("SG-SST", "Auditoría interna del SG-SST", "Planificar y ejecutar la auditoría anual del sistema de gestión de SST.", 180, "media"),
        mk("SG-SST", "Revisión por la dirección", "Reunión de revisión del SG-SST por la alta dirección con acta firmada.", 180, "media"),
        mk("SG-SST", "Reporte a la ARL", "Enviar informe de gestión del SG-SST a la Administradora de Riesgos Laborales.", 365, "baja"),
      );
    }
  }

  if (active.includes("HABEAS_DATA")) {
    tasks.push(
      mk("HABEAS_DATA", "Crear Política de Tratamiento de Datos Personales", "Redactar y publicar la política de privacidad y tratamiento de datos personales conforme a Ley 1581/2012.", 30, "critica"),
      mk("HABEAS_DATA", "Registrar bases de datos ante la SIC", "Inscribir todas las bases de datos que contengan información personal en el Registro Nacional de Bases de Datos (RNBD).", 45, "critica"),
      mk("HABEAS_DATA", "Implementar canal de solicitudes ARCO", "Crear mecanismo para que los titulares ejerzan derechos de Acceso, Rectificación, Cancelación y Oposición.", 60, "alta"),
      mk("HABEAS_DATA", "Capacitar al personal en protección de datos", "Capacitación obligatoria al personal que maneja datos personales sobre sus responsabilidades.", 45, "alta"),
      mk("HABEAS_DATA", "Obtener autorizaciones de tratamiento de datos", "Revisar y actualizar los formularios de autorización para recopilación de datos personales.", 30, "alta"),
      mk("HABEAS_DATA", "Designar responsable de protección de datos", "Nombrar al oficial de protección de datos o responsable del tratamiento.", 15, "critica"),
      mk("HABEAS_DATA", "Mapa de flujo de datos personales", "Documentar qué datos se recopilan, cómo se usan, se comparten y se eliminan.", 60, "media"),
      mk("HABEAS_DATA", "Revisión anual de la política de datos", "Auditar y actualizar la política de tratamiento de datos al menos una vez al año.", 365, "baja"),
    );
  }

  if (active.includes("SEGINFO")) {
    tasks.push(
      mk("SEGINFO", "Definir política de seguridad de la información", "Crear la política corporativa de seguridad de la información y aprobarla por la dirección.", 30, "critica"),
      mk("SEGINFO", "Inventario de activos de información", "Catalogar todos los activos de información de la empresa (hardware, software, datos, servicios).", 45, "alta"),
      mk("SEGINFO", "Análisis de riesgos de seguridad", "Realizar análisis de vulnerabilidades y amenazas a los sistemas de información.", 60, "alta"),
      mk("SEGINFO", "Implementar controles de acceso", "Configurar políticas de contraseñas seguras, doble factor de autenticación y control de accesos privilegiados.", 30, "alta"),
      mk("SEGINFO", "Plan de continuidad del negocio (BCP)", "Elaborar el plan para garantizar la operación ante incidentes de seguridad.", 90, "media"),
      mk("SEGINFO", "Política de uso de dispositivos y BYOD", "Crear política de uso aceptable de dispositivos corporativos y personales.", 45, "media"),
      mk("SEGINFO", "Capacitación en ciberseguridad", "Entrenamiento anual obligatorio en phishing, contraseñas seguras y protección de información.", 60, "media"),
      mk("SEGINFO", "Respaldo y recuperación de información", "Implementar y probar política de backup y recuperación ante desastres.", 45, "alta"),
      mk("SEGINFO", "Gestión de incidentes de seguridad", "Crear procedimiento de respuesta a incidentes de seguridad informática.", 60, "alta"),
      mk("SEGINFO", "Auditoría de seguridad anual", "Contratar auditoría externa o realizar auditoría interna de seguridad de la información.", 365, "baja"),
    );
  }

  if (active.includes("SAGRILAFT")) {
    tasks.push(
      mk("SAGRILAFT", "Designar oficial de cumplimiento LA/FT", "Nombrar al oficial de cumplimiento con funciones, responsabilidades y reporte a junta directiva.", 15, "critica"),
      mk("SAGRILAFT", "Mapa de riesgos LA/FT/FPADM", "Identificar, medir y priorizar los riesgos de lavado de activos conforme a metodología SAGRILAFT.", 30, "critica"),
      mk("SAGRILAFT", "Procedimiento de debida diligencia de clientes", "Implementar proceso KYC (Know Your Customer) para verificar la identidad y perfil de riesgo de clientes.", 45, "alta"),
      mk("SAGRILAFT", "Señales de alerta y operaciones inusuales", "Definir y documentar las señales de alerta para detectar operaciones sospechosas.", 45, "alta"),
      mk("SAGRILAFT", "Capacitación SAGRILAFT a empleados", "Capacitación obligatoria anual a todos los empleados sobre prevención de LA/FT.", 60, "alta"),
      mk("SAGRILAFT", "Reporte de operaciones sospechosas a UIAF", "Implementar el procedimiento de reporte de operaciones sospechosas a la UIAF.", 30, "critica"),
      mk("SAGRILAFT", "Revisión de listas restrictivas", "Configurar herramienta de consulta de listas OFAC, ONU y listas locales para clientes y proveedores.", 45, "alta"),
      mk("SAGRILAFT", "Auditoría anual SAGRILAFT", "Realizar auditoría independiente del sistema SAGRILAFT y presentar informe a la junta.", 365, "media"),
    );
  }

  if (active.includes("PTEE")) {
    tasks.push(
      mk("PTEE", "Crear Código de Conducta Empresarial", "Elaborar y aprobar el código de conducta corporativo que incluya prevención de soborno.", 30, "critica"),
      mk("PTEE", "Política anticorrupción y anti-soborno", "Documentar la política de cero tolerancia al soborno conforme a Ley 2195/2022.", 30, "critica"),
      mk("PTEE", "Canal de denuncias anónimo", "Implementar canal para reportes de conductas contrarias a la ética empresarial.", 45, "alta"),
      mk("PTEE", "Debida diligencia de terceros (TPDD)", "Proceso de verificación de ética y reputación de socios, proveedores y agentes.", 60, "alta"),
      mk("PTEE", "Capacitación en ética empresarial", "Capacitación anual obligatoria sobre el PTEE a directivos y personal de riesgo.", 60, "media"),
      mk("PTEE", "Controles en contratación pública", "Procedimiento especial de debida diligencia para contratos con entidades públicas.", 45, "alta"),
    );
  }

  if (active.includes("CODIGO_SUSTANTIVO")) {
    tasks.push(
      mk("CODIGO_SUSTANTIVO", "Revisión de contratos laborales", "Verificar que todos los contratos de trabajo cumplan con el Código Sustantivo del Trabajo.", 30, "alta"),
      mk("CODIGO_SUSTANTIVO", "Pago correcto de prestaciones sociales", "Verificar liquidación y pago oportuno de cesantías, intereses, prima y vacaciones.", 30, "alta"),
      mk("CODIGO_SUSTANTIVO", "Reglamento Interno de Trabajo", "Elaborar, aprobar e implementar el Reglamento Interno de Trabajo según CST.", 60, "media"),
      mk("CODIGO_SUSTANTIVO", "Afiliación a seguridad social", "Verificar afiliación de todos los empleados a EPS, AFP y ARL.", 15, "critica"),
      mk("CODIGO_SUSTANTIVO", "Actualización salarial SMMLV", "Actualizar salarios al menos al mínimo legal vigente y documentar la revisión.", 365, "alta"),
      mk("CODIGO_SUSTANTIVO", "Nómina y liquidación correcta", "Auditar el proceso de liquidación de nómina mensual para verificar cumplimiento.", 30, "media"),
    );
  }

  if (active.includes("RETIE")) {
    tasks.push(
      mk("RETIE", "Certificado RETIE de instalaciones eléctricas", "Obtener certificación de conformidad RETIE para todas las instalaciones eléctricas del establecimiento.", 90, "critica"),
      mk("RETIE", "Inspección periódica de instalaciones", "Contratar inspector RETIE para revisión anual de instalaciones eléctricas.", 180, "alta"),
      mk("RETIE", "Actualización de planos eléctricos", "Mantener actualizados los planos as-built de las instalaciones eléctricas.", 120, "media"),
      mk("RETIE", "Capacitación al personal en seguridad eléctrica", "Capacitar al personal que opera equipos eléctricos.", 60, "media"),
    );
  }

  return tasks;
}
