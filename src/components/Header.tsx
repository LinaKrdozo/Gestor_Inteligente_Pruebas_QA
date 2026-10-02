import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  CheckSquare, 
  AlertTriangle, 
  FlaskConical, 
  Gauge, 
  RotateCcw,
  Download,
  History,
  Layers
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  passedCount: number;
  totalCount: number;
  hasBlockingBugs: boolean;
  onReset: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  passedCount,
  totalCount,
  hasBlockingBugs,
  onReset,
  onExport,
}) => {
  const passRate = Math.round((passedCount / totalCount) * 100);
  const isApproved = passRate >= 90 && !hasBlockingBugs;

  const navItems = [
    { id: 'summary', label: '1. Resumen Ejecutivo', icon: FileText },
    { id: 'matrix', label: `2. Matriz (${totalCount})`, icon: CheckSquare },
    { id: 'defects', label: '3. Defectos & RCA', icon: AlertTriangle },
    { id: 'tracking', label: '4. Seguimiento & SLAs', icon: Layers },
    { id: 'history', label: '5. Historial de Pruebas', icon: History },
    { id: 'sandbox', label: '6. Sandbox en Vivo', icon: FlaskConical },
    { id: 'simulator', label: '7. Simulador Gate', icon: Gauge },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark & Live Release Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider">
                QA
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                  AuditQA
                </span>
                <span className="text-[11px] text-slate-500 font-medium block leading-none">
                  Staging / E-Commerce B2C
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              {isApproved ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>APROBADO ({passRate}%)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>NO APROBADO ({passRate}%)</span>
                </div>
              )}
            </div>
          </div>

          {/* Zone 2: Navigation Links (tabs) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              title="Restablecer estado original de auditoría QA"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restablecer</span>
            </button>
            <button
              onClick={onExport}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Informe</span>
            </button>
          </div>
        </div>

        {/* Mobile / Compact Navigation Row */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
