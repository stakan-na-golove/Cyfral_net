# Инструкция по деплою сайта Lil Cyfral

## 1. Подготовка файлов

Положи свою папку `Cyfral-site` (со всеми mp3, jpg, png) в папку `public/`:

```
проект/
├── public/
│   └── Cyfral-site/          ← СЮДА кладёшь свою папку
│       ├── Cyfral-ava.jpg
│       ├── Logo_sverhu.png
│       ├── podcast.mp3
│       ├── logo_stream_services/
│       │   ├── icons8-яндекс-музыка-новый-96.png
│       │   └── Spotify_Primary_Logo_RGB_Green.png
│       ├── демки/
│       │   ├── babos.mp3
│       │   ├── BABY INTALENGENCE.mp3
│       │   └── ... (все остальные демки)
│       └── Треки+обложки/
│           ├── Auchan/
│           │   ├── Ашан.jpg
│           │   └── Auchan.mp3
│           ├── FL diss/
│           ├── FL STUDIO DISS/
│           ├── MOLODES'H CYPHER 2/
│           ├── Ашан-монстры/
│           ├── Дерьмо/
│           ├── Лига АШАНного интернета/
│           └── Lil Cyfral$i$/
│               ├── Lil Cyfral$i$.jpg
│               └── Lil Cyfral$i$.mp3
```

## 2. Сборка

```bash
npm install
npm run build
```

После сборки в папке `dist/` будет:
- `index.html` — собранный сайт
- `Cyfral-site/` — все медиафайлы (автокопия из `public/`)

## 3. Деплой на Netlify

### Вариант A: Drag & Drop
1. Открой https://app.netlify.com
2. Перетащи **папку `dist/`** в зону загрузки
3. Готово!

### Вариант B: Через Git (GitHub/GitLab)
1. Запуши проект в репозиторий
2. Подключи репозиторий к Netlify
3. Настрой:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. ⚠️ **ВАЖНО:** Файлы в `public/Cyfral-site/` могут быть слишком большими для Git. Используй Git LFS или Вариант A.

### Вариант C: Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## Альтернативные хостинги

### Vercel
```bash
npm install -g vercel
vercel --prod
```
Всё из `public/` автоматически попадёт в деплой.

### GitHub Pages
1. `npm run build`
2. Загрузи содержимое `dist/` в ветку `gh-pages`

## Проблемы с кириллицей в именах файлов

Если на хостинге не грузятся файлы с русскими именами (демки, обложки):
- Переименуй файлы в латиницу
- Обнови пути в `src/App.tsx`
- Пересобери
