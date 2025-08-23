
// app/admin/products/new/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function formatMiles(v: string | number) {
  const n = typeof v === 'number' ? v : Number(String(v).replace(/[\.,]/g,''));
  if (!Number.isFinite(n)) return '';
  return n.toLocaleString('es-CO');
}
function parseMilesToNumber(v: string | number) {
  if (typeof v === 'number') return v;
  const raw = String(v).replace(/[\.,\s]/g, '');
  return Number(raw || 0);
}

const safeJson = async (res: Response) => {
  try { return await res.json(); } catch { return null }
};

type Cat = { id: number; name: string };

export default function NewProductoPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  function normalizeNumber(v:any){
    if (typeof v === 'number') return v;
    if (!v) return 0;
    // quitar separadores de miles tipo 5,000 o 5.000
    const s = String(v).replace(/[\.\s]/g, '').replace(',', '.');
    const n = Number(s);
    return isNaN(n) ? 0 : n;
  }
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>(0);
  const [cost, setCost]   = useState<number | string>(0);
  const [stock, setStock] = useState<number | string>(0);
  const [active, setActive] = useState(true);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [cats, setCats] = useState<Cat[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories');
        const json = await safeJson(res);
        if (Array.isArray(json)) setCats(json);
      } catch {}
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null); setBusy(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
      price: normalizeNumber(price),
      cost: normalizeNumber(cost),
      stock: Math.trunc(normalizeNumber(stock)),
          name,active,
          categoryId: categoryId === '' ? null : Number(categoryId),
          description,
          image,
        }),
      });
      const json = await safeJson(res);
      if (!res.ok || !json?.ok) throw new Error(json?.error || '{errorMsg ? errorMsg : ''}');
      router.push('/admin/products');
    } catch (err: any) {
      setMsg(err?.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Nuevo Producto</h1>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-900 text-white border border-gray-700 placeholder-gray-400" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Categoría</label>
            <select value={categoryId} onChange={e=>setCategoryId(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-lg px-3 py-2 bg-gray-900 text-white border border-gray-700 placeholder-gray-400">
              <option value="">(Sin categoría)</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Precio</label>
            <input type="number" step="0.01" value={typeof price==="number" ? formatMiles(price) : price} onChange={(e)=>{ const val = parseMilesToNumber(e.target.value); setPrice(formatMiles(val)); }} className="w-full rounded-lg px-3 py-2 bg-gray-900 text-white border border-gray-700 placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm mb-1">Costo</label>
            <input type="number" step="0.01" value={typeof cost==="number" ? formatMiles(cost) : cost} onChange={(e)=>{ const val = parseMilesToNumber(e.target.value); setCost(formatMiles(val)); }} className="w-full rounded-lg px-3 py-2 bg-gray-900 text-white border border-gray-700 placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <input type="number" value={stock ?? ""} onChange={(e)=>{ const raw = e.target.value.replace(/\D+/g,""); setStock(raw); }} className="w-full rounded-lg px-3 py-2 bg-gray-900 text-white border border-gray-700 placeholder-gray-400" />
          </div>
          <div className="flex items-center gap-2 mt-7">
            <input id="active" type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} />
            <label htmlFor="active">Activo</label>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full border rounded-lg px-3 py-2 min-h-[100px]" />
        </div>
        <div>
          <label className="block text-sm mb-1">Imagen (URL)</label>
          <input value={image} onChange={e=>setImage(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-900 text-white border border-gray-700 placeholder-gray-400" />
        </div>

        <button disabled={busy} className="rounded-xl px-4 py-2 border">
          {busy ? 'Guardando…' : 'Crear'}
        </button>
        {msg && <div className="text-sm">{msg}</div>}
      
      {errorMsg && (
        <p className="mt-3 text-sm text-red-400 bg-red-950/40 border border-red-800 rounded p-2 whitespace-pre-wrap">{errorMsg}</p>
      )}
      {okMsg && (
        <p className="mt-3 text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-800 rounded p-2">{okMsg}</p>
      )}
      <button type="submit" className="mt-4 border px-4 py-2 rounded disabled:opacity-60" disabled={loading}>
        {loading ? 'Creando…' : 'Crear'}
      </button>

    </form>
    </div>
  );
}
