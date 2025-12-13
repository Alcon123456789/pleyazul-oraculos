'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function TestCheckoutInner() {
  const searchParams = useSearchParams();
  const spreadId = searchParams.get('spread_id') || '';
  const email = searchParams.get('email') || '';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Checkout (Test)</h1>

        <p className="text-slate-600">
          Tirada seleccionada:{' '}
          <span className="font-semibold">
            {spreadId || 'No especificada'}
          </span>
        </p>

        <p className="text-slate-600">
          Email:{' '}
          <span className="font-semibold">
            {email || 'No proporcionado'}
          </span>
        </p>

        <p className="text-slate-500 text-sm mt-4">
          Esta es la página de prueba del checkout en modo demo. Solo la usamos
          para que el build de la aplicación se complete correctamente.
        </p>
      </div>
    </main>
  );
}

export default function TestCheckoutPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Cargando test de checkout…</div>}>
      <TestCheckoutInner />
    </Suspense>
  );
}
