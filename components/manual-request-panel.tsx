"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, User, Phone, Calendar, FileText, Loader2 } from "lucide-react"
import { addRequest } from "@/lib/firestore"

interface ManualRequestPanelProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  onRequestAdded: () => void
}

export default function ManualRequestPanel({ isOpen, onClose, projectId, onRequestAdded }: ManualRequestPanelProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullName: "",
    phoneNumber: "",
    birthDate: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { id, error: addError } = await addRequest({
        projectId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      if (id) {
        setFormData({
          title: "",
          description: "",
          fullName: "",
          phoneNumber: "",
          birthDate: "",
        })
        onRequestAdded()
        onClose()
      } else {
        setError(addError || "Ошибка создания заявки")
      }
    } catch (err) {
      setError("Произошла ошибка при создании заявки")
    }

    setLoading(false)
  }

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      fullName: "",
      phoneNumber: "",
      birthDate: "",
    })
    setError("")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 z-50 h-full w-96 bg-[#1F2937] shadow-xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#374151] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#374151]">
                    <Plus className="h-5 w-5 text-[#3B82F6]" />
                  </div>
                  <h2 className="text-lg font-medium text-[#E5E7EB] font-inter">
                    Добавить заявку
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
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Заголовок заявки *
                      </div>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full rounded-lg bg-[#374151] px-3 py-2 text-[#E5E7EB] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#3B82F6] font-inter"
                      placeholder="Введите заголовок"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                      Описание
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-lg bg-[#374151] px-3 py-2 text-[#E5E7EB] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#3B82F6] font-inter resize-none"
                      placeholder="Введите описание заявки"
                      rows={3}
                      disabled={loading}
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        ФИО
                      </div>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full rounded-lg bg-[#374151] px-3 py-2 text-[#E5E7EB] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#3B82F6] font-inter"
                      placeholder="Введите ФИО"
                      disabled={loading}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Номер телефона
                      </div>
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full rounded-lg bg-[#374151] px-3 py-2 text-[#E5E7EB] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#3B82F6] font-inter"
                      placeholder="+7 (999) 123-45-67"
                      disabled={loading}
                    />
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Дата рождения
                      </div>
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full rounded-lg bg-[#374151] px-3 py-2 text-[#E5E7EB] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#3B82F6] font-inter"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-[#EF4444] font-inter">
                      {error}
                    </div>
                  )}
                </form>
              </div>

              {/* Footer */}
              <div className="border-t border-[#374151] p-6">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 rounded-lg bg-[#374151] py-2 text-sm font-medium text-[#D1D5DB] transition-colors hover:bg-[#4B5563] font-inter"
                    disabled={loading}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 rounded-lg bg-[#3B82F6] py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563EB] disabled:opacity-50 font-inter"
                    disabled={loading || !formData.title.trim()}
                  >
                    {loading ? (
                      <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                    ) : (
                      "Создать заявку"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
