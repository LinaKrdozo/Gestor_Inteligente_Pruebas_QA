import React, { useState } from 'react';
import { 
  History, 
  TrendingUp, 
  Calendar, 
  Clock, 
  User, 
  Server, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ChevronRight,
  Filter,
  BarChart3
} from 'lucide-react';
import { TestRunCycle } from '../types/qa';

interface TestHistoryProps {
  historyCycles: TestRunCycle[];
  currentPassedTests: number;
  totalTests: number;
  onNavigateToSimulator: () => void;
}

export const TestHistory: React.FC<TestHistoryProps> = ({
  historyCycles,
  currentPassedTests,
  totalTests,
  onNavigateToSimulator,
}) => {
  const [selectedCycleId, setSelectedCycleId] = useState<string>(historyCycles[2].id); // default to current audit

  const selectedCycle = historyCycles.find((c) => c.id === selectedCycleId) || historyCycles[2];

  const currentRate = Math.round((currentPassedTests / totalTests) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-800" />
              <span>Historial de Ejecución y Evolución de Pruebas (Test Runs)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Trazabilidad cronológica de ciclos de regresión, tiempos de ejecución y evolución de la tasa de aprobación
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              CICLOS REGISTRADOS: {historyCycles.length}
            </span>
          </div>
        </div>
      </div>

      {/* Historical Trend Timeline Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Evolución de Calidad por Ciclo de Pruebas (Sprint Staging)
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Umbral de Despliegue Obligatorio: 90%
          </span>
        </div>

        {/* Visual Trend Bars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {historyCycles.map((cycle, idx) => {
            const isSelected = selectedCycleId === cycle.id;
            const isCurrentAudit = cycle.id === 'CYCLE-003';
            const isProjected = cycle.id === 'CYCLE-004-PROJ';
            const rate = isProjected ? currentRate : cycle.passRate;
            const passed = isProjected ? currentPassedTests : cycle.passedCount;

            return (
              <div
                key={cycle.id}
                onClick={() => setSelectedCycleId(cycle.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    CICLO 0{cycle.cycleNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      rate >= 90
                        ? 'bg-emerald-500/20 text-emerald-600 font-semibold'
                        : 'bg-rose-500/20 text-rose-600 font-semibold'
                    }`}
                  >
                    {rate >= 90 ? 'GO (90%+)' : 'NO-GO'}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold truncate">
                    {cycle.buildTag.split('(')[0]}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isSelected ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {cycle.date}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="tabular-nums font-bold text-base">
                      {rate}%
                    </span>
                    <span
                      className={`text-[11px] ${
                        isSelected ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {passed}/{cycle.totalTests} Pass
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 rounded-full overflow-hidden ${
                      isSelected ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`h-full transition-all duration-500 ${
                        rate >= 90 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>

                {isCurrentAudit && (
                  <div className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                    <span>★ Auditoría Actual QA</span>
                  </div>
                )}
                {isProjected && (
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span>⚡ Simulación Reactiva</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Run Deep Inspection */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] font-mono rounded">
                Ciclo #{selectedCycle.cycleNumber} · {selectedCycle.id}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300 font-medium">
                {selectedCycle.environment}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {selectedCycle.buildTag}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                selectedCycle.verdict === 'GO' || (selectedCycle.id === 'CYCLE-004-PROJ' && currentRate >= 90)
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {selectedCycle.verdict === 'GO' || (selectedCycle.id === 'CYCLE-004-PROJ' && currentRate >= 90) ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>DICTAMEN: APROBADO (GO)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>DICTAMEN: NO APROBADO (NO-GO)</span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Fecha y Hora de Ejecución
              </span>
              <div className="font-semibold text-slate-900 font-mono">
                {selectedCycle.date}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Duración Total de la Suite
              </span>
              <div className="font-semibold text-slate-900 font-mono">
                {selectedCycle.durationMinutes} minutos (35 tests)
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Responsable de Ejecución
              </span>
              <div className="font-semibold text-slate-900">
                {selectedCycle.executedBy}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                Entorno de Pruebas
              </span>
              <div className="font-semibold text-slate-900">
                {selectedCycle.environment}
              </div>
            </div>
          </div>

          {/* Notes and Summary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider block">
              Observaciones de Ingeniería y Hallazgos del Ciclo:
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              {selectedCycle.summaryNotes}
            </p>
          </div>

          {/* Comparative Metrics Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Métrica de Calidad</th>
                  <th className="py-2.5 px-4 text-center">Ciclo Anterior (02)</th>
                  <th className="py-2.5 px-4 text-center bg-slate-200/50">Auditoría Actual (03)</th>
                  <th className="py-2.5 px-4 text-center">Proyección Checkpoint (04)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">Casos Aprobados (Pass)</td>
                  <td className="py-3 px-4 text-center">26 / 35</td>
                  <td className="py-3 px-4 text-center font-bold bg-slate-50">29 / 35</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">{currentPassedTests} / 35</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">Tasa de Aprobación (%)</td>
                  <td className="py-3 px-4 text-center">74.3%</td>
                  <td className="py-3 px-4 text-center font-bold bg-slate-50">82.9%</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">{currentRate}%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">Defectos Bloqueantes Activos</td>
                  <td className="py-3 px-4 text-center text-rose-600">5 bloqueadores</td>
                  <td className="py-3 px-4 text-center text-rose-600 font-bold bg-slate-50">3 bloqueadores</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">0 bloqueadores</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">Tiempo de Suite (minutos)</td>
                  <td className="py-3 px-4 text-center">42 min</td>
                  <td className="py-3 px-4 text-center bg-slate-50">38 min</td>
                  <td className="py-3 px-4 text-center text-slate-900">35 min</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
