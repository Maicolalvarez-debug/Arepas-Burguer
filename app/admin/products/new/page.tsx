
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
  const router = useRouter();
  const [name, setName] = useState('');
  const [price: parseMilesToNumber(price), setPrice] = useState<number | string>(0);
  const [cost: parseMilesToNumber(cost), setCost]   = useState<number | string>(0);
  const [stock: Number(stock), setStock] = useState<number | string>(0);
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
          name,
          price: Number(price),
          cost: Number(cost),
          stock: Number(stock),
          active,
          categoryId: categoryId === '' ? null : Number(categoryId),
          description,
          image,
        }),
      });
      const json = await safeJson(res);
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'No se pudo crear');
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
            <input type="number" value={stock} onChange={e=>setStock(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-gray-900 text-white border border-gray-700 placeholder-gray-400" />
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
      </form>
    </div>
  );
}
