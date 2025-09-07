# Статический мульти‑лендинг (Gulp, SCSS, шаблоны)

Проект — каркас для верстки 4 похожих лендингов, собираемых из общих шаблонов.
Поддерживается live‑reload (BrowserSync), SCSS (mobile‑first), минификация CSS/JS,
оптимизация изображений, html-шаблоны (gulp-file-include), простой слайдер с поддержкой тач‑жестов.

## Требования
- Node.js 16+ (рекомендуется LTS)
- npm 8+ (или совместимый менеджер пакетов)

## Установка
```bash
npm ci
```

## Скрипты
- Запуск разработки с локальным сервером (live-reload):
  ```bash
  npm run dev
  ```
  Откроется сервер BrowserSync, сайт доступен по адресу, указанному в консоли (обычно http://localhost:3000). По умолчанию откроется первый лендинг.

- Сборка production (минификация CSS/JS, оптимизация изображений):
  ```bash
  npm run build
  ```
  Результат появится в папке `dist/` со структурой из 4 папок по количеству лендингов.

- Очистка папки сборки:
  ```bash
  npm run clean
  ```
  
- Запуск линтера:
  ```bash
  npm run linter
  ```

## Структура проекта
```text
project/
├─ gulpfile.js               # Задачи Gulp (styles, scripts, images, html, serve)
├─ landings.config.js        # Конфигурация 4 лендингов (id, картинка хедера, суффикс)
├─ package.json              # Скрипты и dev-зависимости
├─ src/
│  ├─ pages/                 # Страницы (index.html, register.html, paywall.html)
│  ├─ partials/              # Частичные шаблоны (head, header, footer, slider)
│  ├─ scss/                  # Основные стили (main.scss)
│  ├─ js/                    # Скрипты (main.js, слайдер)
│  └─ images/                # Изображения (headers/, slider/ ...)
└─ dist/                     # Сборка (создаётся автоматически)
```

## Многолендинговая сборка
Список лендингов задаётся в `landings.config.js`:
```js
module.exports = [
  { id: 'landing-a', header: 'header1.svg', titleSuffix: 'A' },
  { id: 'landing-b', header: 'header2.svg', titleSuffix: 'B' },
  { id: 'landing-c', header: 'header3.svg', titleSuffix: 'C' },
  { id: 'landing-d', header: 'header4.svg', titleSuffix: 'D' }
];
```
- `id` — имя папки в `dist/` (и стартовый путь на dev-сервере)
- `header` — файл изображения шапки (ищется в `src/images/headers/`)
- `titleSuffix` — суффикс, который подставляется в заголовки/тексты

Во время сборки каждая страница из `src/pages/` рендерится 4 раза — по одному разу под каждый лендинг: `dist/landing-a/...`, `dist/landing-b/...` и т.д.

## Шаблоны
Используется `gulp-file-include` с синтаксисом `@@include` и контекстом. Пример в `src/pages/index.html`:
```html
@@include('../partials/head.html', {"title": "Главная @@titleSuffix"})
@@include('../partials/header.html')
```
Внутри `gulpfile.js` в html-задаче добавляется контекст:
- `landing` — текущий id лендинга
- `headerImage` — путь к картинке хедера
- `titleSuffix` — суффикс для заголовков

## Стили
- Подход mobile‑first
- SCSS компилируется в `assets/css/main.css`
- В production добавляются autoprefixer + минификация (clean-css)

## Скрипты
- `src/js/main.js` содержит минимальный слайдер:
  - свайпы (Pointer/Touch)
  - автопрокрутка, пауза при наведении
  - управление клавиатурой (стрелки)
  - точки‑индикаторы

## Изображения
- Картинки хедеров: `src/images/headers/` (в репозитории есть `header1.svg`, `header2.svg`).
- Слайды: ожидаются в `src/images/slider/` (в шаблоне используются `slide1.svg`, `slide2.svg`, `slide3.svg`).
  Если файлов нет, замените пути или добавьте свои placeholder‑ы.
