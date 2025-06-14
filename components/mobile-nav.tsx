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
        className="flex items-center justify-center p-2 text-[#6B7280] transition-colors hover:text-[#E5E7EB] sm:hidden"
        aria-label="Открыть меню"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-[#1F2937] shadow-xl sm:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#374151] p-4">
                <div className="text-lg font-light text-[#E5E7EB] font-montserrat">
                  Меню
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[#6B7280] transition-colors hover:text-[#E5E7EB]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="border-b border-[#374151] p-4">
                <div className="text-sm text-[#E5E7EB] font-inter">
                  {user.email}
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col">
                <button
                  onClick={() => {
                    onCompaniesClick()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-3 px-4 py-4 text-left text-[#E5E7EB] transition-colors hover:bg-[#374151] font-inter"
                >
                  <Building2 className="h-5 w-5" />
                  Компании
                </button>

                <button
                  onClick={() => {
                    onCreateCompanyClick()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-3 px-4 py-4 text-left text-[#E5E7EB] transition-colors hover:bg-[#374151] font-inter"
                >
                  <Plus className="h-5 w-5" />
                  Новая компания
                </button>

                <button
                  onClick={() => {
                    onCreateProjectClick()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-3 px-4 py-4 text-left text-[#E5E7EB] transition-colors hover:bg-[#374151] font-inter"
                >
                  <Plus className="h-5 w-5" />
                  Новый проект
                </button>

                <div className="border-t border-[#374151] mt-4">
                  <button
                    onClick={() => {
                      onSignOut()
                      setIsOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-4 text-left text-[#EF4444] transition-colors hover:bg-[#374151] font-inter w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    Выход
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
