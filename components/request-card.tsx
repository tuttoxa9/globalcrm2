"use client"

import { useState } from "react"
import { Calendar, MessageCircle, Phone, Check, X, PhoneOff, User, Building2 } from "lucide-react"
import { type Request } from "@/lib/firestore"
import CompanySelectModal from "./company-select-modal"

interface RequestCardProps {
  request: Request
  columnColor: string
  onStatusChange: (requestId: string, newStatus: "new" | "accepted" | "rejected", companyId?: string) => void
}

export default function RequestCard({ request, columnColor, onStatusChange }: RequestCardProps) {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [acceptLoading, setAcceptLoading] = useState(false)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleAccept = () => {
    if (request.status === "new") {
      // Если заявка новая, сначала показываем выбор компании
      setIsCompanyModalOpen(true)
    } else {
      // Если заявка уже принята, просто меняем статус
      onStatusChange(request.id, "accepted")
    }
  }

  const handleCompanySelect = async (companyId: string) => {
    setAcceptLoading(true)
    try {
      await onStatusChange(request.id, "accepted", companyId)
    } finally {
      setAcceptLoading(false)
      setIsCompanyModalOpen(false)
    }
  }

  const handleReject = () => {
    onStatusChange(request.id, "rejected")
  }

  const handleNoAnswer = () => {
    // Логика для "не дозвонились"
    console.log(`No answer for request ${request.id}`)
  }

  return (
    <div className="group relative rounded-lg bg-[#4A5568] shadow-sm transition-all duration-200">
      {/* Status Color Bar */}
      <div
        className="absolute left-0 top-0 h-1 w-full rounded-t-lg"
        style={{ backgroundColor: columnColor }}
      />

      {/* Card Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="mb-1 text-sm font-medium text-[#E5E7EB] font-inter line-clamp-1">{request.title}</h3>

        {/* Full Name (if available) */}
        {request.fullName && (
          <div className="mb-2 flex items-center gap-1 text-xs text-[#CBD5E0]">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="font-inter truncate">{request.fullName}</span>
          </div>
        )}

        {/* Phone and Date */}
        <div className="mb-2 flex flex-col space-y-1">
          {request.phoneNumber && (
            <div className="flex items-center gap-1 text-xs text-[#CBD5E0]">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span className="font-inter truncate">{request.phoneNumber}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-[#CBD5E0]">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="font-inter">{formatDate(request.createdAt)}</span>
          </div>
        </div>

        {/* Birth Date (if available) */}
        {request.birthDate && (
          <div className="mb-2 flex items-center gap-1 text-xs text-[#A0AEC0]">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="font-inter">
              Дата рождения: {new Intl.DateTimeFormat("ru-RU").format(request.birthDate)}
            </span>
          </div>
        )}

        {/* Description */}
        {request.description && (
          <div className="mb-2 flex items-start gap-1 text-xs text-[#A0AEC0]">
            <MessageCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
            <p className="font-inter leading-relaxed line-clamp-2">{request.description}</p>
          </div>
        )}

        {/* Company (if assigned) */}
        {request.companyId && request.status === "accepted" && (
          <div className="mb-2 flex items-center gap-1 text-xs text-[#10B981]">
            <Building2 className="h-3 w-3 flex-shrink-0" />
            <span className="font-inter">Назначено в компанию</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">

          <div className="flex gap-1">
            <button
              onClick={handleAccept}
              className="flex h-6 w-6 items-center justify-center rounded-md bg-[#10B981] text-white transition-all hover:bg-[#059669]"
              title="Принять"
            >
              <Check className="h-3 w-3" />
            </button>

            <button
              onClick={handleReject}
              className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EF4444] text-white transition-all hover:bg-[#DC2626]"
              title="Отказать"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={handleNoAnswer}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F59E0B] text-white transition-all hover:bg-[#D97706]"
            title="Не дозвонились"
          >
            <PhoneOff className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Company Selection Modal */}
      <CompanySelectModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onCompanySelect={handleCompanySelect}
        loading={acceptLoading}
      />
    </div>
  )
}
