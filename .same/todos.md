# Задачи по исправлению отображения заявок в компаниях

## Основная проблема
Заявки не отображаются в списке компаний ВНУТРИ выбранного проекта из-за ошибок Firebase индексов и неправильной связи между заявками и компаниями.

## TODO:
- [x] Изучить текущий код lib/unic-firestore.ts
- [x] Проверить функцию getUnicRequestsByCompanyFlexible
- [x] Найти компонент кнопки "Компании" внутри проекта (company-filter-panel.tsx)
- [x] Исправить отображение заявок в компонентах проекта
- [x] Убрать orderBy из Firebase запросов
- [x] Добавить клиентскую сортировку
- [x] Добавить счетчики заявок
- [x] Протестировать исправления
- [ ] in_progress Сделать commit и push в git

## Ключевые файлы для проверки:
- lib/unic-firestore.ts
- app/projects/[id]/page.tsx (основная страница проекта)
- components/company-select-modal.tsx
- components/company-filter-panel.tsx
