"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Building2, Plus, LogOut } from "lucide-react"
import type { User } from "firebase/auth"

interface MobileNavProps {
  user: User | null
  onCompaniesClick: () => void
  onCreateCompanyClick: () => void
  onCreateProjectClick: () => void
  onSignOut: () => void
}

export default function MobileNav({
  user,
  onCompaniesClick,
  onCreateCompanyClick,
  onCreateProjectClick,
  onSignOut,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  if (!user) return null

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center p-3 text-[#6B7280] transition-colors hover:text-[#E5E7EB] sm:hidden rounded-lg active:bg-[#374151]"
        aria-label="Открыть меню"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 h-full w-72 max-w-[80vw] bg-[#1F2937] shadow-2xl sm:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#374151] p-4">
                <div className="text-lg font-light text-[#E5E7EB] font-montserrat">
                  Меню
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[#6B7280] transition-colors hover:text-[#E5E7EB] rounded-lg active:bg-[#374151]"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* User Info */}
              <div className="border-b border-[#374151] p-4">
                <div className="text-sm text-[#E5E7EB] font-inter truncate">
                  {user.email}
                </div>
                <div className="text-xs text-[#9CA3AF] font-inter mt-1">
                  Вы вошли в систему
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col py-2">
                <button
                  onClick={() => {
                    onCompaniesClick()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-4 px-6 py-4 text-left text-[#E5E7EB] transition-colors hover:bg-[#374151] active:bg-[#4A5568] font-inter"
                >
                  <Building2 className="h-5 w-5 text-[#9CA3AF]" />
                  <span>Компании</span>
                </button>

                <button
                  onClick={() => {
                    onCreateCompanyClick()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-4 px-6 py-4 text-left text-[#E5E7EB] transition-colors hover:bg-[#374151] active:bg-[#4A5568] font-inter"
                >
                  <Plus className="h-5 w-5 text-[#9CA3AF]" />
                  <span>Новая компания</span>
                </button>

                <button
                  onClick={() => {
                    onCreateProjectClick()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-4 px-6 py-4 text-left text-[#E5E7EB] transition-colors hover:bg-[#374151] active:bg-[#4A5568] font-inter"
                >
                  <Plus className="h-5 w-5 text-[#9CA3AF]" />
                  <span>Новый проект</span>
                </button>

                <div className="border-t border-[#374151] mt-2 pt-2">
                  <button
                    onClick={() => {
                      onSignOut()
                      setIsOpen(false)
                    }}
                    className="flex items-center gap-4 px-6 py-4 text-left text-[#EF4444] transition-colors hover:bg-[#374151] active:bg-[#4A5568] font-inter w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Выход</span>
                  </button>
                </div>
              </div>

              {/* Bottom spacing for safe area */}
              <div className="h-8"></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
