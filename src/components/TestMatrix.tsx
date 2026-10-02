import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { TestCase, ModuleType, Defect } from '../types/qa';

interface TestMatrixProps {
  testCases: TestCase[];
  defects: Defect[];
  fixedDefectIds: number[];
  onToggleDefectFix: (defectId: number) => void;
  onOpenDefectDetail: (defectId: number) => void;
}

export const TestMatrix: React.FC<TestMatrixProps> = ({
  testCases,
  defects,
  fixedDefectIds,
  onToggleDefectFix,
  onOpenDefectDetail,
}) => {
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Compute live test case status based on whether linked defect is fixed
  const dynamicTestCases = useMemo(() => {
    return testCases.map((tc) => {
      if (tc.defectId && fixedDefectIds.includes(tc.defectId)) {
        return {
          ...tc,
          status: 'pass' as const,
          actualResult: `[REMEDIADO]: ${tc.expectedResult} (Verificado con parche aplicado).`,
        };
      }
      return tc;
    });
  }, [testCases, fixedDefectIds]);

  const filteredCases = useMemo(() => {
    return dynamicTestCases.filter((tc) => {
      const matchModule = selectedModule === 'all' || tc.module === selectedModule;
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'pass' && tc.status === 'pass') ||
        (selectedStatus === 'fail' && tc.status === 'fail');
      const matchSearch =
        searchQuery === '' ||
        tc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tc.moduleLabel.toLowerCase().includes(searchQuery.toLowerCase());

      return matchModule && matchStatus && matchSearch;
    });
  }, [dynamicTestCases, selectedModule, selectedStatus, searchQuery]);

  const stats = useMemo(() => {
    const total = dynamicTestCases.length;
    const passed = dynamicTestCases.filter((c) => c.status === 'pass').length;
    const failed = total - passed;
    const rate = Math.round((passed / total) * 100);
    return { total, passed, failed, rate };
  }, [dynamicTestCases]);

  const toggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const modulesList: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'Todos los Módulos', count: dynamicTestCases.length },
    { id: 'cart', label: 'Carrito de compras', count: dynamicTestCases.filter((c) => c.module === 'cart').length },
    { id: 'auth', label: 'Autenticación', count: dynamicTestCases.filter((c) => c.module === 'auth').length },
    { id: 'catalog', label: 'Catálogo & Búsqueda', count: dynamicTestCases.filter((c) => c.module === 'catalog').length },
    { id: 'checkout', label: 'Pasarela de Pago', count: dynamicTestCases.filter((c) => c.module === 'checkout').length },
    { id: 'shipping', label: 'Gestión de Envíos', count: dynamicTestCases.filter((c) => c.module === 'shipping').length },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Live Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Matriz Integral de Casos de Prueba</span>
            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {stats.total} Casos de Prueba (QA Staging)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro exhaustivo de verificación funcional para el e-commerce B2C
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="tabular-nums font-bold">{stats.passed}</span>
            <span>Aprobados</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 font-medium">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span className="tabular-nums font-bold">{stats.failed}</span>
            <span>Fallidos</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg font-mono font-medium">
            <span>TASA:</span>
            <span className="font-bold tabular-nums">{stats.rate}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Module filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0">
          {modulesList.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModule(m.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedModule === m.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{m.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                  selectedModule === m.id
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {m.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Status Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Status selector */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({dynamicTestCases.length})
            </button>
            <button
              onClick={() => setSelectedStatus('pass')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === 'pass'
                  ? 'bg-white text-emerald-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pass ({stats.passed})
            </button>
            <button
              onClick={() => setSelectedStatus('fail')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === 'fail'
                  ? 'bg-white text-rose-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fail ({stats.failed})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar TC-..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-8"></th>
                <th className="py-3 px-3 w-28">ID Caso</th>
                <th className="py-3 px-4">Descripción del Caso de Prueba</th>
                <th className="py-3 px-3">Módulo</th>
                <th className="py-3 px-3 text-center">Duración</th>
                <th className="py-3 px-3 text-center">Resultado</th>
                <th className="py-3 px-3 text-right">Acción / Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No se encontraron casos de prueba con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredCases.map((tc) => {
                  const isExpanded = expandedRowId === tc.id;
                  const hasDefect = tc.defectId !== undefined;
                  const isRemediated = tc.defectId && fixedDefectIds.includes(tc.defectId);

                  return (
                    <React.Fragment key={tc.id}>
                      <tr
                        onClick={() => toggleRow(tc.id)}
                        className={`cursor-pointer transition-colors ${
                          tc.status === 'fail'
                            ? 'bg-rose-50/20 hover:bg-rose-50/40'
                            : 'hover:bg-slate-50/60'
                        } ${isExpanded ? 'bg-slate-50/80' : ''}`}
                      >
                        <td className="py-3 px-3 text-slate-400">
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-slate-800">
                          {tc.id}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{tc.name}</span>
                            {tc.severity && tc.status === 'fail' && (
                              <span
                                className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                                  tc.severity === 'critical'
                                    ? 'bg-rose-100 text-rose-800'
                                    : tc.severity === 'high'
                                    ? 'bg-amber-100 text-amber-800'
                                    : tc.severity === 'medium'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {tc.severity}
                              </span>
                            )}
                            {isRemediated && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                Fix Simulado
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                          {tc.moduleLabel}
                        </td>
                        <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-500">
                          {tc.durationMs}ms
                        </td>
                        <td className="py-3 px-3 text-center">
                          {tc.status === 'pass' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Pass</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Fail</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          {hasDefect && tc.defectId ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onToggleDefectFix(tc.defectId!)}
                                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                                  isRemediated
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                                }`}
                                title={isRemediated ? 'Deshacer parche simulado' : 'Simular solución de este bug'}
                              >
                                <Wrench className="w-3 h-3" />
                                <span>{isRemediated ? 'Parche Activo' : 'Simular Fix'}</span>
                              </button>
                              <button
                                onClick={() => onOpenDefectDetail(tc.defectId!)}
                                className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                                title="Ver detalle del defecto y código"
                              >
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-mono">Nominal</span>
                          )}
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-t border-slate-100">
                          <td colSpan={7} className="py-4 px-6 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                                <span className="font-bold text-slate-700 block">Precondición:</span>
                                <p className="text-slate-600">{tc.preconditions}</p>
                              </div>
                              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                                <span className="font-bold text-emerald-800 block">Resultado Esperado:</span>
                                <p className="text-slate-600">{tc.expectedResult}</p>
                              </div>
                              <div
                                className={`p-3 rounded-lg border space-y-1 ${
                                  tc.status === 'pass'
                                    ? 'bg-white border-slate-200'
                                    : 'bg-rose-50/50 border-rose-200'
                                }`}
                              >
                                <span
                                  className={`font-bold block ${
                                    tc.status === 'pass' ? 'text-slate-800' : 'text-rose-800'
                                  }`}
                                >
                                  Resultado Obtenido:
                                </span>
                                <p className="text-slate-700">{tc.actualResult}</p>
                              </div>
                            </div>

                            {hasDefect && (
                              <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-lg text-xs">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                                  <span>
                                    Asociado a Defecto #{tc.defectId}:{' '}
                                    <strong className="text-amber-300">
                                      {defects.find((d) => d.id === tc.defectId)?.title}
                                    </strong>
                                  </span>
                                </div>
                                <button
                                  onClick={() => onOpenDefectDetail(tc.defectId!)}
                                  className="text-xs text-blue-300 hover:text-white underline font-medium"
                                >
                                  Ver Análisis Técnico y Solución &rarr;
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
