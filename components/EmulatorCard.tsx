'use client'
import { useState } from 'react'
import { Emulator } from '@/lib/podman'

interface Props {
  emulator: Emulator
  onDestroy: (name: string) => void
}

export default function EmulatorCard({ emulator, onDestroy }: Props) {
  const isReady = emulator.bootStatus === 'ready'
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <div className="border border-gray-700 rounded-xl p-4 flex flex-col gap-3 bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-white">{emulator.name}</h2>
          <span className={`text-xs px-2 py-1 rounded-full ${isReady
            ? 'bg-green-900 text-green-400'
            : 'bg-yellow-900 text-yellow-400'
            }`}>
            {isReady ? 'Ready' : 'Booting...'}
          </span>
        </div>

        {!isReady && (
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div className="bg-yellow-400 h-1.5 rounded-full animate-pulse w-2/3" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-700 rounded-lg p-2">
            <p className="text-xs text-gray-400">CPU</p>
            <p className="text-sm text-white font-medium">{emulator.cpu}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-2">
            <p className="text-xs text-gray-400">RAM</p>
            <p className="text-sm text-white font-medium">{emulator.memory}</p>
          </div>
        </div>

        <p className="text-sm text-gray-400">Port: {emulator.port}</p>

        <div className="flex gap-2">
          <a
            href={`http://localhost:${emulator.port}`}
            target="_blank"
            className={`flex-1 text-center text-sm py-2 rounded-lg ${isReady
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none'
              }`}
          >
            เปิดหน้าจอ
          </a>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex-1 text-sm bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
          >
            ลบ
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-72 flex flex-col gap-4 border border-gray-700">
            <h2 className="font-bold text-white">ยืนยันการลบ</h2>
            <p className="text-sm text-gray-400">
              ต้องการลบ <span className="text-white font-medium">{emulator.name}</span> ใช่ไหม?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-600 text-gray-300 rounded-lg py-2 text-sm hover:bg-gray-700"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  onDestroy(emulator.name)
                  setShowConfirm(false)
                }}
                className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm hover:bg-red-600"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}