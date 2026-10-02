import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  FileCheck, 
  Award, 
  Printer, 
  Download, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CHECKPOINT_CRITERIA_LIST } from '../data/auditData';
import { Defect } from '../types/qa';

interface CheckpointSimulatorProps {
  defects: Defect[];
  fixedDefectIds: number[];
  onToggleDefectFix: (defectId: number) => void;
  onApplyAllMandatory: () => void;
  onApplyAllDefects: () => void;
  onResetAll: () => void;
  onExport: () => void;
}

export const CheckpointSimulator: React.FC<CheckpointSimulatorProps> = ({
  defects,
  fixedDefectIds,
  onToggleDefectFix,
  onApplyAllMandatory,
  onApplyAllDefects,
  onResetAll,
  onExport,
}) => {
  const totalTests = 35;
  const initialPassedTests = 29;
  const currentPassedTests = initialPassedTests + fixedDefectIds.length;
  const projectedRate = Math.round((currentPassedTests / totalTests) * 100);

  // Mandatory criteria check
  const mandatoryFixedCount = CHECKPOINT_CRITERIA_LIST.filter((c) =>
    fixedDefectIds.includes(c.defectId)
  ).length;
  const allMandatoryMet = mandatoryFixedCount === CHECKPOINT_CRITERIA_LIST.length;

  const unresolvedBlockers = defects.filter(
    (d) => d.blocksLaunch && !fixedDefectIds.includes(d.id)
  );

  const isApproved = projectedRate >= 90 && unresolvedBlockers.length === 0 && allMandatoryMet;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span>5. 🎯 Simulador de Checkpoint & Dictamen de Lanzamiento</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Proyección matemática de la tasa de aprobación y validación de criterios obligatorios de salida (Release Gate)
        </p>
      </div>

      {/* Hero Decision Banner */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isApproved
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isApproved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {isApproved ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>DICTAMEN: 🟢 APROBADO PARA LANZAMIENTO</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>DICTAMEN: 🔴 NO APROBADO (BLOQUEADO)</span>
                  </>
                )}
              </span>
              <span className="text-xs text-slate-600 font-mono">
                UMBRAL MÍNIMO: 90% Y 0 BLOQUEADORES
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {isApproved
                ? '¡Objetivo de Calidad Alcanzado! Listo para Despliegue'
                : 'Lanzamiento Detenido: Criterios Obligatorios Pendientes'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed">
              {isApproved ? (
                <span>
                  Con la remediación simulada, la tasa de aprobación asciende a{' '}
                  <strong className="text-emerald-900 font-bold tabular-nums">
                    {projectedRate}% ({currentPassedTests}/{totalTests} casos exitosos)
                  </strong>{' '}
                  y se han resuelto los 3 defectos críticos/altos. El sistema satisface los requerimientos de integridad financiera y seguridad.
                </span>
              ) : (
                <span>
                  El sistema se encuentra en <strong className="tabular-nums font-bold text-rose-900">{projectedRate}%</strong>{' '}
                  ({currentPassedTests}/{totalTests} casos exitosos). Restan{' '}
                  <strong className="text-rose-900 font-bold">
                    {unresolvedBlockers.length} bloqueador(es) obligatorio(s)
                  </strong>{' '}
                  por solventar antes de autorizar el pase a producción.
                </span>
              )}
            </p>
          </div>

          {/* Quick Simulation Batch Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            <button
              onClick={onApplyAllMandatory}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simular 3 Requisitos Críticos</span>
            </button>
            <button
              onClick={onApplyAllDefects}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl transition-colors"
            >
              Resolver Todos (100%)
            </button>
            <button
              onClick={onResetAll}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Resetear QA
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Mathematical Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-medium text-slate-500 block">
            Tasa de Aprobación Proyectada
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold tabular-nums ${
                projectedRate >= 90 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {projectedRate}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({currentPassedTests} de {totalTests} casos)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                projectedRate >= 90 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${projectedRate}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            Línea base original: 82.9% (29/35)
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-medium text-slate-500 block">
            Requisitos de Checkpoint Obligatorios
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold tabular-nums ${
                allMandatoryMet ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {mandatoryFixedCount} / 3
            </span>
            <span className="text-xs text-slate-500 font-medium">
              resueltos
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                allMandatoryMet ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${(mandatoryFixedCount / 3) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            {allMandatoryMet
              ? '✅ 100% de criterios obligatorios cumplidos'
              : `⚠️ Faltan ${3 - mandatoryFixedCount} criterio(s) por auditar`}
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-medium text-slate-500 block">
            Bloqueadores Activos
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold tabular-nums ${
                unresolvedBlockers.length === 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {unresolvedBlockers.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              bloqueador(es)
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-tight pt-1">
            {unresolvedBlockers.length === 0
              ? 'Sin impedimentos técnicos críticos para el despliegue.'
              : 'Imposible autorizar despliegue con bloqueadores activos.'}
          </p>
        </div>
      </div>

      {/* Interactive Checklist: 3 Mandatory Requisites + 3 Maintenance */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-slate-700" />
              <span>Lista de Comprobación Interactiva (Checkpoint Checklist)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Marca o desmarca cada ítem para simular el impacto en la aprobación de calidad
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {fixedDefectIds.length} de 6 Parches aplicados
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Section A: 3 Mandatory Checkpoint Requisites */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              <span>Requisitos Obligatorios para el Próximo Checkpoint (Bloquean Lanzamiento)</span>
            </div>

            <div className="space-y-2.5">
              {CHECKPOINT_CRITERIA_LIST.map((criteria, index) => {
                const isFixed = fixedDefectIds.includes(criteria.defectId);
                const defect = defects.find((d) => d.id === criteria.defectId);

                return (
                  <div
                    key={criteria.id}
                    onClick={() => onToggleDefectFix(criteria.defectId)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isFixed
                        ? 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isFixed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isFixed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            Requisito {index + 1}: {criteria.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            Defecto #{criteria.defectId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {defect?.correctiveAction}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {isFixed ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                          Cumplido
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded">
                          Pendiente
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: 3 Maintenance Post-Launch Defects */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Defectos de Mantenimiento Post-Lanzamiento (Sprint v1.0.1)</span>
            </div>

            <div className="space-y-2.5">
              {defects
                .filter((d) => !d.blocksLaunch)
                .map((defect) => {
                  const isFixed = fixedDefectIds.includes(defect.id);

                  return (
                    <div
                      key={defect.id}
                      onClick={() => onToggleDefectFix(defect.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isFixed
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isFixed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isFixed && <CheckCircle2 className="w-3 h-3" />}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-800">
                              #{defect.id}. {defect.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (Severidad: {defect.severity})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {defect.correctiveAction}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {isFixed ? (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Resuelto
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            Post-Release
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Official Sign-Off Release Certificate Preview */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Certificado Oficial de Aprobación de Salida (Release Sign-Off)
              </h3>
              <span className="text-xs text-slate-400">
                Release Candidate: v1.0.0-rc3 · Entorno: QA / Staging
              </span>
            </div>
          </div>

          <button
            onClick={onExport}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Informe y Firma</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Lead QA Engineer
            </span>
            <div className="font-semibold text-white">Ing. Lina Cardozo</div>
            <div className="text-[11px] text-slate-400">Auditoría de Calidad & Pruebas</div>
            <div className="pt-2 text-emerald-400 font-mono text-[10px]">
              {isApproved ? 'VERIFICADO & FIRMADO' : 'FIRMA RETENIDA (NO-GO)'}
            </div>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Director de Ingeniería / CTO
            </span>
            <div className="font-semibold text-white">Ing. Roberto Sánchez</div>
            <div className="text-[11px] text-slate-400">Arquitectura & Seguridad Cloud</div>
            <div className="pt-2 text-emerald-400 font-mono text-[10px]">
              {isApproved ? 'AUTORIZADO PARA PRODUCCIÓN' : 'DESPLIEGUE DENEGADO'}
            </div>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Product Manager B2C
            </span>
            <div className="font-semibold text-white">Lic. Sofía Morales</div>
            <div className="text-[11px] text-slate-400">Conversión & Experiencia Checkout</div>
            <div className="pt-2 text-emerald-400 font-mono text-[10px]">
              {isApproved ? 'CONVERSIÓN VALIDADA' : 'CONVERSIÓN EN RIESGO'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
