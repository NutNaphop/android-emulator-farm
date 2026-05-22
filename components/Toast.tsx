'use client'
import { useEffect } from 'react'

interface Props {
    message: string
    type: 'success' | 'error'
    onClose: () => void
}

export default function Toast({ message, type, onClose }: Props) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all ${type === 'success'
                ? 'bg-green-900 border-green-700 text-green-300'
                : 'bg-red-900 border-red-700 text-red-300'
            }`}>
            <span className="text-lg">{type === 'success' ? '✅' : '❌'}</span>
            <p className="text-sm">{message}</p>
            <button onClick={onClose} className="text-gray-400 hover:text-white ml-2">✕</button>
        </div>
    )
}