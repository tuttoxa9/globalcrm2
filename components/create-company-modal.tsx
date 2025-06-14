"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Building2, Loader2 } from "lucide-react"
import { addCompany } from "@/lib/firestore"
import { useAuth } from "@/hooks/useAuth"

interface CreateCompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onCompanyCreated: () => void
}

export default function CreateCompanyModal({ isOpen, onClose, onCompanyCreated }: CreateCompanyModalProps) {
  const { user } = useAuth()
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError("")

    const { id, error: addError } = await addCompany({
      name: name.trim(),
      userId: user.uid,
      createdAt: new Date(),
    })

    if (id) {
      setName("")
      onCompanyCreated()
      onClose()
    } else {
      setError(addError || "Ошибка создания компании")
    }

    setLoading(false)
  }

  const handleClose = () => {
    setName("")
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md rounded-2xl bg-[#1F2937] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#374151]">
              <Building2 className="h-5 w-5 text-[#3B82F6]" />
            </div>
            <h2 className="text-lg font-medium text-[#E5E7EB] font-inter">
              Новая компания
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#374151] hover:text-[#E5E7EB]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
              Название компании
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-[#374151] px-3 py-2 text-[#E5E7EB] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#3B82F6] font-inter"
              placeholder="Введите название компании"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-sm text-[#EF4444] font-inter">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg bg-[#374151] py-2 text-sm font-medium text-[#D1D5DB] transition-colors hover:bg-[#4B5563] font-inter"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[#3B82F6] py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563EB] disabled:opacity-50 font-inter"
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "Создать"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
