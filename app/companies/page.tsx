"use client"

import { motion, AnimatePresence } from "framer-motion"
import { LogOut, Plus, Building2, Edit, Trash2, ArrowLeft, Users } from "lucide-react"
import { useState, useEffect } from "react"
import BackgroundBlob from "@/components/background-blob"
import CreateCompanyModal from "@/components/create-company-modal"
import EditCompanyModal from "@/components/edit-company-modal"
import { useAuth } from "@/hooks/useAuth"
import { signOut } from "@/lib/auth"
import { getCompanies, deleteCompany, type Company } from "@/lib/firestore"
import { getUnicRequestsByCompanyFlexible, getAllUnicRequestsWithCompanyInfo } from "@/lib/unic-firestore"
import { useRouter } from "next/navigation"

export default function CompaniesPage() {
  const { user, loading } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [companiesLoading, setCompaniesLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [requestCounts, setRequestCounts] = useState<Record<string, number>>({})
  const router = useRouter()

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setCompaniesLoading(true)
        if (user) {
          const userCompanies = await getCompanies(user.uid)
          setCompanies(userCompanies)

          // Отладочная информация - получаем все заявки для анализа
          const allRequestsDebug = await getAllUnicRequestsWithCompanyInfo()
          console.log("=== DEBUG: Все заявки в базе ===")
          console.log(allRequestsDebug)
          console.log("=== DEBUG: Компании ===")
          console.log(userCompanies.map(c => ({ id: c.id, name: c.name })))

          // Загружаем количество заявок для каждой компании
          const counts: Record<string, number> = {}
          await Promise.all(
            userCompanies.map(async (company) => {
              const requests = await getUnicRequestsByCompanyFlexible(company.id, company.name)
              console.log(`=== DEBUG: Заявки для компании "${company.name}" (ID: ${company.id}) ===`)
              console.log(requests)
              counts[company.id] = requests.length
            })
          )
          setRequestCounts(counts)
        }
      } catch (error) {
        console.error("Error loading companies:", error)
        setCompanies([])
      } finally {
        setCompaniesLoading(false)
        setTimeout(() => {
          setIsPageLoading(false)
        }, 300)
      }
    }

    if (!loading) {
      loadCompanies()
    }
  }, [user, loading])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleCompanyCreated = async () => {
    if (user) {
      const userCompanies = await getCompanies(user.uid)
      setCompanies(userCompanies)

      // Загружаем количество заявок для каждой компании
      const counts: Record<string, number> = {}
      await Promise.all(
        userCompanies.map(async (company) => {
          const requests = await getUnicRequestsByCompanyFlexible(company.id, company.name)
          counts[company.id] = requests.length
        })
      )
      setRequestCounts(counts)
    }
  }

  const handleCompanyUpdated = async () => {
    if (user) {
      const userCompanies = await getCompanies(user.uid)
      setCompanies(userCompanies)

      // Загружаем количество заявок для каждой компании
      const counts: Record<string, number> = {}
      await Promise.all(
        userCompanies.map(async (company) => {
          const requests = await getUnicRequestsByCompanyFlexible(company.id, company.name)
          counts[company.id] = requests.length
        })
      )
      setRequestCounts(counts)
    }
    setEditingCompany(null)
  }

  const handleDeleteCompany = async (company: Company) => {
    setDeletingCompany(company)
  }

  const confirmDeleteCompany = async () => {
    if (!deletingCompany) return

    const { error } = await deleteCompany(deletingCompany.id)
    if (!error) {
      setCompanies(companies.filter(c => c.id !== deletingCompany.id))
    }
    setDeletingCompany(null)
  }

  if (loading || companiesLoading) {
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
            Загрузка компаний...
          </div>
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
              onClick={() => router.push("/projects")}
              className="flex items-center gap-2 text-[#6B7280] transition-colors hover:text-[#E5E7EB]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-inter text-sm">Проекты</span>
            </button>
            <div className="text-lg font-light text-[#E5E7EB] font-montserrat">
              MNG - Компании
              {user && <span className="ml-2 text-sm text-[#6B7280]">({user.email})</span>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 text-[#6B7280] transition-colors hover:text-[#E5E7EB]"
              >
                <Plus className="h-4 w-4" />
                <span className="font-inter text-sm">Новая компания</span>
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-[#6B7280] transition-colors hover:text-[#E5E7EB]"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-inter text-sm">Выход</span>
            </button>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="px-6 pb-6">
          <motion.h1
            className="mb-6 text-center text-2xl font-light text-[#E5E7EB] font-montserrat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Управление компаниями
          </motion.h1>

          {/* Companies List */}
          {companies.length > 0 ? (
            <div className="mx-auto max-w-4xl space-y-4">
              {companies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  className="flex items-center justify-between rounded-2xl bg-[#1F2937] p-6 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#374151]">
                      <Building2 className="h-6 w-6 text-[#3B82F6]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-[#E5E7EB] font-inter">
                        {company.name}
                      </h3>
                      <p className="text-sm text-[#6B7280] font-inter">
                        Создана: {company.createdAt.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-[#10B981] font-inter mt-1">
                        Всего заявок: {requestCounts[company.id] || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/companies/${company.id}/requests`)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#374151] text-[#6B7280] transition-colors hover:bg-[#4B5563] hover:text-[#E5E7EB]"
                      title="Просмотр заявок"
                    >
                      <Users className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingCompany(company)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#374151] text-[#6B7280] transition-colors hover:bg-[#4B5563] hover:text-[#E5E7EB]"
                      title="Редактировать"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#374151] text-[#6B7280] transition-colors hover:bg-[#DC2626] hover:text-white"
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center text-[#6B7280] font-inter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              У вас пока нет компаний. Создайте первую компанию!
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Create Company Modal */}
      <CreateCompanyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCompanyCreated={handleCompanyCreated}
      />

      {/* Edit Company Modal */}
      {editingCompany && (
        <EditCompanyModal
          isOpen={!!editingCompany}
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onCompanyUpdated={handleCompanyUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setDeletingCompany(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-2xl bg-[#1F2937] p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#DC2626]/20">
                  <Trash2 className="h-6 w-6 text-[#DC2626]" />
                </div>
                <h3 className="text-lg font-medium text-[#E5E7EB] font-inter">
                  Удалить компанию
                </h3>
                <p className="mt-2 text-sm text-[#6B7280] font-inter">
                  Вы уверены, что хотите удалить компанию &ldquo;{deletingCompany.name}&rdquo;? Это действие нельзя отменить.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingCompany(null)}
                  className="flex-1 rounded-lg bg-[#374151] py-2 text-sm font-medium text-[#D1D5DB] transition-colors hover:bg-[#4B5563] font-inter"
                >
                  Отмена
                </button>
                <button
                  onClick={confirmDeleteCompany}
                  className="flex-1 rounded-lg bg-[#DC2626] py-2 text-sm font-medium text-white transition-colors hover:bg-[#B91C1C] font-inter"
                >
                  Удалить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
