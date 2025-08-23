import './globals.css'
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="es">
      <body className="bg-gray-950 text-white">
        <header className="site-header border-b border-white/10 bg-black/60 backdrop-blur">
          <div className="container h-full flex items-center justify-between">
            {/* Coloca aquí tu navegación/logotipo si aplica */}
            <div className="font-semibold">Arepas Burguer</div>
          </div>
        </header>
        <main className="page-wrap container py-6">{children}</main>
      </body>
    </html>
  );
}
