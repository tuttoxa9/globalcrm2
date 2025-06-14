"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Loader2 } from "lucide-react"
import BackgroundBlob from "@/components/background-blob"
import { cn } from "@/lib/utils"
import { signIn } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { saveCredentials, getStoredCredentials, clearCredentials, isRememberMeEnabled } from "@/lib/storage"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()

  // Загружаем сохраненные учетные данные при монтировании компонента
  useEffect(() => {
    const storedCredentials = getStoredCredentials()
    if (storedCredentials) {
      setEmail(storedCredentials.email)
      setPassword(storedCredentials.password)
      setRememberMe(true)
    } else {
      setRememberMe(isRememberMeEnabled())
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { user, error: authError } = await signIn(email, password)

    if (user) {
      // Сохраняем учетные данные, если пользователь выбрал "Запомнить меня"
      saveCredentials(email, password, rememberMe)

      setIsTransitioning(true)
      // Быстрый переход
      setTimeout(() => {
        router.push("/projects")
      }, 1000)
    } else {
      setError(authError || "Ошибка входа")
      setLoading(false)
    }
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#111827]">
      <BackgroundBlob seed={123} /> {/* Фиксированный seed для синхронизации с другими страницами */}
      <AnimatePresence>
        {!isTransitioning ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
            className="z-10 flex flex-col items-center"
          >
            <motion.h1
              className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-light tracking-wider text-[#E5E7EB] font-montserrat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              MNG
            </motion.h1>

            <motion.div
              className={cn("w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#1F2937] p-6 sm:p-8 shadow-lg mx-4", error && "animate-shake")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        "h-12 sm:h-11 w-full rounded-lg bg-[#374151] pl-10 pr-3 text-[#E5E7EB] outline-none transition-all duration-200 font-inter text-base sm:text-sm",
                        "focus:shadow-[0_0_0_2px_rgba(59,130,246,0.5)]",
                        error && "shadow-[0_0_0_2px_rgba(239,68,68,0.5)]",
                      )}
                      placeholder="Электронная почта"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "h-12 sm:h-11 w-full rounded-lg bg-[#374151] pl-10 pr-3 text-[#E5E7EB] outline-none transition-all duration-200 font-inter text-base sm:text-sm",
                        "focus:shadow-[0_0_0_2px_rgba(59,130,246,0.5)]",
                        error && "shadow-[0_0_0_2px_rgba(239,68,68,0.5)]",
                      )}
                      placeholder="Пароль"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-[#6B7280] bg-[#374151] text-[#3B82F6] focus:ring-[#3B82F6] focus:ring-offset-0"
                    />
                    <span className="text-sm text-[#E5E7EB] font-inter">Запомнить меня</span>
                  </label>
                </div>

                {error && <div className="text-center text-sm text-[#EF4444] font-inter">{error}</div>}

                <motion.button
                  type="submit"
                  className="relative h-12 sm:h-11 w-full rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-[#E5E7EB] transition-all duration-200 hover:translate-y-[-1px] hover:shadow-md font-inter font-medium disabled:opacity-50 text-base sm:text-sm"
                  whileHover={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                    transition: { duration: 0.8, ease: "easeInOut" },
                  }}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin text-white" /> : "Войти"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-10 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
