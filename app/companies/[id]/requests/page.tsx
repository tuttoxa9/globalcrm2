"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Building2, Users, Phone, Cake, Check, XCircle, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import BackgroundBlob from "@/components/background-blob"
import { useAuth } from "@/hooks/useAuth"
import { getUnicRequestsByCompanyFlexible, type UnicRequest } from "@/lib/unic-firestore"
import { getCompanies, type Company } from "@/lib/firestore"

export default function CompanyRequestsPage() {
  const { user, loading } = useAuth()
  const { id: companyId } = useParams()
  const router = useRouter()
  const [requests, setRequests] = useState<UnicRequest[]>([])
  const [company, setCompany] = useState<Company | null>(null)
  const [requestsLoading, setRequestsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "accepted" | "rejected" | "new">("all")

  useEffect(() => {
    const loadData = async () => {
      try {
        setRequestsLoading(true)
        if (user && companyId) {
          // Загружаем информацию о компании
          const userCompanies = await getCompanies(user.uid)
          const currentCompany = userCompanies.find(c => c.id === companyId)
          setCompany(currentCompany || null)

          // Загружаем заявки компании
          const companyRequests = await getUnicRequestsByCompanyFlexible(companyId as string, currentCompany?.name)
          setRequests(companyRequests)
        }
      } catch (error) {
        console.error("Error loading company requests:", error)
        setRequests([])
      } finally {
        setRequestsLoading(false)
        setTimeout(() => {
          setIsPageLoading(false)
        }, 300)
      }
    }

    if (!loading) {
      loadData()
    }
  }, [user, loading, companyId])

  const formatBirthDate = (birthDate: string) => {
    if (!birthDate) return ""

    try {
      const [day, month, year] = birthDate.split(".")
      const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
      const today = new Date()
      let age = today.getFullYear() - date.getFullYear()
      const monthDiff = today.getMonth() - date.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age--
      }

      return `${birthDate} (${age} лет)`
    } catch {
      return birthDate
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const filteredRequests = requests.filter(request => {
    if (filter === "all") return true
    return request.status === filter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return Check
      case "rejected":
        return XCircle
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "#10B981"
      case "rejected":
        return "#EF4444"
      default:
        return "#F59E0B"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Принят"
      case "rejected":
        return "Отклонен"
      case "new":
        return "Новый"
      default:
        return "Без ответа"
    }
  }

  const stats = {
    total: requests.length,
    accepted: requests.filter(r => r.status === "accepted").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    new: requests.filter(r => r.status === "new").length,
  }

  if (loading || requestsLoading) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#111827]">
        <BackgroundBlob seed={123} />
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="z-10 text-center"
        >
          <div className="text-lg font-light text-[#E5E7EB] font-montserrat">
            MNG
          </div>
          <div className="mt-2 text-sm text-[#6B7280] font-inter">
            Загрузка заявок...
          </div>
        </motion.div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#111827]">
        <BackgroundBlob seed={123} />
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="z-10 text-center"
        >
          <div className="text-lg font-light text-[#E5E7EB] font-montserrat">
            Компания не найдена
          </div>
          <button
            onClick={() => router.push("/companies")}
            className="mt-4 text-[#3B82F6] hover:text-[#2563EB] font-inter"
          >
            Вернуться к списку компаний
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#111827]">
      <BackgroundBlob seed={123} />

      <motion.div
        initial={{ opacity: 0, filter: "blur(20px)" }}
        animate={{
          opacity: isPageLoading ? 0 : 1,
          filter: isPageLoading ? "blur(20px)" : "blur(0px)",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* Header */}
        <motion.header
          className="flex items-center justify-between px-6 py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/companies")}
              className="flex items-center gap-2 text-[#6B7280] transition-colors hover:text-[#E5E7EB]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-inter text-sm">Компании</span>
            </button>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#3B82F6]" />
              <div className="text-lg font-light text-[#E5E7EB] font-montserrat">
                {company.name} - Заявки
              </div>
            </div>
          </div>
        </motion.header>

        {/* Stats */}
        <motion.div
          className="mx-6 mb-6 grid grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="rounded-xl bg-[#1F2937] p-4 text-center">
            <div className="text-2xl font-bold text-[#E5E7EB] font-inter">{stats.total}</div>
            <div className="text-sm text-[#6B7280] font-inter">Всего</div>
          </div>
          <div className="rounded-xl bg-[#1F2937] p-4 text-center">
            <div className="text-2xl font-bold text-[#10B981] font-inter">{stats.accepted}</div>
            <div className="text-sm text-[#6B7280] font-inter">Принято</div>
          </div>
          <div className="rounded-xl bg-[#1F2937] p-4 text-center">
            <div className="text-2xl font-bold text-[#EF4444] font-inter">{stats.rejected}</div>
            <div className="text-sm text-[#6B7280] font-inter">Отклонено</div>
          </div>
          <div className="rounded-xl bg-[#1F2937] p-4 text-center">
            <div className="text-2xl font-bold text-[#F59E0B] font-inter">{stats.new}</div>
            <div className="text-sm text-[#6B7280] font-inter">Новые</div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="mx-6 mb-6 flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {[
            { key: "all", label: "Все", count: stats.total },
            { key: "new", label: "Новые", count: stats.new },
            { key: "accepted", label: "Принятые", count: stats.accepted },
            { key: "rejected", label: "Отклоненные", count: stats.rejected },
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as "all" | "accepted" | "rejected" | "new")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors font-inter ${
                filter === filterOption.key
                  ? "bg-[#3B82F6] text-white"
                  : "bg-[#374151] text-[#D1D5DB] hover:bg-[#4B5563]"
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </motion.div>

        {/* Requests List */}
        <div className="px-6 pb-6">
          {filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map((request, index) => {
                const StatusIcon = getStatusIcon(request.status)
                const statusColor = getStatusColor(request.status)

                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    className="relative rounded-xl bg-[#1F2937] p-6 border border-[#374151]"
                  >
                    {/* Status Bar */}
                    <div
                      className="absolute left-0 top-0 h-1 w-full rounded-t-xl"
                      style={{ backgroundColor: statusColor }}
                    />

                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <StatusIcon className="h-5 w-5" style={{ color: statusColor }} />
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${statusColor}20`,
                              color: statusColor,
                            }}
                          >
                            {getStatusText(request.status)}
                          </span>
                          <span className="text-xs text-[#6B7280] font-inter">
                            ID: {request.id.slice(-6)}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="text-lg font-semibold text-[#E5E7EB] mb-3 font-inter">
                          {request.fullName}
                        </h3>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-sm text-[#CBD5E0]">
                            <Phone className="h-4 w-4 flex-shrink-0 text-[#10B981]" />
                            <span className="font-inter font-medium">{request.phone}</span>
                          </div>

                          {request.birthDate && (
                            <div className="flex items-center gap-2 text-sm text-[#CBD5E0]">
                              <Cake className="h-4 w-4 flex-shrink-0 text-[#F59E0B]" />
                              <span className="font-inter">{formatBirthDate(request.birthDate)}</span>
                            </div>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="text-xs text-[#6B7280] font-inter">
                          Создана: {formatDate(request.createdAt)}
                          {request.updatedAt && request.updatedAt.getTime() !== request.createdAt.getTime() && (
                            <span className="ml-4">
                              Обновлена: {formatDate(request.updatedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <motion.div
              className="text-center text-[#6B7280] font-inter py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Users className="h-12 w-12 mx-auto mb-4 text-[#374151]" />
              <p>
                {filter === "all"
                  ? "У этой компании пока нет заявок"
                  : `Нет ${filter === "accepted" ? "принятых" : filter === "rejected" ? "отклоненных" : "новых"} заявок`}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
