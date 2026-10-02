import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShoppingCart, 
  Lock, 
  RefreshCw, 
  Clock, 
  Languages, 
  Layout, 
  ArrowRight,
  TrendingUp,
  Percent,
  Layers,
  FileCheck
} from 'lucide-react';
import { Defect } from '../types/qa';

interface ExecutiveSummaryProps {
  defects: Defect[];
  fixedDefectIds: number[];
  onNavigateToTab: (tab: string) => void;
  onOpenDefectDetail: (defectId: number) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  defects,
  fixedDefectIds,
  onNavigateToTab,
  onOpenDefectDetail,
}) => {
  const totalTests = 35;
  const initialPassed = 29;
  const currentPassed = initialPassed + fixedDefectIds.length;
  const passRate = Math.round((currentPassed / totalTests) * 100);

  // Check which blocking defects are still unresolved
  const unresolvedBlockingBugs = defects.filter(
    (d) => d.blocksLaunch && !fixedDefectIds.includes(d.id)
  );
  const isApproved = passRate >= 90 && unresolvedBlockingBugs.length === 0;

  const severityCounts = {
    critical: defects.filter((d) => d.severity === 'critical').length,
    high: defects.filter((d) => d.severity === 'high').length,
    medium: defects.filter((d) => d.severity === 'medium').length,
    low: defects.filter((d) => d.severity === 'low').length,
  };

  const getDefectIcon = (id: number) => {
    switch (id) {
      case 1:
        return <ShoppingCart className="w-4 h-4 text-rose-600" />;
      case 2:
        return <Lock className="w-4 h-4 text-rose-600" />;
      case 3:
        return <RefreshCw className="w-4 h-4 text-amber-600" />;
      case 4:
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 5:
        return <Languages className="w-4 h-4 text-slate-600" />;
      case 6:
        return <Layout className="w-4 h-4 text-slate-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Hero Banner: Verdict & Gate Decision */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isApproved
            ? 'bg-emerald-50/70 border-emerald-200'
            : 'bg-rose-50/70 border-rose-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isApproved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {isApproved ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Lanzamiento Aprobado (GO)</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Lanzamiento No Aprobado (NO-GO)</span>
                  </>
                )}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Entorno: QA / Staging · Target: B2C E-commerce
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {isApproved
                ? 'Requisitos de Calidad Cumplidos para Producción'
                : '1. Resumen Ejecutivo: Bloqueo de Despliegue a Producción'}
            </h1>

            <p className="text-sm text-slate-700 max-w-3xl leading-relaxed">
              {isApproved ? (
                <span>
                  Se han subsanado los defectos bloqueantes y la tasa de aprobación alcanza{' '}
                  <strong className="text-emerald-900 font-semibold">{passRate}%</strong>{' '}
                  (superando el umbral mínimo del 90%). La aplicación cumple los criterios de seguridad y consistencia financiera.
                </span>
              ) : (
                <span>
                  🔴 <strong className="font-semibold text-rose-900">NO APROBADO</strong>. 
                  Tasa de aprobación actual de <strong className="tabular-nums font-semibold text-slate-900">{passRate}%</strong>{' '}
                  ({currentPassed}/{totalTests} casos exitosos);{' '}
                  <strong className="font-semibold text-rose-900">3 errores críticos/altos impiden el lanzamiento</strong>. 
                  Se requiere remediar los 3 bloqueadores para alcanzar el checkpoint aprobatorio (&ge;90%).
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateToTab('sandbox')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Abrir Sandbox de Pruebas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateToTab('simulator')}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <span>Simular Checkpoint</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pass Rate */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Tasa de Aprobación</span>
            <Percent className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {passRate}%
            </span>
            <span className="text-xs text-slate-500 tabular-nums font-medium">
              ({currentPassed}/{totalTests} casos)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                passRate >= 90 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${passRate}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Meta de calidad: 90%</span>
            <span className={passRate >= 90 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
              {passRate >= 90 ? 'Cumple umbral' : `Faltan ${(90 - passRate).toFixed(0)}%`}
            </span>
          </div>
        </div>

        {/* Card 2: Bloqueadores de Lanzamiento */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Errores Bloqueantes</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-rose-600 tabular-nums">
              {unresolvedBlockingBugs.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              de 3 detectados
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-snug">
            {unresolvedBlockingBugs.length === 0 ? (
              <span className="text-emerald-700 font-medium">Todos los bloqueadores han sido resueltos.</span>
            ) : (
              <span>1 Crítico (Carrito) + 2 Altos (Auth y Recarga F5).</span>
            )}
          </p>
        </div>

        {/* Card 3: Concentración de Riesgo en Carrito */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Concentración en Carrito</span>
            <ShoppingCart className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-amber-600 tabular-nums">
              66.7%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              (4 de 6 defectos)
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-snug">
            Inestabilidad crítica en el túnel de conversión y checkout que impacta facturación.
          </p>
        </div>

        {/* Card 4: Defectos Post-Lanzamiento */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Mantenimiento Post-Release</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-800 tabular-nums">
              3
            </span>
            <span className="text-xs text-slate-500 font-medium">
              (1 Medio + 2 Bajos)
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-snug">
            No impiden la salida a producción; programados para Sprint de estabilización v1.0.1.
          </p>
        </div>
      </div>

      {/* 3. Análisis de Riesgos y Tabla de Severidades */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>2. ⚠️ Análisis de Riesgos</span>
            </h2>
            <p className="text-xs text-slate-500">
              Distribución de severidad y clasificación de impacto directo al negocio
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            TOTAL CASOS: 35 · DEFECTOS ACTIVOS: 6
          </div>
        </div>

        {/* Table representation according to prompt */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Severidad</th>
                  <th className="py-3 px-4 text-center">Cantidad</th>
                  <th className="py-3 px-4 text-center">% del total de errores</th>
                  <th className="py-3 px-4 text-center">¿Bloquea lanzamiento?</th>
                  <th className="py-3 px-4">Descripción de Riesgo Asociado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-rose-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                    <span>Crítico</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium tabular-nums">
                    {severityCounts.critical}
                  </td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums">16.7%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                      <XCircle className="w-3 h-3 text-rose-600" />
                      <span>Sí</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    Fallo en el recálculo dinámico del precio total al modificar cantidades en el carrito.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-amber-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>Alto</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium tabular-nums">
                    {severityCounts.high}
                  </td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums">33.3%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                      <XCircle className="w-3 h-3 text-rose-600" />
                      <span>Sí</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    Bypass de seguridad en autenticación (permite ingreso erróneo) y duplicidad de productos en recarga F5.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-blue-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    <span>Medio</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium tabular-nums">
                    {severityCounts.medium}
                  </td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums">16.7%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>No</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    Lentitud de 3.5 segundos al pulsar el botón eliminar ítems sin retroalimentación visual.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-slate-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                    <span>Bajo</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium tabular-nums">
                    {severityCounts.low}
                  </td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums">33.3%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>No</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    Error de idioma en formulario de login (textos en inglés) y desalineación gráfica en resumen de carrito.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Callout box on Risk Pattern */}
        <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Patrón de riesgo crítico:</span>
            <p className="leading-relaxed">
              El <strong>66.6% de los defectos (4 de 6)</strong> se concentran en el módulo <strong>"Carrito de compras"</strong>, 
              evidenciando inestabilidad severa en el flujo principal de conversión (checkout) que impacta directamente en la facturación y la confianza del consumidor.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Errores que Bloquean vs Errores de Mantenimiento Post-Lanzamiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Col 1: Bloqueadores */}
        <div className="p-5 bg-white rounded-xl border border-rose-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Errores que Bloquean el Lanzamiento (3)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              Prioridad Crítica
            </span>
          </div>

          <div className="space-y-3">
            {defects
              .filter((d) => d.blocksLaunch)
              .map((defect) => {
                const isFixed = fixedDefectIds.includes(defect.id);
                return (
                  <div
                    key={defect.id}
                    onClick={() => onOpenDefectDetail(defect.id)}
                    className="p-3 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 bg-white rounded-md border border-slate-200 shadow-xs">
                          {getDefectIcon(defect.id)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                              #{defect.id}. {defect.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            {defect.impact}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        {isFixed ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Subsanado
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Bloquea
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Col 2: Mantenimiento Post-Lanzamiento */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h3 className="text-sm font-bold text-slate-900">
                Errores para Mantenimiento Post-Lanzamiento (3)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Backlog v1.0.1
            </span>
          </div>

          <div className="space-y-3">
            {defects
              .filter((d) => !d.blocksLaunch)
              .map((defect) => {
                const isFixed = fixedDefectIds.includes(defect.id);
                return (
                  <div
                    key={defect.id}
                    onClick={() => onOpenDefectDetail(defect.id)}
                    className="p-3 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 bg-white rounded-md border border-slate-200 shadow-xs">
                          {getDefectIcon(defect.id)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                              #{defect.id}. {defect.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            {defect.impact}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        {isFixed ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Subsanado
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Post-Launch
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* 5. Requisitos Obligatorios para el Próximo Checkpoint */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span>4. 📋 Requisitos Obligatorios para el Próximo Checkpoint</span>
            </h3>
            <p className="text-xs text-slate-400">
              Criterios no negociables para autorizar el paso a producción (Release Gate Approval)
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('simulator')}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Evaluar en Simulador</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-amber-400">
                CRITERIO 1 · AUTH
              </span>
              {fixedDefectIds.includes(2) ? (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Resuelto
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Pendiente
                </span>
              )}
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Asegurar que el sistema rechace 100% de las contraseñas inválidas.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-rose-400">
                CRITERIO 2 · CARRITO
              </span>
              {fixedDefectIds.includes(1) ? (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Resuelto
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Pendiente
                </span>
              )}
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Corregir el evento dinámico de recálculo de precios en el carrito.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-amber-400">
                CRITERIO 3 · PERSISTENCIA
              </span>
              {fixedDefectIds.includes(3) ? (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Resuelto
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Pendiente
                </span>
              )}
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Bloquear la duplicación de entidades en el carrito ante recargas de página (F5).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
