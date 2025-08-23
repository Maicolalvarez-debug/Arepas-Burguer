export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Productos</h1>
        <a className="border rounded px-3 py-1 hover:bg-white/10 transition" href="/admin/products/new">Crear producto</a>
      </div>
      {children}
    </div>
  )
}
