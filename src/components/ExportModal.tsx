import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Printer, 
  ShieldCheck, 
  ShieldAlert, 
  Briefcase, 
  Code2, 
  Building2, 
  DollarSign, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  History,
  FileCheck
} from 'lucide-react';
import { Defect, EnterpriseReportType, TestRunCycle } from '../types/qa';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  passedCount: number;
  totalCount: number;
  defects: Defect[];
  fixedDefectIds: number[];
  historyCycles: TestRunCycle[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  passedCount,
  totalCount,
  defects,
  fixedDefectIds,
  historyCycles,
}) => {
  const [reportCase, setReportCase] = useState<EnterpriseReportType>('executive');
  const [viewMode, setViewMode] = useState<'document' | 'markdown' | 'json'>('document');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const passRate = Math.round((passedCount / totalCount) * 100);
  const unresolvedBlockers = defects.filter(
    (d) => d.blocksLaunch && !fixedDefectIds.includes(d.id)
  );
  const isApproved = passRate >= 90 && unresolvedBlockers.length === 0;

  // Generate Markdown for Case 1: Executive
  const executiveMarkdown = `# INFORME EJECUTIVO DE GOBERNANZA DE CALIDAD Y RIESGOS DE NEGOCIO
**Código Documental:** DOC-QA-2026-B2C-084 · Clasificación: CONFIDENCIAL / USO INTERNO
**Fecha de Emisión:** 1 de Octubre de 2026 · 17:15 UTC-7
**Destinatarios:** Dirección Ejecutiva (C-Level), Vicepresidencia de Finanzas, Dirección de Producto B2C
**Proyecto:** Plataforma Web E-commerce B2C · Release Candidate v1.0.0-rc.3
**Entorno Auditado:** QA / Staging Pre-Producción

---

## 1. DICTAMEN OFICIAL DE SALIDA A PRODUCCIÓN (RELEASE GATE)
**RESOLUCIÓN FINAL:** ${isApproved ? '🟢 APROBADO PARA LANZAMIENTO (GO)' : '🔴 NO APROBADO PARA LANZAMIENTO (NO-GO)'}
* **Tasa de Aprobación Global:** ${passRate}% (${passedCount} de ${totalCount} casos de negocio superados)
* **Umbral Mínimo Requerido por Política Corporativa:** 90.0%
* **Defectos Críticos Bloqueantes Activos:** ${unresolvedBlockers.length} de 3 detectados
* **Conclusión de Riesgo:** ${
    isApproved
      ? 'La plataforma satisface los criterios corporativos de protección financiera y seguridad de credenciales.'
      : 'El sistema presenta un riesgo financiero y reputacional inaceptable. Queda estrictamente bloqueado el paso a producción.'
  }

---

## 2. EVALUACIÓN DE IMPACTO FINANCIERO, LEGAL Y OPERATIVO

### A. Riesgo Financiero por Inconsistencia de Precios (Defecto #1 - Crítico)
* **Descripción en lenguaje de negocio:** Al cambiar las cantidades en el carrito, el total visible al cliente se congela y no se recalcula.
* **Exposición económica:** Estimada en ~$35,000 USD/mes por cobros incorrectos, contracargos bancarios (chargebacks) y penalizaciones de la pasarela de pagos.
* **Consecuencia de mercado:** Pérdida inmediata de margen operativo o desconfianza por cobro dispar entre vista y tarjeta.

### B. Riesgo de Seguridad y Cumplimiento Regulatorio (Defecto #2 - Alto)
* **Descripción en lenguaje de negocio:** El sistema permite el acceso de cualquier persona aun ingresando una contraseña errónea (Bypass de autenticación).
* **Exposición legal y normativa:** Violación flagrante de normas de protección de datos personales y estándares PCI-DSS. Exposición a multas regulatorias de hasta $250,000 USD y riesgo masivo de Account Takeover (robo de cuentas con tarjetas guardadas).

### C. Riesgo de Conversión y Abandono de Compra (Defecto #3 - Alto)
* **Descripción en lenguaje de negocio:** Al recargar la página (F5), se duplican automáticamente los productos en la cesta del usuario.
* **Impacto en métricas:** Incremento proyectado del 28% en la tasa de abandono de checkout; sensación de estafa o plataforma rota.

---

## 3. SEGUIMIENTO DE REQUISITOS OBLIGATORIOS PARA EL CHECKPOINT
1. [${fixedDefectIds.includes(2) ? 'X' : ' '}] Bloqueo total de accesos no autorizados: Rechazo del 100% de contraseñas erróneas.
2. [${fixedDefectIds.includes(1) ? 'X' : ' '}] Garantía de consistencia contable: Recálculo atómico en vivo del total del carrito.
3. [${fixedDefectIds.includes(3) ? 'X' : ' '}] Integridad de pedido: Bloqueo de duplicidad de ítems en eventos de recarga de página.

---

## 4. FIRMAS EJECUTIVAS DE CONFORMIDAD
* **Ing. Lina Cardozo** · Lead QA Engineer & Quality Assurance Director
* **Ing. Roberto Sánchez** · Chief Technology Officer (CTO)
* **Lic. Sofía Morales** · Product & Commercial Director B2C
`;

  // Generate Markdown for Case 2: Technical
  const technicalMarkdown = `# INFORME TÉCNICO-OPERATIVO DE ASEGURAMIENTO DE CALIDAD (QA & DEVOPS)
**Código Documental:** TECH-QA-2026-B2C-084 · Release Candidate v1.0.0-rc.3
**Fecha:** 1 de Octubre de 2026 · Target: Entorno QA / Staging
**Destinatarios:** Tech Leads, Arquitectura de Software, Equipo de Ingeniería Frontend/Backend y SecOps

---

## 1. RESUMEN DE EJECUCIÓN DE PRUEBAS
* **Tasa de Cobertura de Aprobación:** ${passRate}% (${passedCount}/${totalCount} TCs exitosos)
* **Casos Ejecutados:** 35 | Pass: ${passedCount} | Fail: ${totalCount - passedCount}
* **Tiempo Total de Ejecución de Suite:** 38 minutos | Latencia Media por TC: 194ms
* **Módulos Auditados:** Carrito (8), Autenticación (6), Catálogo (7), Checkout (7), Envíos (7)

---

## 2. ANÁLISIS DE CAUSA RAÍZ (RCA) Y PLAN DE REMEDIACIÓN

${defects
  .map(
    (d) => `### Defecto #${d.id} [${d.severity.toUpperCase()}]: ${d.title}
* **Test Case Asociado:** ${d.testCaseId} (${d.moduleLabel})
* **Archivo Afectado:** \`${d.fileAffected}\`
* **Responsable Asignado:** ${d.assignedTo} (${d.assignedRole})
* **SLA de Resolución:** ${d.slaTarget}
* **Análisis de Causa Raíz (RCA):** ${d.rootCauseAnalysis}
* **Acción Correctiva:** ${d.correctiveAction}
* **Estado en Checkpoint:** ${fixedDefectIds.includes(d.id) ? 'SUBSANADO (PARCHEADO)' : 'ACTIVO / PENDIENTE'}
\`\`\`typescript
// Parche propuesto:
${d.codeSnippetFix}
\`\`\``
  )
  .join('\n\n')}

---

## 3. HISTORIAL DE CICLOS DE REGRESIÓN
${historyCycles
  .map(
    (c) =>
      `* **Ciclo 0${c.cycleNumber} (${c.date}):** ${c.buildTag} · Pass Rate: ${c.passRate}% (${c.passedCount}/${c.totalTests}) · Dictamen: ${c.verdict}`
  )
  .join('\n')}

---

## 4. CHECKLIST DE LIBERACIÓN TÉCNICA
* [${fixedDefectIds.includes(1) ? 'X' : ' '}] TC-CRT-002: Re-render reactivo en useCartStore validado.
* [${fixedDefectIds.includes(2) ? 'X' : ' '}] TC-AUTH-002: Comparación estricta de hash bcrypt sin bypass de entorno.
* [${fixedDefectIds.includes(3) ? 'X' : ' '}] TC-CRT-003: Implementación del patrón Post/Redirect/Get (PRG) e idempotencia de SKU.
`;

  const jsonContent = JSON.stringify(
    {
      reportMetadata: {
        documentCode: reportCase === 'executive' ? 'DOC-QA-2026-B2C-084' : 'TECH-QA-2026-B2C-084',
        reportType: reportCase,
        classification: 'CONFIDENTIAL',
        timestamp: '2026-10-01T17:15:00-07:00',
        environment: 'QA / Staging',
        buildTag: 'v1.0.0-rc.3',
      },
      auditSummary: {
        verdict: isApproved ? 'APPROVED_GO' : 'REJECTED_NO_GO',
        passRate: passRate,
        passedTests: passedCount,
        totalTests: totalCount,
        unresolvedBlockersCount: unresolvedBlockers.length,
      },
      riskEvaluation: {
        financialRiskMonthlyEstimate: '$35,000 USD (Price desync)',
        securityRegulatoryExposure: '$250,000 USD (Auth bypass / Account Takeover)',
        conversionFrictionRate: '+28% cart abandonment (Duplicate items on reload)',
      },
      defectsList: defects.map((d) => ({
        id: d.id,
        title: d.title,
        severity: d.severity,
        blocksLaunch: d.blocksLaunch,
        status: fixedDefectIds.includes(d.id) ? 'resolved' : d.status,
        assignedTo: d.assignedTo,
        sla: d.slaTarget,
        fileAffected: d.fileAffected,
      })),
      testExecutionHistory: historyCycles,
    },
    null,
    2
  );

  const activeMarkdown = reportCase === 'executive' ? executiveMarkdown : technicalMarkdown;

  const handleCopy = () => {
    const textToCopy = viewMode === 'json' ? jsonContent : activeMarkdown;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const isJson = viewMode === 'json';
    const filename = `informe_${reportCase}_${isApproved ? 'aprobado' : 'bloqueado'}.${isJson ? 'json' : 'md'}`;
    const blob = new Blob([isJson ? jsonContent : activeMarkdown], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in duration-200">
        {/* Top Corporate Modal Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Centro de Emisión de Informes de Calidad Corporativos
                </h3>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                  DOC-QA-2026-B2C-084
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Selecciona el caso de reporte según la audiencia destinataria (Ejecutivo / Técnico)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Case Selector Bar (2 distinct corporate profiles) */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              Caso de Informe:
            </span>
            <div className="flex items-center p-0.5 bg-slate-200/70 rounded-lg">
              <button
                onClick={() => setReportCase('executive')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                  reportCase === 'executive'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>Caso 1: Ejecutivo & Negocio (C-Level)</span>
              </button>
              <button
                onClick={() => setReportCase('technical')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                  reportCase === 'technical'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Caso 2: Técnico & Ingeniería (DevOps / QA)</span>
              </button>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 bg-slate-200/70 rounded-lg">
              <button
                onClick={() => setViewMode('document')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  viewMode === 'document' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Vista Formal A4
              </button>
              <button
                onClick={() => setViewMode('markdown')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  viewMode === 'markdown' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Markdown
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  viewMode === 'json' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                JSON
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-md border border-slate-300"
              title="Imprimir documento oficial"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-slate-700 hover:bg-slate-200 rounded-md border border-slate-300 font-medium flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body / Report Display */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
          {viewMode === 'document' ? (
            /* Corporate Printable Page Layout */
            <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-xl border border-slate-300 shadow-md space-y-8 text-slate-900 print:shadow-none print:border-none print:p-0">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-slate-900">
                      RETAILTECH ENTERPRISE
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-300">
                      QA DIVISION
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {reportCase === 'executive'
                      ? 'INFORME EJECUTIVO DE GOBERNANZA DE CALIDAD Y RIESGOS DE NEGOCIO'
                      : 'INFORME TÉCNICO-OPERATIVO DE ASEGURAMIENTO DE CALIDAD & REMEDIACIÓN'}
                  </h1>
                  <p className="text-xs text-slate-500">
                    Aplicación Web E-commerce B2C · Release Candidate v1.0.0-rc.3
                  </p>
                </div>

                <div className="shrink-0 text-left sm:text-right font-mono text-xs text-slate-600 space-y-0.5">
                  <div className="font-bold text-slate-900">CÓDIGO: DOC-QA-2026-B2C-084</div>
                  <div>FECHA: 01-OCT-2026</div>
                  <div>CLASIFICACIÓN: CONFIDENCIAL</div>
                  <div className="text-[11px] text-amber-700 font-bold">USO INTERNO / STAGING</div>
                </div>
              </div>

              {/* Dictamen Box */}
              <div
                className={`p-6 rounded-xl border-2 space-y-2 ${
                  isApproved
                    ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-500 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isApproved ? (
                      <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-6 h-6 text-rose-600" />
                    )}
                    <span className="text-base sm:text-lg font-black tracking-tight">
                      DICTAMEN OFICIAL: {isApproved ? '🟢 APROBADO (RELEASE GO)' : '🔴 NO APROBADO (RELEASE NO-GO)'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-white border border-current">
                    TASA: {passRate}% (UMBRAL: &ge;90%)
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {isApproved
                    ? 'Se autoriza formalmente el despliegue del Release Candidate v1.0.0-rc.3 al entorno de Producción tras solventar los 3 defectos bloqueantes de carrito y seguridad.'
                    : 'Queda estrictamente BLOQUEADO el despliegue a producción. La tasa del 83% no cumple el estándar institucional y se registran 3 defectos de severidad Crítica/Alta que amenazan la facturación y la integridad de los usuarios.'}
                </p>
              </div>

              {/* CASE 1: EXECUTIVE VIEW SPECIFIC SECTION */}
              {reportCase === 'executive' && (
                <div className="space-y-6">
                  {/* Financial & Security Risk Summary for Executives */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>Cuantificación de Impacto Financiero y Riesgos Legales</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-slate-500 font-bold block text-[11px]">
                          Pérdida en Facturación
                        </span>
                        <div className="text-base font-extrabold text-rose-700">
                          ~$35,000 USD / mes
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          Diferencial no cobrado por fallo en recálculo dinámico en el carrito (#1).
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-slate-500 font-bold block text-[11px]">
                          Exposición Legal / ATO
                        </span>
                        <div className="text-base font-extrabold text-amber-700">
                          Riesgo Crítico PCI-DSS
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          Bypass de login permite Account Takeover y robo de datos personales (#2).
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-slate-500 font-bold block text-[11px]">
                          Fricción en Conversión
                        </span>
                        <div className="text-base font-extrabold text-slate-900">
                          +28% Abandono
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          Inflación artificial de cesta por duplicación involuntaria en F5 (#3).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Clean Non-Technical Table of Remediation */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                      Plan de Acción y Requisitos para el Próximo Checkpoint
                    </h3>
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Requisito Obligatorio</th>
                            <th className="py-2.5 px-3">Severidad</th>
                            <th className="py-2.5 px-3">Responsable</th>
                            <th className="py-2.5 px-3 text-right">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">
                              Garantizar recálculo dinámico y cobro exacto en carrito
                            </td>
                            <td className="py-3 px-3 text-rose-700 font-bold">Crítica</td>
                            <td className="py-3 px-3">Carlos Méndez (Frontend)</td>
                            <td className="py-3 px-3 text-right">
                              {fixedDefectIds.includes(1) ? (
                                <span className="text-emerald-700 font-bold">Subsanado</span>
                              ) : (
                                <span className="text-rose-700 font-bold">Pendiente</span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">
                              Rechazo estricto del 100% de contraseñas erróneas en login
                            </td>
                            <td className="py-3 px-3 text-amber-700 font-bold">Alta</td>
                            <td className="py-3 px-3">Andrés Vidal (SecOps)</td>
                            <td className="py-3 px-3 text-right">
                              {fixedDefectIds.includes(2) ? (
                                <span className="text-emerald-700 font-bold">Subsanado</span>
                              ) : (
                                <span className="text-rose-700 font-bold">Pendiente</span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">
                              Bloqueo de duplicación de productos ante recargas de página
                            </td>
                            <td className="py-3 px-3 text-amber-700 font-bold">Alta</td>
                            <td className="py-3 px-3">Valeria Orozco (Full Stack)</td>
                            <td className="py-3 px-3 text-right">
                              {fixedDefectIds.includes(3) ? (
                                <span className="text-emerald-700 font-bold">Subsanado</span>
                              ) : (
                                <span className="text-rose-700 font-bold">Pendiente</span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE 2: TECHNICAL VIEW SPECIFIC SECTION */}
              {reportCase === 'technical' && (
                <div className="space-y-6">
                  {/* Detailed Test Suite Breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                      Desglose de Cobertura de la Suite de Pruebas (35 Casos)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center font-mono">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-slate-500 font-sans text-[11px]">Carrito</div>
                        <div className="text-sm font-bold text-rose-700">4 / 8 Fail</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-slate-500 font-sans text-[11px]">Auth</div>
                        <div className="text-sm font-bold text-amber-700">2 / 6 Fail</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-slate-500 font-sans text-[11px]">Catálogo</div>
                        <div className="text-sm font-bold text-emerald-700">7 / 7 Pass</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-slate-500 font-sans text-[11px]">Checkout</div>
                        <div className="text-sm font-bold text-emerald-700">7 / 7 Pass</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-slate-500 font-sans text-[11px]">Envíos</div>
                        <div className="text-sm font-bold text-emerald-700">7 / 7 Pass</div>
                      </div>
                    </div>
                  </div>

                  {/* Technical RCA & Affected Files */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                      Fichas de Causa Raíz (RCA) y Parches de Código
                    </h3>
                    <div className="space-y-3 text-xs">
                      {defects.slice(0, 3).map((d) => (
                        <div key={d.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">
                              #{d.id}. {d.title}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {d.fileAffected}
                            </span>
                          </div>
                          <p className="text-slate-700">
                            <strong>RCA:</strong> {d.rootCauseAnalysis}
                          </p>
                          <div className="font-mono text-[11px] bg-slate-950 text-slate-200 p-2.5 rounded-lg overflow-x-auto whitespace-pre">
                            {d.codeSnippetFix}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Historical regression summary */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                      Trazabilidad Cronológica de Ciclos
                    </h3>
                    <div className="text-xs text-slate-600 font-mono space-y-1">
                      {historyCycles.map((c) => (
                        <div key={c.id} className="flex justify-between py-1 border-b border-slate-100">
                          <span>{c.date} · {c.buildTag}</span>
                          <span className="font-bold">{c.passRate}% ({c.verdict})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Formal Executive Sign-off Block */}
              <div className="pt-8 border-t-2 border-slate-900 space-y-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Acta Formal de Firmas & Conformidad de Liberación
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-800">
                  <div className="border border-slate-200 p-4 rounded-xl space-y-4 bg-slate-50/50">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">Ing. Lina Cardozo</div>
                      <div className="text-[11px] text-slate-500">Lead QA Engineer</div>
                    </div>
                    <div className="pt-4 border-t border-dashed border-slate-300 font-mono text-[10px] text-slate-600">
                      {isApproved ? 'FIRMADO: 01-OCT-2026' : 'FIRMA RETENIDA (NO-GO)'}
                    </div>
                  </div>

                  <div className="border border-slate-200 p-4 rounded-xl space-y-4 bg-slate-50/50">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">Ing. Roberto Sánchez</div>
                      <div className="text-[11px] text-slate-500">Chief Technology Officer (CTO)</div>
                    </div>
                    <div className="pt-4 border-t border-dashed border-slate-300 font-mono text-[10px] text-slate-600">
                      {isApproved ? 'AUTORIZADO: 01-OCT-2026' : 'DESPLIEGUE DENEGADO'}
                    </div>
                  </div>

                  <div className="border border-slate-200 p-4 rounded-xl space-y-4 bg-slate-50/50">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">Lic. Sofía Morales</div>
                      <div className="text-[11px] text-slate-500">Product Manager B2C</div>
                    </div>
                    <div className="pt-4 border-t border-dashed border-slate-300 font-mono text-[10px] text-slate-600">
                      {isApproved ? 'APROBADO: 01-OCT-2026' : 'CONVERSIÓN EN RIESGO'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : viewMode === 'markdown' ? (
            <div className="max-w-3xl mx-auto p-5 bg-slate-950 font-mono text-xs text-slate-200 rounded-xl whitespace-pre overflow-x-auto leading-relaxed selection:bg-slate-800">
              {activeMarkdown}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-5 bg-slate-950 font-mono text-xs text-slate-200 rounded-xl whitespace-pre overflow-x-auto leading-relaxed selection:bg-slate-800">
              {jsonContent}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            {isApproved ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Informe Aprobatorio (Listo para salida a producción)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-700 font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Informe de Bloqueo (Requiere solventar 3 defectos críticos)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar como PDF</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar ({viewMode === 'json' ? 'JSON' : 'Markdown'})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
