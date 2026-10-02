import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  DollarSign, 
  ShieldAlert, 
  Send, 
  Layers,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { Defect, BugStatus, BugTimelineEntry } from '../types/qa';

interface BugTrackerProps {
  defects: Defect[];
  fixedDefectIds: number[];
  onToggleDefectFix: (defectId: number) => void;
  onNavigateToSandbox: (defectId?: number) => void;
}

export const BugTracker: React.FC<BugTrackerProps> = ({
  defects,
  fixedDefectIds,
  onToggleDefectFix,
  onNavigateToSandbox,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [activeDefectId, setActiveDefectId] = useState<number>(1);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [localTimelines, setLocalTimelines] = useState<Record<number, BugTimelineEntry[]>>(() => {
    const map: Record<number, BugTimelineEntry[]> = {};
    defects.forEach((d) => {
      map[d.id] = [...d.timeline];
    });
    return map;
  });

  const getEffectiveStatus = (defect: Defect): BugStatus => {
    if (fixedDefectIds.includes(defect.id)) {
      return 'resolved';
    }
    return defect.status;
  };

  const statusConfig: Record<BugStatus, { label: string; class: string; bgClass: string }> = {
    open: { label: 'Abierto', class: 'text-rose-700 bg-rose-50 border-rose-200', bgClass: 'bg-rose-500' },
    in_progress: { label: 'En Desarrollo', class: 'text-amber-700 bg-amber-50 border-amber-200', bgClass: 'bg-amber-500' },
    in_review: { label: 'En Verificación QA', class: 'text-blue-700 bg-blue-50 border-blue-200', bgClass: 'bg-blue-500' },
    resolved: { label: 'Resuelto / Parcheado', class: 'text-emerald-700 bg-emerald-50 border-emerald-200', bgClass: 'bg-emerald-500' },
    deferred: { label: 'Diferido (Post-Launch)', class: 'text-slate-700 bg-slate-100 border-slate-200', bgClass: 'bg-slate-400' },
  };

  const handleStatusChange = (defectId: number, targetStatus: BugStatus) => {
    if (targetStatus === 'resolved') {
      if (!fixedDefectIds.includes(defectId)) {
        onToggleDefectFix(defectId);
      }
    } else {
      if (fixedDefectIds.includes(defectId)) {
        onToggleDefectFix(defectId);
      }
    }

    // Add entry to timeline
    const entry: BugTimelineEntry = {
      id: `tl-${defectId}-${Date.now()}`,
      timestamp: '2026-10-01 17:15',
      status: targetStatus,
      author: 'Lina Cardozo',
      role: 'Lead QA Engineer',
      comment: `Estado de seguimiento modificado a: ${statusConfig[targetStatus].label}`,
    };

    setLocalTimelines((prev) => ({
      ...prev,
      [defectId]: [entry, ...(prev[defectId] || [])],
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const entry: BugTimelineEntry = {
      id: `tl-${activeDefectId}-${Date.now()}`,
      timestamp: '2026-10-01 17:16',
      status: getEffectiveStatus(defects.find((d) => d.id === activeDefectId)!),
      author: 'Lina Cardozo',
      role: 'Lead QA Engineer',
      comment: newCommentText.trim(),
    };

    setLocalTimelines((prev) => ({
      ...prev,
      [activeDefectId]: [entry, ...(prev[activeDefectId] || [])],
    }));

    setNewCommentText('');
  };

  const activeDefect = defects.find((d) => d.id === activeDefectId) || defects[0];
  const activeTimeline = localTimelines[activeDefect.id] || activeDefect.timeline;
  const currentDefectEffectiveStatus = getEffectiveStatus(activeDefect);

  const filteredDefects = defects.filter((d) => {
    if (selectedStatusFilter === 'all') return true;
    return getEffectiveStatus(d) === selectedStatusFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-slate-800" />
          <span>Seguimiento del Estado de Defectos & SLAs (Bug Tracking)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Control de ciclo de vida, asignación técnica por ingeniero y trazabilidad de resolución para el pase a producción
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
        <button
          onClick={() => setSelectedStatusFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            selectedStatusFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Todos ({defects.length})
        </button>

        {(['open', 'in_progress', 'resolved', 'deferred'] as BugStatus[]).map((status) => {
          const count = defects.filter((d) => getEffectiveStatus(d) === status).length;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedStatusFilter === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <span>{statusConfig[status].label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left List of Bugs, Right Detail and Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Bug List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider px-1">
            Defectos Registrados ({filteredDefects.length})
          </div>

          <div className="space-y-2.5">
            {filteredDefects.map((defect) => {
              const status = getEffectiveStatus(defect);
              const isSelected = activeDefectId === defect.id;

              return (
                <div
                  key={defect.id}
                  onClick={() => setActiveDefectId(defect.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      #{defect.id} · {defect.testCaseId}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        statusConfig[status].class
                      }`}
                    >
                      {statusConfig[status].label}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold leading-snug line-clamp-2">
                    {defect.title}
                  </h4>

                  <div
                    className={`mt-2 pt-2 flex items-center justify-between text-[11px] border-t ${
                      isSelected ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <span className="flex items-center gap-1 truncate">
                      <User className="w-3 h-3" />
                      {defect.assignedTo}
                    </span>
                    <span className="font-mono text-[10px] shrink-0">
                      {defect.slaTarget.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Bug Lifecycle & Activity Log */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header of Active Defect */}
            <div className="p-6 bg-slate-900 text-white space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-xs rounded">
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

                {/* Status Switcher Dropdown */}
                <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
                  <span className="text-[11px] text-slate-400 pl-1">Estado:</span>
                  <select
                    value={currentDefectEffectiveStatus}
                    onChange={(e) => handleStatusChange(activeDefect.id, e.target.value as BugStatus)}
                    aria-label="Estado del defecto"
                    className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded border-0 focus:ring-0 cursor-pointer"
                  >
                    <option value="open">Abierto</option>
                    <option value="in_progress">En Desarrollo</option>
                    <option value="in_review">En Verificación QA</option>
                    <option value="resolved">Resuelto / Parcheado</option>
                    <option value="deferred">Diferido (Post-Launch)</option>
                  </select>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                {activeDefect.title}
              </h3>
            </div>

            {/* SLA & Assignment Cards */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Objetivo de SLA
                  </span>
                  <div className="font-bold text-slate-900">
                    {activeDefect.slaTarget}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {activeDefect.blocksLaunch ? 'Prioridad P0 / Bloqueante' : 'Prioridad P2 / No bloqueante'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Responsable Asignado
                  </span>
                  <div className="font-bold text-slate-900">
                    {activeDefect.assignedTo}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {activeDefect.assignedRole}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    Impacto Cuantitativo
                  </span>
                  <div className="font-bold text-slate-900 leading-tight">
                    {activeDefect.financialRiskEstimate}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleDefectFix(activeDefect.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
                    currentDefectEffectiveStatus === 'resolved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {currentDefectEffectiveStatus === 'resolved'
                      ? 'Parche Aplicado (Subsanado)'
                      : 'Marcar como Resuelto / Aplicar Parche'}
                  </span>
                </button>

                <button
                  onClick={() => onNavigateToSandbox(activeDefect.id)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Probar en Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Activity Timeline Stream */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Bitácora de Seguimiento & Auditoría de Cambios
                </span>

                {/* Add Comment Box */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Añadir nota de ingeniería o actualización de estado..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                  </button>
                </form>

                {/* Timeline Entries */}
                <div className="space-y-3 pt-2">
                  {activeTimeline.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {item.author}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({item.role})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {item.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
