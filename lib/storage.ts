// Утилита для безопасного сохранения учетных данных
const STORAGE_KEY = 'crm_auth_credentials'
const REMEMBER_KEY = 'crm_remember_me'

// Простое кодирование для базовой безопасности (не для критичных данных!)
const encode = (data: string): string => {
  return btoa(data)
}

const decode = (data: string): string => {
  try {
    return atob(data)
  } catch {
    return ''
  }
}

export interface StoredCredentials {
  email: string
  password: string
  timestamp: number
}

export const saveCredentials = (email: string, password: string, remember: boolean): void => {
  if (!remember) {
    clearCredentials()
    return
  }

  try {
    const credentials: StoredCredentials = {
      email,
      password,
      timestamp: Date.now()
    }

    const encoded = encode(JSON.stringify(credentials))
    localStorage.setItem(STORAGE_KEY, encoded)
    localStorage.setItem(REMEMBER_KEY, 'true')
  } catch (error) {
    console.warn('Не удалось сохранить учетные данные:', error)
  }
}

export const getStoredCredentials = (): StoredCredentials | null => {
  try {
    const rememberMe = localStorage.getItem(REMEMBER_KEY)
    if (rememberMe !== 'true') {
      return null
    }

    const encoded = localStorage.getItem(STORAGE_KEY)
    if (!encoded) {
      return null
    }

    const decoded = decode(encoded)
    const credentials: StoredCredentials = JSON.parse(decoded)

    // Проверяем, что данные не старше 30 дней
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    if (credentials.timestamp < thirtyDaysAgo) {
      clearCredentials()
      return null
    }

    return credentials
  } catch (error) {
    console.warn('Не удалось получить сохраненные учетные данные:', error)
    clearCredentials()
    return null
  }
}

export const clearCredentials = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(REMEMBER_KEY)
  } catch (error) {
    console.warn('Не удалось очистить учетные данные:', error)
  }
}

export const isRememberMeEnabled = (): boolean => {
  try {
    return localStorage.getItem(REMEMBER_KEY) === 'true'
  } catch {
    return false
  }
}
