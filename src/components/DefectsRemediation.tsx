import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Wrench, 
  Code, 
  ArrowRight, 
  DollarSign, 
  Shield, 
  Copy, 
  Check, 
  FileCode,
  FlaskConical,
  ExternalLink
} from 'lucide-react';
import { Defect } from '../types/qa';

interface DefectsRemediationProps {
  defects: Defect[];
  fixedDefectIds: number[];
  selectedDefectId?: number;
  onToggleDefectFix: (defectId: number) => void;
  onNavigateToSandbox: (defectId?: number) => void;
}

export const DefectsRemediation: React.FC<DefectsRemediationProps> = ({
  defects,
  fixedDefectIds,
  selectedDefectId,
  onToggleDefectFix,
  onNavigateToSandbox,
}) => {
  const [activeDefectId, setActiveDefectId] = useState<number>(selectedDefectId || 1);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const activeDefect = defects.find((d) => d.id === activeDefectId) || defects[0];
  const isFixed = fixedDefectIds.includes(activeDefect.id);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span>Crítica (Bloqueante)</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            <span>Alta (Bloqueante)</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>Media (Post-Release)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span>Baja (Cosmético)</span>
          </span>
        );
    }
  };

  const getEffortBadge = (effort: 'S' | 'M' | 'L') => {
    const config = {
      S: { label: 'S (Pequeño · 1-2 días)', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
      M: { label: 'M (Medio · 3-5 días)', class: 'bg-amber-50 text-amber-800 border-amber-200' },
      L: { label: 'L (Grande · 1-2 semanas)', class: 'bg-purple-50 text-purple-800 border-purple-200' },
    }[effort];

    return (
      <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${config.class}`}>
        Esfuerzo: {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span>3. 🎯 Errores Prioritarios y Plan de Remediación</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Análisis técnico de causa raíz (RCA), impacto financiero y soluciones de código recomendadas
        </p>
      </div>

      {/* Priority Summary Table as requested */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Matriz de Defectos y Asignación de Recursos
          </span>
          <span className="text-xs text-slate-500">
            6 Defectos documentados
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 text-center w-12">#</th>
                <th className="py-2.5 px-3">Defecto Detectado</th>
                <th className="py-2.5 px-3">Severidad</th>
                <th className="py-2.5 px-4">Impacto al Usuario / Negocio</th>
                <th className="py-2.5 px-4">Acción Correctiva Concreta</th>
                <th className="py-2.5 px-3 text-center">Esfuerzo</th>
                <th className="py-2.5 px-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {defects.map((d) => {
                const fixed = fixedDefectIds.includes(d.id);
                const isSelected = activeDefectId === d.id;
                return (
                  <tr
                    key={d.id}
                    onClick={() => setActiveDefectId(d.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 font-medium'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                      {d.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{d.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {d.testCaseId} · {d.moduleLabel}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getSeverityBadge(d.severity)}
                    </td>
                    <td className="py-3 px-4 max-w-xs text-slate-600 leading-snug">
                      {d.impact}
                    </td>
                    <td className="py-3 px-4 max-w-xs text-slate-600 leading-snug">
                      {d.correctiveAction}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {d.effort}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {fixed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Remediado</span>
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[11px] ${
                            d.blocksLaunch
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {d.blocksLaunch ? 'Bloqueante' : 'Pendiente'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Defect Detail & Code Fix Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header of Active Defect */}
        <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-xs">
                Defecto #{activeDefect.id}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300 font-mono">
                {activeDefect.testCaseId}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300">
                {activeDefect.moduleLabel}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {activeDefect.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleDefectFix(activeDefect.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
                isFixed
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{isFixed ? 'Parche Aplicado (Activo)' : 'Aplicar Parche'}</span>
            </button>

            <button
              onClick={() => onNavigateToSandbox(activeDefect.id)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Probar en Sandbox</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Severidad y Política de Release
              </span>
              <div>{getSeverityBadge(activeDefect.severity)}</div>
              <p className="text-xs text-slate-600 mt-1">
                {activeDefect.blocksLaunch
                  ? 'Impide el lanzamiento a producción de forma obligatoria.'
                  : 'Aceptable para mantenimiento en versión 1.0.1.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Esfuerzo y Complejidad Técnica
              </span>
              <div>{getEffortBadge(activeDefect.effort)}</div>
              <p className="text-xs text-slate-600 mt-1">
                Estimación de ingeniería para codificación, pruebas unitarias y regresión.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Archivo / Módulo Afectado
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
                <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{activeDefect.fileAffected}</span>
              </div>
            </div>
          </div>

          {/* Impact and RCA Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Impacto Crítico al Usuario y Negocio</span>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {activeDefect.impact}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-rose-100">
                <strong>Consecuencia operativa:</strong> {activeDefect.userConsequence}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>Análisis de Causa Raíz (RCA)</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {activeDefect.rootCauseAnalysis}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-blue-100">
                <strong>Acción correctiva:</strong> {activeDefect.correctiveAction}
              </p>
            </div>
          </div>

          {/* Interactive Code Diff: Buggy Code vs Production Fix Code */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Comparativa de Código Fuente (Diff de Implementación)
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                TypeScript / React State & Handlers
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Bug Code */}
              <div className="rounded-xl border border-rose-200 overflow-hidden bg-slate-950 text-slate-100 font-mono text-xs">
                <div className="px-4 py-2 bg-rose-950/80 border-b border-rose-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-rose-300 font-medium text-[11px]">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Código Actual con Defecto (QA Staging)</span>
                  </div>
                  <button
                    onClick={() => handleCopy(activeDefect.codeSnippetBug, `bug-${activeDefect.id}`)}
                    className="p-1 hover:bg-rose-900/50 rounded text-slate-400 hover:text-white"
                    title="Copiar código"
                  >
                    {copiedCodeId === `bug-${activeDefect.id}` ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="p-4 overflow-x-auto text-[11px] leading-relaxed text-rose-200/90 whitespace-pre">
                  {activeDefect.codeSnippetBug}
                </div>
              </div>

              {/* Fix Code */}
              <div className="rounded-xl border border-emerald-200 overflow-hidden bg-slate-950 text-slate-100 font-mono text-xs">
                <div className="px-4 py-2 bg-emerald-950/80 border-b border-emerald-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Parche de Remediación Propuesto (Producción)</span>
                  </div>
                  <button
                    onClick={() => handleCopy(activeDefect.codeSnippetFix, `fix-${activeDefect.id}`)}
                    className="p-1 hover:bg-emerald-900/50 rounded text-slate-400 hover:text-white"
                    title="Copiar código"
                  >
                    {copiedCodeId === `fix-${activeDefect.id}` ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="p-4 overflow-x-auto text-[11px] leading-relaxed text-emerald-200/90 whitespace-pre">
                  {activeDefect.codeSnippetFix}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
