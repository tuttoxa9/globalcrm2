"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Building2, Check, Loader2 } from "lucide-react"
import { getCompanies, type Company } from "@/lib/firestore"
import { useAuth } from "@/hooks/useAuth"

interface CompanySelectModalProps {
  isOpen: boolean
  onClose: () => void
  onCompanySelect: (companyId: string) => void
  loading?: boolean
}

export default function CompanySelectModal({ isOpen, onClose, onCompanySelect, loading = false }: CompanySelectModalProps) {
  const { user } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [companiesLoading, setCompaniesLoading] = useState(true)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("")

  useEffect(() => {
    const loadCompanies = async () => {
      if (!user || !isOpen) return

      setCompaniesLoading(true)
      try {
        const userCompanies = await getCompanies(user.uid)
        setCompanies(userCompanies)
      } catch (error) {
        console.error("Error loading companies:", error)
      } finally {
        setCompaniesLoading(false)
      }
    }

    loadCompanies()
  }, [user, isOpen])

  const handleSubmit = () => {
    if (selectedCompanyId) {
      onCompanySelect(selectedCompanyId)
    }
  }

  const handleClose = () => {
    setSelectedCompanyId("")
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
              Выберите компанию
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#374151] hover:text-[#E5E7EB]"
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {companiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#3B82F6]" />
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280] font-inter">
                У вас нет созданных компаний.
              </p>
              <p className="text-sm text-[#6B7280] mt-2 font-inter">
                Создайте компанию в разделе "Проекты".
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedCompanyId === company.id
                      ? "bg-[#3B82F6] text-white"
                      : "bg-[#374151] text-[#E5E7EB] hover:bg-[#4B5563]"
                  }`}
                  disabled={loading}
                >
                  <span className="font-inter">{company.name}</span>
                  {selectedCompanyId === company.id && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
              className="flex-1 rounded-lg bg-[#10B981] py-2 text-sm font-medium text-white transition-colors hover:bg-[#059669] disabled:opacity-50 font-inter"
              disabled={loading || !selectedCompanyId || companies.length === 0}
            >
              {loading ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "Принять в компанию"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
