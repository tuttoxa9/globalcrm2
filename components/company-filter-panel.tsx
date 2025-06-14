"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Building2, Search, Download, FileSpreadsheet } from "lucide-react"
import { getCompanies, getRequestsByCompany, type Company, type Request } from "@/lib/firestore"
import { useAuth } from "@/hooks/useAuth"
import * as XLSX from "xlsx"

interface CompanyFilterPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function CompanyFilterPanel({ isOpen, onClose }: CompanyFilterPanelProps) {
  const { user } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [companyRequests, setCompanyRequests] = useState<Request[]>([])
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [requestsLoading, setRequestsLoading] = useState(false)

  useEffect(() => {
    const loadCompanies = async () => {
      if (!user || !isOpen) return

      setLoading(true)
      try {
        const userCompanies = await getCompanies(user.uid)
        setCompanies(userCompanies)
      } catch (error) {
        console.error("Error loading companies:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCompanies()
  }, [user, isOpen])

  useEffect(() => {
    const loadCompanyRequests = async () => {
      if (!selectedCompany) {
        setCompanyRequests([])
        setFilteredRequests([])
        return
      }

      setRequestsLoading(true)
      try {
        const requests = await getRequestsByCompany(selectedCompany.id)
        setCompanyRequests(requests)
        setFilteredRequests(requests)
      } catch (error) {
        console.error("Error loading company requests:", error)
      } finally {
        setRequestsLoading(false)
      }
    }

    loadCompanyRequests()
  }, [selectedCompany])

  useEffect(() => {
    if (!searchQuery) {
      setFilteredRequests(companyRequests)
      return
    }

    const filtered = companyRequests.filter(request =>
      request.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.phoneNumber?.includes(searchQuery) ||
      request.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredRequests(filtered)
  }, [searchQuery, companyRequests])

  const handleExportToExcel = () => {
    if (!selectedCompany || filteredRequests.length === 0) return

    const workbook = XLSX.utils.book_new()

    const data = filteredRequests.map(request => ({
      "Заголовок": request.title || "",
      "ФИО": request.fullName || "",
      "Телефон": request.phoneNumber || "",
      "Дата рождения": request.birthDate ? new Intl.DateTimeFormat("ru-RU").format(request.birthDate) : "",
      "Описание": request.description || "",
      "Статус": request.status === "new" ? "Новая" :
                request.status === "accepted" ? "Принята" : "Отклонена",
      "Дата создания": new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(request.createdAt)
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet, "Заявки")

    const fileName = `${selectedCompany.name}_заявки_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-[#3B82F6]"
      case "accepted": return "bg-[#10B981]"
      case "rejected": return "bg-[#EF4444]"
      default: return "bg-[#6B7280]"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "new": return "Новая"
      case "accepted": return "Принята"
      case "rejected": return "Отклонена"
      default: return "Неизвестно"
    }
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
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-96 bg-[#1F2937] shadow-xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#374151] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#374151]">
                    <Building2 className="h-5 w-5 text-[#3B82F6]" />
                  </div>
                  <h2 className="text-lg font-medium text-[#E5E7EB] font-inter">
                    Заявки по компаниям
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#374151] hover:text-[#E5E7EB]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-[#6B7280] font-inter">Загрузка компаний...</div>
                  </div>
                ) : companies.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Building2 className="mx-auto h-12 w-12 text-[#6B7280] mb-4" />
                      <p className="text-[#6B7280] font-inter">Нет созданных компаний</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col">
                    {/* Companies List */}
                    {!selectedCompany && (
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-[#D1D5DB] mb-3">
                          Выберите компанию:
                        </h3>
                        <div className="space-y-2">
                          {companies.map((company) => (
                            <button
                              key={company.id}
                              onClick={() => setSelectedCompany(company)}
                              className="w-full text-left p-3 rounded-lg bg-[#374151] text-[#E5E7EB] hover:bg-[#4B5563] transition-colors"
                            >
                              <div className="font-medium">{company.name}</div>
                              <div className="text-xs text-[#9CA3AF] mt-1">
                                Создана: {formatDate(company.createdAt)}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected Company View */}
                    {selectedCompany && (
                      <div className="flex-1 flex flex-col">
                        {/* Company Header */}
                        <div className="p-4 border-b border-[#374151]">
                          <div className="flex items-center justify-between mb-3">
                            <button
                              onClick={() => setSelectedCompany(null)}
                              className="text-[#3B82F6] text-sm font-inter hover:text-[#2563EB]"
                            >
                              ← Назад к компаниям
                            </button>
                            <button
                              onClick={handleExportToExcel}
                              disabled={filteredRequests.length === 0}
                              className="flex items-center gap-1 text-xs bg-[#10B981] text-white px-2 py-1 rounded hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FileSpreadsheet className="h-3 w-3" />
                              Excel
                            </button>
                          </div>
                          <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">
                            {selectedCompany.name}
                          </h3>
                          <div className="text-sm text-[#9CA3AF]">
                            Всего заявок: {companyRequests.length}
                          </div>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-[#374151]">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Поиск заявок..."
                              className="w-full pl-10 pr-3 py-2 bg-[#374151] text-[#E5E7EB] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]"
                            />
                          </div>
                        </div>

                        {/* Requests List */}
                        <div className="flex-1 overflow-y-auto p-4">
                          {requestsLoading ? (
                            <div className="text-center text-[#6B7280] py-8">
                              Загрузка заявок...
                            </div>
                          ) : filteredRequests.length === 0 ? (
                            <div className="text-center text-[#6B7280] py-8">
                              {searchQuery ? "Заявки не найдены" : "Нет заявок"}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {filteredRequests.map((request) => (
                                <div
                                  key={request.id}
                                  className="bg-[#374151] rounded-lg p-3"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="text-sm font-medium text-[#E5E7EB] line-clamp-1">
                                      {request.title}
                                    </h4>
                                    <span className={`px-2 py-1 text-xs rounded text-white ${getStatusColor(request.status)}`}>
                                      {getStatusText(request.status)}
                                    </span>
                                  </div>

                                  {request.fullName && (
                                    <div className="text-sm text-[#CBD5E0] mb-1">
                                      {request.fullName}
                                    </div>
                                  )}

                                  {request.phoneNumber && (
                                    <div className="text-sm text-[#9CA3AF] mb-1">
                                      {request.phoneNumber}
                                    </div>
                                  )}

                                  <div className="text-xs text-[#6B7280]">
                                    {formatDate(request.createdAt)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
