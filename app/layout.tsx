import './globals.css'
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="es">
      <body className="bg-gray-950 text-white">
        <header className="site-header border-b border-white/10 bg-black/60 backdrop-blur">
  <div className="container h-full flex items-center justify-between py-2">
    <div className="font-semibold">Arepas Burguer</div>
    <nav className="flex items-center gap-3">
      <a href="/" className="border rounded px-3 py-1 hover:bg-white/10 transition">Menú</a>
      <a href="/admin" className="border rounded px-3 py-1 hover:bg-white/10 transition">Admin</a>
    </nav>
  </div>
</header>

        <main className="page-wrap container py-6">{children}</main>
      </body>
    </html>
  );
}
