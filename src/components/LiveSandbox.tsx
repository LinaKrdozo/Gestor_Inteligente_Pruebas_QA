import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Lock, 
  Trash2, 
  Plus, 
  Minus, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Timer, 
  Wrench, 
  ArrowRight,
  Info,
  DollarSign,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CartProduct, Defect } from '../types/qa';

interface LiveSandboxProps {
  initialProducts: CartProduct[];
  defects: Defect[];
  fixedDefectIds: number[];
  onToggleDefectFix: (defectId: number) => void;
  preselectedDefectId?: number;
}

export const LiveSandbox: React.FC<LiveSandboxProps> = ({
  initialProducts,
  defects,
  fixedDefectIds,
  onToggleDefectFix,
  preselectedDefectId,
}) => {
  const [sandboxTab, setSandboxTab] = useState<'cart' | 'auth'>('cart');
  const [cartItems, setCartItems] = useState<CartProduct[]>(initialProducts);
  const [staleCartSubtotal, setStaleCartSubtotal] = useState<number>(() => {
    return initialProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);
  });
  
  // Bug 4 delete loading simulation
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deleteStopwatchMs, setDeleteStopwatchMs] = useState<number>(0);
  const [isDeletingTimerRunning, setIsDeletingTimerRunning] = useState<boolean>(false);

  // Bug 3 reload count
  const [reloadNotice, setReloadNotice] = useState<string | null>(null);

  // Auth flow states
  const [authEmail, setAuthEmail] = useState<string>('cliente.qa@mitienda.com');
  const [authPassword, setAuthPassword] = useState<string>('contraseña123'); // wrong password on purpose to demonstrate
  const [authRemember, setAuthRemember] = useState<boolean>(true);
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [authMessage, setAuthMessage] = useState<string>('');

  // Switch tabs if preselectedDefectId is Auth (Bug 2 or 5)
  useEffect(() => {
    if (preselectedDefectId === 2 || preselectedDefectId === 5) {
      setSandboxTab('auth');
    } else if (preselectedDefectId) {
      setSandboxTab('cart');
    }
  }, [preselectedDefectId]);

  // Derived bug statuses
  const isBug1Fixed = fixedDefectIds.includes(1);
  const isBug2Fixed = fixedDefectIds.includes(2);
  const isBug3Fixed = fixedDefectIds.includes(3);
  const isBug4Fixed = fixedDefectIds.includes(4);
  const isBug5Fixed = fixedDefectIds.includes(5);
  const isBug6Fixed = fixedDefectIds.includes(6);

  // Calculate actual real subtotal based on current quantities
  const realSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // If Bug 1 is FIXED, keep staleCartSubtotal synchronized with realSubtotal
  useEffect(() => {
    if (isBug1Fixed) {
      setStaleCartSubtotal(realSubtotal);
    }
  }, [isBug1Fixed, realSubtotal]);

  // Handle Quantity Change (Bug #1 simulation)
  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );

    // If Bug 1 is active (NOT fixed): do NOT update the cart subtotal! It freezes, showing the bug!
    if (isBug1Fixed) {
      // Recalculates immediately with correct state
      // useEffect handles it
    } else {
      // Intentionally leaving staleCartSubtotal untouched to demonstrate the bug!
    }
  };

  // Handle Page Reload / F5 Simulation (Bug #3 simulation)
  const handleSimulateReload = () => {
    if (isBug3Fixed) {
      // Fix: Idempotent state retained
      setReloadNotice('✅ [FIX ACTIVO - PRG]: Recarga exitosa. El carrito se mantuvo intacto sin duplicación de ítems.');
    } else {
      // Bug: Duplicates the first or last item in the cart
      if (cartItems.length > 0) {
        const itemToDuplicate = { ...cartItems[0], id: `prod-dup-${Date.now()}` };
        setCartItems((prev) => [...prev, itemToDuplicate]);
        setReloadNotice(
          '❌ [BUG REPRODUCIDO]: Se detectó reenvío del payload HTTP en F5. El producto "' +
            cartItems[0].name +
            '" se ha duplicado en el carrito de forma automática.'
        );
      }
    }
    setTimeout(() => setReloadNotice(null), 5000);
  };

  // Handle Item Deletion (Bug #4 simulation)
  const handleDeleteItem = (id: string) => {
    if (isBug4Fixed) {
      // Fix: Optimistic instantaneous deletion <50ms
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setStaleCartSubtotal((prev) => {
        const item = cartItems.find((i) => i.id === id);
        return item ? Math.max(0, prev - item.price * item.quantity) : prev;
      });
    } else {
      // Bug: 3.5s delay with frozen UI
      setDeletingItemId(id);
      setIsDeletingTimerRunning(true);
      setDeleteStopwatchMs(0);

      const startTime = Date.now();
      const interval = setInterval(() => {
        setDeleteStopwatchMs(Date.now() - startTime);
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        setIsDeletingTimerRunning(false);
        setDeletingItemId(null);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        setStaleCartSubtotal((prev) => {
          const item = cartItems.find((i) => i.id === id);
          return item ? Math.max(0, prev - item.price * item.quantity) : prev;
        });
      }, 3500);
    }
  };

  // Reset Cart
  const handleResetCart = () => {
    setCartItems(initialProducts);
    const initialTotal = initialProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setStaleCartSubtotal(initialTotal);
    setReloadNotice(null);
  };

  // Handle Auth Form Submission (Bug #2 simulation)
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = 'PasswordSegura2026!';

    if (isBug2Fixed) {
      // Fix: Strict validation
      if (authPassword === correctPassword) {
        setAuthStatus('success');
        setAuthMessage(
          isBug5Fixed
            ? '✅ Sesión iniciada correctamente con token JWT cifrado.'
            : '✅ Signed in successfully with secure JWT token.'
        );
      } else {
        setAuthStatus('error');
        setAuthMessage(
          isBug5Fixed
            ? '❌ Contraseña incorrecta. Acceso denegado (HTTP 401 Unauthorized).'
            : '❌ Invalid password. Access denied (HTTP 401 Unauthorized).'
        );
      }
    } else {
      // Bug: Allows login ANYWAY with wrong password!
      setAuthStatus('success');
      setAuthMessage(
        '🚨 [BRECHA DE SEGURIDAD DETECTADA]: Se permitió el inicio de sesión con una contraseña INCORRECTA. Vulnerabilidad de Account Takeover (Robo de cuenta) confirmada.'
      );
    }
  };

  // Calculate taxes and totals
  const displayedSubtotal = isBug1Fixed ? realSubtotal : staleCartSubtotal;
  const isDesynced = Math.abs(displayedSubtotal - realSubtotal) > 0.01;
  const tax = displayedSubtotal * 0.16;
  const shippingCost = displayedSubtotal > 100 || displayedSubtotal === 0 ? 0 : 4.99;
  const grandTotal = displayedSubtotal + tax + shippingCost;

  return (
    <div className="space-y-6 pb-12">
      {/* Sandbox Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>4. 🧪 Sandbox de Pruebas y Remediación en Vivo</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Entorno interactivo para reproducir los defectos reportados y validar sus parches en tiempo real
          </p>
        </div>

        {/* Tab switch between Cart Flow & Auth Flow */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setSandboxTab('cart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              sandboxTab === 'cart'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Módulo Carrito (4 Bugs)</span>
          </button>
          <button
            onClick={() => setSandboxTab('auth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              sandboxTab === 'auth'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Módulo Login / Auth (2 Bugs)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: CARRITO DE COMPRAS */}
      {/* ========================================================================= */}
      {sandboxTab === 'cart' && (
        <div className="space-y-6">
          {/* Active Bug Controls for Shopping Cart */}
          <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span>Controladores de Defectos en el Carrito (Activar / Corregir)</span>
              </span>
              <button
                onClick={handleResetCart}
                className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar Carrito</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {/* Bug #1 Control */}
              <button
                onClick={() => onToggleDefectFix(1)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isBug1Fixed
                    ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500/80 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>#1 Recálculo de Precio</span>
                  <span>{isBug1Fixed ? 'PARCHE ACTIVO' : 'BUG ACTIVO'}</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1 leading-tight">
                  {isBug1Fixed
                    ? 'Recálculo instantáneo al cambiar cantidad'
                    : 'Total congelado / desincronizado'}
                </p>
              </button>

              {/* Bug #3 Control */}
              <button
                onClick={() => onToggleDefectFix(3)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isBug3Fixed
                    ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                    : 'bg-amber-950/60 border-amber-500/80 text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>#3 Duplicación en F5</span>
                  <span>{isBug3Fixed ? 'PARCHE ACTIVO' : 'BUG ACTIVO'}</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1 leading-tight">
                  {isBug3Fixed
                    ? 'Patrón PRG e idempotencia activo'
                    : 'Reenvío de POST duplica ítems'}
                </p>
              </button>

              {/* Bug #4 Control */}
              <button
                onClick={() => onToggleDefectFix(4)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isBug4Fixed
                    ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                    : 'bg-amber-950/60 border-amber-500/80 text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>#4 Latencia de Eliminar</span>
                  <span>{isBug4Fixed ? 'PARCHE ACTIVO' : 'BUG ACTIVO'}</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1 leading-tight">
                  {isBug4Fixed
                    ? 'Optimistic UI instantáneo (<50ms)'
                    : 'Latencia bloqueante de 3.5 segundos'}
                </p>
              </button>

              {/* Bug #6 Control */}
              <button
                onClick={() => onToggleDefectFix(6)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isBug6Fixed
                    ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                    : 'bg-slate-800 border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>#6 Alineación de UI</span>
                  <span>{isBug6Fixed ? 'PARCHE ACTIVO' : 'BUG ACTIVO'}</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1 leading-tight">
                  {isBug6Fixed
                    ? 'Layout limpio alineado sin márgenes negativos'
                    : 'Margen negativo solapa botón'}
                </p>
              </button>
            </div>
          </div>

          {/* Critical Financial Discrepancy Warning (Bug #1 active notice) */}
          {isDesynced && !isBug1Fixed && (
            <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-xl text-xs text-rose-950 space-y-2 animate-pulse">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>⚠️ INCONSISTENCIA FINANCIERA DETECTADA (Defecto Crítico #1 en Vivo)</span>
              </div>
              <p className="leading-relaxed">
                Has cambiado la cantidad de productos, pero <strong>el total visible del carrito está desfasado</strong>:
                el subtotal visual muestra <strong className="tabular-nums">${displayedSubtotal.toFixed(2)}</strong>, 
                mientras que el valor real que debería cobrarse es <strong className="tabular-nums text-rose-700">${realSubtotal.toFixed(2)}</strong> 
                (Diferencia no cobrada: <strong className="tabular-nums font-mono">${Math.abs(realSubtotal - displayedSubtotal).toFixed(2)}</strong>).
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-rose-700 font-semibold">
                <span>Riesgo en producción: Pérdida económica masiva o contracargos bancarios por cobro inconsistente.</span>
              </div>
            </div>
          )}

          {/* F5 Reload Notification */}
          {reloadNotice && (
            <div className="p-3 bg-slate-900 text-white rounded-lg text-xs font-mono flex items-center justify-between">
              <span>{reloadNotice}</span>
              <button onClick={() => setReloadNotice(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
          )}

          {/* Simulated E-Commerce Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left 2 Cols: Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Artículos en el Carrito ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                  </h3>
                  <span className="text-xs text-slate-500">
                    · SKU únicos: {cartItems.length}
                  </span>
                </div>

                {/* F5 Test Trigger Button */}
                <button
                  onClick={handleSimulateReload}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
                  title="Simula presionar F5 o recargar página para probar el Bug #3"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                  <span>Simular Recarga F5</span>
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 space-y-3">
                  <ShoppingCart className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">El carrito se encuentra vacío.</p>
                  <button
                    onClick={handleResetCart}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium"
                  >
                    Restablecer Productos
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const isDeletingThis = deletingItemId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                          isDeletingThis ? 'opacity-60 bg-amber-50 border-amber-300' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Image with fallback container */}
                          <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative flex items-center justify-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <ShoppingCart className="w-5 h-5 text-slate-300 absolute" />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-mono">
                              SKU: {item.sku} · {item.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">
                              {item.name}
                            </h4>
                            <div className="text-xs text-slate-600 font-medium tabular-nums">
                              ${item.price.toFixed(2)} c/u
                            </div>
                          </div>
                        </div>

                        {/* Interactive Quantity & Subtotal */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                          {/* Quantity Selector with +/- buttons */}
                          <div className="space-y-0.5 text-center">
                            <span className="text-[10px] text-slate-400 block sm:hidden">
                              Cantidad
                            </span>
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                              <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={item.quantity <= 1 || isDeletingThis}
                                className="p-1.5 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Disminuir cantidad"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold tabular-nums text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                disabled={isDeletingThis}
                                className="p-1.5 hover:bg-slate-200 text-slate-600"
                                title="Aumentar cantidad (reproduce Bug #1)"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Line Item Total */}
                          <div className="text-right w-24">
                            <span className="text-xs font-bold text-slate-900 tabular-nums block">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Subtotal ítem
                            </span>
                          </div>

                          {/* Delete Item Button (Bug #4 test) */}
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={isDeletingThis}
                            className={`p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors ${
                              isDeletingThis ? 'cursor-wait text-amber-600' : ''
                            }`}
                            title={isBug4Fixed ? 'Eliminar instantáneo' : 'Eliminar con latencia de 3.5s'}
                          >
                            {isDeletingThis ? (
                              <div className="flex items-center gap-1 text-[11px] font-mono text-amber-700">
                                <Timer className="w-3.5 h-3.5 animate-spin" />
                                <span className="tabular-nums">{(deleteStopwatchMs / 1000).toFixed(1)}s</span>
                              </div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Col: Order Summary & Checkout (Bug #6 layout test) */}
            <div className="space-y-4">
              <div
                className={`p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4 transition-all ${
                  !isBug6Fixed ? '-mt-4 border-rose-300 relative z-10' : ''
                }`}
              >
                {!isBug6Fixed && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[10px] text-amber-800 font-mono">
                    ⚠️ Bug #6 Activo: -mt-4 provoca solapamiento cosmético.
                  </div>
                )}

                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Resumen de la Orden
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal de productos</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      ${displayedSubtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>IVA Estimado (16%)</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      ${tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Envío</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-600 font-bold">GRATIS (&gt;$100)</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-900">Total a Pagar</span>
                    <span className="text-base font-extrabold text-slate-900 tabular-nums">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Procesando pago simulado por $${grandTotal.toFixed(2)}`)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Proceder al Pago Seguro</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="text-[11px] text-slate-400 text-center leading-tight">
                  Checkout seguro simulado con encriptación TLS 1.3
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: AUTENTICACIÓN Y LOGIN */}
      {/* ========================================================================= */}
      {sandboxTab === 'auth' && (
        <div className="space-y-6">
          {/* Active Bug Controls for Auth */}
          <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>Controladores de Defectos de Autenticación</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Bug #2 Control */}
              <button
                onClick={() => onToggleDefectFix(2)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isBug2Fixed
                    ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500/80 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>#2 Verificación de Contraseña (Bypass ATO)</span>
                  <span>{isBug2Fixed ? 'PARCHE ACTIVO' : 'BUG ACTIVO'}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  {isBug2Fixed
                    ? 'Validación estricta de hash. Rechaza cualquier clave incorrecta.'
                    : 'Fallo crítico: Permite login con contraseña incorrecta.'}
                </p>
              </button>

              {/* Bug #5 Control */}
              <button
                onClick={() => onToggleDefectFix(5)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isBug5Fixed
                    ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                    : 'bg-slate-800 border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>#5 Idioma del Formulario</span>
                  <span>{isBug5Fixed ? 'PARCHE ACTIVO' : 'BUG ACTIVO'}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  {isBug5Fixed
                    ? 'Localización completa al español (es-ES / es-LATAM)'
                    : 'Etiquetas y botones en inglés mezclados'}
                </p>
              </button>
            </div>
          </div>

          {/* Login Form Container */}
          <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl mx-auto flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {isBug5Fixed ? 'Iniciar Sesión en tu Cuenta' : 'Sign In to Your Account'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBug5Fixed
                  ? 'Ingresa tus credenciales registradas para continuar'
                  : 'Enter your credentials to continue shopping'}
              </p>
            </div>

            {/* Test credentials helper banner */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Credenciales de Prueba:</span>
              <div>Email: <code className="text-slate-900">cliente.qa@mitienda.com</code></div>
              <div>Contraseña Correcta: <code className="text-slate-900">PasswordSegura2026!</code></div>
              <div className="text-amber-800 font-semibold pt-1">
                👉 Ingresa una contraseña INCORRECTA (ej: "123456") para comprobar si el sistema la rechaza o si ocurre el bypass.
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 block">
                  {isBug5Fixed ? 'Correo Electrónico' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-slate-700">
                    {isBug5Fixed ? 'Contraseña' : 'Password'}
                  </label>
                  <a href="#recuperar" onClick={(e) => e.preventDefault()} className="text-slate-500 hover:text-slate-900">
                    {isBug5Fixed ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
                  </a>
                </div>
                <input
                  type="text"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Escribe cualquier contraseña para probar"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={authRemember}
                    onChange={(e) => setAuthRemember(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>{isBug5Fixed ? 'Recordarme en este equipo' : 'Remember me on this device'}</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
              >
                {isBug5Fixed ? 'Iniciar Sesión' : 'Sign In'}
              </button>
            </form>

            {/* Auth Response Alert */}
            {authStatus !== 'idle' && (
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                  authStatus === 'success' && !isBug2Fixed
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : authStatus === 'success'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {authStatus === 'success' && !isBug2Fixed ? (
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : authStatus === 'success' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>Resultado del Intento de Autenticación:</span>
                </div>
                <p>{authMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
