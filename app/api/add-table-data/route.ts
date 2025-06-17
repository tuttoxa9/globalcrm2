import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Интерфейсы
interface Company {
  id?: string
  name: string
  userId: string
  createdAt: Date
}

interface Request {
  id?: string
  projectId: string
  title: string
  description: string
  status: "new" | "accepted" | "rejected"
  fullName?: string
  phoneNumber?: string
  birthDate?: Date
  companyId?: string
  createdAt: Date
  updatedAt: Date
}

// Данные из таблицы
const tableData = [
  { id: 1, name: "Кремко Николай Николаевич", phone: "375445381648", date: "10.06.2025", company: "Green" },
  { id: 2, name: "Попков Фёдор Андреевич", phone: "375293291809", date: "10.06.2025", company: "Green" },
  { id: 3, name: "Минин Илья Андреевич", phone: "375291411923", date: "10.06.2025", company: "Green" },
  { id: 4, name: "Трипуз Артём Сергеевич", phone: "375259747804", date: "10.06.2025", company: "Green" },
  { id: 5, name: "Цыркун Роман Иванович", phone: "375447164454", date: "10.06.2025", company: "Green" },
  { id: 6, name: "Сенько Максим Юрьевич", phone: "375255126345", date: "10.06.2025", company: "Green" },
  { id: 7, name: "Далинчук Анна Александровна", phone: "375447153313", date: "11.06.2025", company: "Green" },
  { id: 8, name: "Крат Полина Юрьевна", phone: "375293913114", date: "11.06.2025", company: "Green" },
  { id: 9, name: "Manesa Japasi", phone: "375256683037", date: "11.06.2025", company: "Green" },
  { id: 10, name: "Далинчук Анна Александровна", phone: "375447153313", date: "11.06.2025", company: "Green" },
  { id: 11, name: "Лученок Андрей Александрович", phone: "375292029462", date: "11.06.2025", company: "Green" },
  { id: 12, name: "Гладковский Владислав Витальевич", phone: "375292615618", date: "11.06.2025", company: "Green" },
  { id: 13, name: "Борозенников Егор Максимович", phone: "375447507515", date: "11.06.2025", company: "Green" },
  { id: 14, name: "Солодышев Иван Сергеевич", phone: "375295580713", date: "11.06.2025", company: "Green" },
  { id: 15, name: "Калачинский Матвей Игоревич", phone: "375293651135", date: "11.06.2025", company: "Green" },
  { id: 16, name: "Ильюшин Арсений Дмитриевич", phone: "375296505073", date: "11.06.2025", company: "Green" },
  { id: 17, name: "Станюленис Андрей", phone: "375447611983", date: "12.06.2025", company: "Black Box" },
  { id: 18, name: "Зданевич Артём Игоревич", phone: "375333624119", date: "12.06.2025", company: "Green" },
  { id: 19, name: "Лапко Тимофей Андреевич", phone: "375291425198", date: "12.06.2025", company: "Green" },
  { id: 20, name: "Зеленкевич Максим Матвеевич", phone: "375297859874", date: "12.06.2025", company: "Green" },
  { id: 21, name: "Липик Артём Геннадьевич", phone: "375336709596", date: "12.06.2025", company: "Green" },
  { id: 22, name: "Дударевич Денис Русланович", phone: "375333826912", date: "12.06.2025", company: "Black Box" },
  { id: 23, name: "Колякин Даниил Иванович", phone: "375292227345", date: "12.06.2025", company: "Black Box" },
  { id: 24, name: "Куприенко Михаил Александрович", phone: "375257659240", date: "12.06.2025", company: "Black Box" },
  { id: 25, name: "Невский Степан Игоревич", phone: "375444726946", date: "12.06.2025", company: "Black Box" }
]

// Функция генерации случайной даты рождения (возраст от 18 до 65 лет)
function generateRandomBirthDate(): Date {
  const today = new Date()
  const minAge = 18
  const maxAge = 65

  const birthYear = today.getFullYear() - Math.floor(Math.random() * (maxAge - minAge + 1)) - minAge
  const birthMonth = Math.floor(Math.random() * 12)
  const birthDay = Math.floor(Math.random() * 28) + 1 // До 28 дня, чтобы избежать проблем с февралем

  return new Date(birthYear, birthMonth, birthDay)
}

// Функция парсинга даты
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.')
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}

// Функция поиска или создания компании
async function findOrCreateCompany(companyName: string, userId: string): Promise<string> {
  const companiesRef = collection(db, 'companies')
  const q = query(companiesRef, where('name', '==', companyName), where('userId', '==', userId))
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].id
  }

  // Создаём новую компанию
  const newCompany: Omit<Company, 'id'> = {
    name: companyName,
    userId: userId,
    createdAt: new Date()
  }

  const docRef = await addDoc(companiesRef, newCompany)
  console.log(`Создана компания "${companyName}" с ID: ${docRef.id}`)
  return docRef.id
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, projectId } = body

    if (!userId || !projectId) {
      return NextResponse.json(
        { error: 'userId и projectId обязательны' },
        { status: 400 }
      )
    }

    const results = []

    // Создаём компании если их нет
    const greenCompanyId = await findOrCreateCompany('Грин', userId)
    const blackBoxCompanyId = await findOrCreateCompany('БлэкБокс', userId)

    results.push(`ID компании "Грин": ${greenCompanyId}`)
    results.push(`ID компании "БлэкБокс": ${blackBoxCompanyId}`)

    // Добавляем запросы для каждого человека
    for (const person of tableData) {
      const companyId = person.company === 'Green' ? greenCompanyId : blackBoxCompanyId
      const createdAt = parseDate(person.date)

      const request: Omit<Request, 'id'> = {
        projectId: projectId,
        title: `Заявка от ${person.name}`,
        description: `Заявка от ${person.name}, телефон: ${person.phone}`,
        status: 'new',
        fullName: person.name,
        phoneNumber: person.phone,
        birthDate: generateRandomBirthDate(),
        companyId: companyId,
        createdAt: createdAt,
        updatedAt: createdAt
      }

      const docRef = await addDoc(collection(db, 'requests'), request)
      results.push(`Добавлен запрос для ${person.name} с ID: ${docRef.id}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Все данные успешно добавлены в базу данных!',
      results: results,
      count: tableData.length
    })

  } catch (error) {
    console.error('Ошибка при добавлении данных:', error)
    return NextResponse.json(
      { error: 'Ошибка при добавлении данных', details: error },
      { status: 500 }
    )
  }
}
