'use client'
import { useEffect, useState, useCallback } from 'react'
import EmulatorCard from '@/components/EmulatorCard'
import CreateModal from '@/components/CreateModal'
import Toast from '@/components/Toast'
import { Emulator } from '@/lib/podman'

interface ToastState {
  message: string
  type: 'success' | 'error'
}

export default function Home() {
  const [emulators, setEmulators] = useState<Emulator[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  const fetchEmulators = useCallback(async () => {
    const res = await fetch('/api/emulators')
    const data = await res.json()
    setEmulators(data)
  }, [])

  useEffect(() => {
    fetchEmulators()
    const interval = setInterval(fetchEmulators, 5000)
    return () => clearInterval(interval)
  }, [fetchEmulators])

  const handleCreate = async (device: string, version: string) => {
    setLoading(true)
    setShowModal(false)
    const res = await fetch('/api/emulators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device, androidVersion: version })
    })

    if (!res.ok) {
      const data = await res.json()
      showToast(data.error, 'error')
    } else {
      showToast('กำลังสร้าง emulator...', 'success')
    }

    await fetchEmulators()
    setLoading(false)
  }

  const handleDestroy = async (name: string) => {
    const res = await fetch(`/api/emulators/${name}`, { method: 'DELETE' })
    if (res.ok) {
      showToast(`ลบ ${name} สำเร็จ`, 'success')
    } else {
      showToast('ลบไม่สำเร็จ ลองใหม่อีกครั้ง', 'error')
    }
    await fetchEmulators()
  }

  return (
    <main className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Android Device Farm</h1>
            <p className="text-sm text-gray-400">{emulators.length} emulator ที่รันอยู่</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            + สร้าง Emulator
          </button>
        </div>

        {loading && (
          <div className="text-center text-gray-500 py-8">กำลังสร้าง emulator...</div>
        )}

        {emulators.length === 0 && !loading ? (
          <div className="text-center text-gray-600 py-16">
            ยังไม่มี emulator กดสร้างได้เลย
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {emulators.map((emu) => (
              <EmulatorCard key={emu.id} emulator={emu} onDestroy={handleDestroy} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  )
}