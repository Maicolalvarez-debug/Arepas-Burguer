'use client'
import React from 'react'
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="font-semibold">Admin</div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  )
}
