'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export default function ImportDataPage() {
  const [userId, setUserId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    if (!userId || !projectId) {
      setError('Пожалуйста, заполните все поля')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/add-table-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, projectId }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Произошла ошибка')
      }
    } catch (err) {
      setError('Ошибка сети или сервера')
      console.error('Import error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Импорт данных из таблицы</CardTitle>
          <CardDescription>
            Добавить 25 человек из таблицы в базу данных Firebase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Введите ID пользователя"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">Project ID</Label>
            <Input
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Введите ID проекта"
            />
          </div>

          <Button
            onClick={handleImport}
            disabled={loading || !userId || !projectId}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Импортирую данные...
              </>
            ) : (
              'Запустить импорт'
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">{result.message}</p>
                  <p>Добавлено записей: {result.count}</p>
                  <details className="mt-2">
                    <summary className="cursor-pointer">Показать детали</summary>
                    <div className="mt-2 text-sm">
                      {result.results?.map((line: string, index: number) => (
                        <div key={index} className="py-1 border-b last:border-b-0">
                          {line}
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Что будет импортировано:</h3>
            <ul className="text-sm space-y-1">
              <li>• 25 человек из таблицы</li>
              <li>• 21 человек в компанию "Грин"</li>
              <li>• 4 человека в компанию "БлэкБокс"</li>
              <li>• Случайные даты рождения (возраст 18-65 лет)</li>
              <li>• Даты обращения: 10.06.2025, 11.06.2025, 12.06.2025</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
