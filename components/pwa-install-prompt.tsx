"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, X, Smartphone } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Проверяем, установлено ли уже приложение
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        return
      }

      // Для iOS
      if ((window.navigator as any).standalone === true) {
        setIsInstalled(true)
        return
      }
    }

    checkIfInstalled()

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Показываем промпт через 3 секунды после загрузки
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true)
        }
      }, 3000)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      console.log('PWA успешно установлено!')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice

    if (choiceResult.outcome === 'accepted') {
      console.log('Пользователь согласился установить PWA')
    } else {
      console.log('Пользователь отклонил установку PWA')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Не показываем снова в течение сессии
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }
  }

  // Не показываем, если уже установлено или пользователь уже отклонил
  if (isInstalled || (typeof window !== 'undefined' && sessionStorage.getItem('pwa-prompt-dismissed'))) {
    return null
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Install Prompt */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
          >
            <div className="rounded-xl bg-[#1F2937] border border-[#374151] p-4 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3B82F6]">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[#E5E7EB] mb-1">
                    Установить Global CRM
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mb-3">
                    Добавьте приложение на главный экран для быстрого доступа и работы оффлайн
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={handleInstallClick}
                      className="flex items-center gap-1 rounded-lg bg-[#3B82F6] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2563EB]"
                    >
                      <Download className="h-3 w-3" />
                      Установить
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="rounded-lg bg-[#374151] px-3 py-2 text-xs font-medium text-[#D1D5DB] transition-colors hover:bg-[#4B5563]"
                    >
                      Позже
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDismiss}
                  className="flex h-6 w-6 items-center justify-center rounded text-[#6B7280] transition-colors hover:text-[#E5E7EB]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
