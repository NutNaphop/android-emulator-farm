'use client'
import { useState } from 'react'

const DEVICES = ['Samsung Galaxy S10', 'Pixel 4', 'Nexus 5']
const VERSIONS = ['11.0', '12.0', '13.0']

interface Props {
  onClose: () => void
  onCreate: (device: string, version: string) => void
}

export default function CreateModal({ onClose, onCreate }: Props) {
  const [device, setDevice] = useState(DEVICES[0])
  const [version, setVersion] = useState(VERSIONS[0])

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-80 flex flex-col gap-4 border border-gray-700">
        <h2 className="font-bold text-lg text-white">สร้าง Emulator ใหม่</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Device</label>
          <select
            className="border border-gray-600 bg-gray-700 text-white rounded-lg p-2 text-sm"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
          >
            {DEVICES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Android Version</label>
          <select
            className="border border-gray-600 bg-gray-700 text-white rounded-lg p-2 text-sm"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          >
            {VERSIONS.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-600 text-gray-300 rounded-lg py-2 text-sm hover:bg-gray-700"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => onCreate(device, version)}
            className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm hover:bg-blue-600"
          >
            สร้าง
          </button>
        </div>
      </div>
    </div>
  )
}