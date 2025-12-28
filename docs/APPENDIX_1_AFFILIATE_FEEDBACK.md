# Приложение 1: Система Партнёрской Обратной Связи и Автоматической Компиляции Контента

## 📋 Статус Документа

**Тип:** Приложение к основной документации
**Версия:** 1.0
**Дата:** 2024-12-28
**Связанные документы:**
- [VERSIONING_SYSTEM.md](VERSIONING_SYSTEM.md)
- [PLUGIN_ANCHOR_SYSTEM.md](PLUGIN_ANCHOR_SYSTEM.md)

---

## 🎯 Концепция: Двунаправленный Поток Контента

### Основная Идея

Создание **экосистемы контента** с двунаправленным потоком информации между партнёрскими страницами и главным каталогом, где отзывы пользователей автоматически компилируются в статьи свободной энциклопедии.

```
┌─────────────────────────────────────────────────────┐
│         СТРАНИЦЫ ПАРТНЁРОВ (Affiliate)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Отель А  │  │ Авиа Б   │  │ Ресторан │         │
│  │ + отзывы │  │ + отзывы │  │ + отзывы │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
         ↓ ↓ ↓           ↑ ↑ ↑
    Отзывы вниз    Статьи вверх
         ↓ ↓ ↓           ↑ ↑ ↑
┌─────────────────────────────────────────────────────┐
│      ГЛАВНАЯ СТРАНИЦА (Свободная Энциклопедия)      │
│                                                     │
│  [Экстрактор Цитат] → [Каталог Цитат] →            │
│  → [Компилятор Статей] → [Статья Википедии]        │
│                                                     │
│  Статья: "Венеция - Город на Воде"                 │
│  ├─ Раздел 1: История (из Википедии)               │
│  ├─ Раздел 2: Достопримечательности (компиляция)   │
│  │   ├─ Цитата 1 (из отзыва партнёра А)           │
│  │   ├─ Цитата 2 (из отзыва партнёра Б)           │
│  │   └─ Цитата 3 (из отзыва партнёра В)           │
│  └─ Раздел 3: Отзывы туристов (агрегация)         │
└─────────────────────────────────────────────────────┘
         ↓
    Обновлённая статья публикуется
         ↓
    Партнёры получают виджет со статьёй
```

---

## 💼 Партнёрская Программа (Affiliate System)

### Принцип Работы

**Партнёр** - это внешний сервис (отель, авиакомпания, ресторан), который:
1. Размещает контент в каталоге
2. Получает комиссию за продажи
3. **Предоставляет отзывы** пользователей
4. **Получает обратно** обогащённый контент (статьи)

### Схема Партнёра

```javascript
const PartnerSchema = new mongoose.Schema({
  // Основная информация
  partnerId: {
    type: String,
    unique: true,
    required: true
    // Формат: "PARTNER-{TYPE}-{NUMBER}"
    // Пример: "PARTNER-HOTEL-001"
  },

  name: String,                    // "Отель Венеция"
  type: {
    type: String,
    enum: ['hotel', 'airline', 'restaurant', 'tour', 'attraction'],
    required: true
  },

  // Контактная информация
  contact: {
    website: String,
    email: String,
    phone: String,
    address: String
  },

  // Партнёрская программа
  affiliate: {
    commissionRate: Number,        // 5% комиссии
    trackingCode: String,          // Уникальный код отслеживания
    totalSales: Number,            // Общая сумма продаж
    totalCommission: Number,       // Общая комиссия
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended'],
      default: 'pending'
    }
  },

  // API для отзывов
  reviewsAPI: {
    endpoint: String,              // URL для получения отзывов
    format: String,                // json, xml, rss
    updateFrequency: Number,       // Частота обновления (мс)
    lastSync: Date                 // Последняя синхронизация
  },

  // Статистика
  stats: {
    totalReviews: Number,          // Всего отзывов
    quotesExtracted: Number,       // Извлечено цитат
    articlesCreated: Number        // Создано статей
  },

  // Настройки обратной связи
  feedback: {
    receiveArticles: Boolean,      // Получать скомпилированные статьи
    displayWidget: Boolean,        // Показывать виджет со статьями
    autoPublish: Boolean           // Автопубликация отзывов
  }
});
```

### Пример Партнёра

```javascript
{
  partnerId: "PARTNER-HOTEL-001",
  name: "Grand Hotel Venezia",
  type: "hotel",

  contact: {
    website: "https://grand-hotel-venezia.com",
    email: "info@grand-hotel-venezia.com"
  },

  affiliate: {
    commissionRate: 5,             // 5%
    trackingCode: "VEN-GH-12345",
    totalSales: 125000,            // €125,000
    totalCommission: 6250,         // €6,250
    status: "active"
  },

  reviewsAPI: {
    endpoint: "https://grand-hotel-venezia.com/api/reviews",
    format: "json",
    updateFrequency: 3600000,      // 1 час
    lastSync: "2024-12-28T10:00:00Z"
  },

  stats: {
    totalReviews: 1547,
    quotesExtracted: 342,
    articlesCreated: 12
  },

  feedback: {
    receiveArticles: true,
    displayWidget: true,
    autoPublish: true
  }
}
```

---

## 💬 Система Отзывов с Двунаправленным Потоком

### Схема Отзыва

```javascript
const ReviewSchema = new mongoose.Schema({
  reviewId: String,                // Уникальный ID

  // Источник
  source: {
    partnerId: String,             // ID партнёра
    partnerName: String,           // Название партнёра
    originalUrl: String,           // URL оригинального отзыва
    importedAt: Date               // Когда импортирован
  },

  // Автор
  author: {
    name: String,
    country: String,
    avatar: String,
    verified: Boolean              // Верифицированный пользователь
  },

  // Контент
  content: {
    title: String,                 // Заголовок отзыва
    text: String,                  // Полный текст
    rating: Number,                // 1-5 звёзд
    date: Date,                    // Дата написания

    // Извлечённые данные
    language: String,              // Язык (ru, en, etc.)
    sentiment: String,             // positive, negative, neutral
    keywords: [String]             // Ключевые слова
  },

  // Экстракция цитат
  quotes: [{
    text: String,                  // Текст цитаты
    startIndex: Number,            // Начало в оригинальном тексте
    endIndex: Number,              // Конец
    importance: Number,            // 0-100 (важность)
    category: String,              // location, food, service, etc.
    isUnique: Boolean,             // Уникальная цитата
    usedInArticles: [String]       // ID статей, где использована
  }],

  // Обработка
  processing: {
    status: String,                // pending, processed, published
    extractedQuotes: Number,       // Количество извлечённых цитат
    compiledToArticles: [String],  // ID статей
    processedAt: Date
  },

  // Публикация
  published: {
    onMainSite: Boolean,           // Опубликован на главной
    onPartnerSite: Boolean,        // Опубликован у партнёра
    inEncyclopedia: Boolean        // Использован в энциклопедии
  }
});
```

### Пример Отзыва

```javascript
{
  reviewId: "REV-VEN-001-00123",

  source: {
    partnerId: "PARTNER-HOTEL-001",
    partnerName: "Grand Hotel Venezia",
    originalUrl: "https://grand-hotel-venezia.com/reviews/123",
    importedAt: "2024-12-20T14:30:00Z"
  },

  author: {
    name: "Мария Иванова",
    country: "Россия",
    verified: true
  },

  content: {
    title: "Незабываемый отдых в Венеции!",
    text: "Провели неделю в Grand Hotel Venezia и остались в восторге. \"Вид из окна на Гранд-канал просто потрясающий!\" Завтраки очень вкусные. \"Персонал невероятно дружелюбный и говорит по-русски.\" Особенно понравилась экскурсия на гондоле, которую организовал отель. \"Площадь Сан-Марко находится всего в 5 минутах ходьбы.\" Обязательно вернёмся!",
    rating: 5,
    date: "2024-12-15T10:00:00Z",
    language: "ru",
    sentiment: "positive",
    keywords: ["венеция", "отель", "гранд-канал", "сан-марко"]
  },

  quotes: [
    {
      text: "Вид из окна на Гранд-канал просто потрясающий!",
      startIndex: 67,
      endIndex: 118,
      importance: 85,
      category: "location",
      isUnique: true,
      usedInArticles: ["ARTICLE-VEN-HOTELS"]
    },
    {
      text: "Персонал невероятно дружелюбный и говорит по-русски.",
      startIndex: 145,
      endIndex: 199,
      importance: 70,
      category: "service",
      isUnique: true,
      usedInArticles: []
    },
    {
      text: "Площадь Сан-Марко находится всего в 5 минутах ходьбы.",
      startIndex: 280,
      endIndex: 336,
      importance: 90,
      category: "location",
      isUnique: false,  // Похожие цитаты уже есть
      usedInArticles: ["ARTICLE-VEN-ATTRACTIONS"]
    }
  ],

  processing: {
    status: "processed",
    extractedQuotes: 3,
    compiledToArticles: ["ARTICLE-VEN-HOTELS", "ARTICLE-VEN-ATTRACTIONS"],
    processedAt: "2024-12-20T15:00:00Z"
  },

  published: {
    onMainSite: true,
    onPartnerSite: true,
    inEncyclopedia: true
  }
}
```

---

## 📝 Экстракция Цитат (Quote Extraction)

### Алгоритм Экстракции

#### 1. Простой Метод (без нейросетей)

```javascript
class QuoteExtractor {
  /**
   * Извлечение цитат на основе маркеров
   */
  extractQuotes(text) {
    const quotes = [];

    // Метод 1: Текст в кавычках
    const quotedPattern = /"([^"]+)"/g;
    let match;
    while ((match = quotedPattern.exec(text)) !== null) {
      quotes.push({
        text: match[1],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        method: 'quoted',
        markerType: 'double-quotes'
      });
    }

    // Метод 2: Текст в одинарных кавычках
    const singleQuotedPattern = /'([^']+)'/g;
    while ((match = singleQuotedPattern.exec(text)) !== null) {
      quotes.push({
        text: match[1],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        method: 'quoted',
        markerType: 'single-quotes'
      });
    }

    // Метод 3: Текст в скобках (особые случаи)
    const bracketPattern = /\[([^\]]+)\]/g;
    while ((match = bracketPattern.exec(text)) !== null) {
      quotes.push({
        text: match[1],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        method: 'bracketed',
        markerType: 'square-brackets'
      });
    }

    // Метод 4: Восклицательные предложения (эмоциональные)
    const exclamationPattern = /([А-ЯA-Z][^.!?]*!)/g;
    while ((match = exclamationPattern.exec(text)) !== null) {
      if (match[1].length > 20 && match[1].length < 200) {
        quotes.push({
          text: match[1],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          method: 'exclamatory',
          markerType: 'exclamation'
        });
      }
    }

    return quotes;
  }

  /**
   * Оценка важности цитаты
   */
  calculateImportance(quote, context) {
    let score = 50; // Базовый балл

    // +20 если цитата в кавычках
    if (quote.markerType === 'double-quotes') score += 20;

    // +15 если есть восклицательный знак
    if (quote.text.includes('!')) score += 15;

    // +10 если содержит ключевые слова
    const keywords = ['потрясающий', 'незабываемый', 'восхитительный',
                      'ужасный', 'плохой', 'отличный'];
    keywords.forEach(keyword => {
      if (quote.text.toLowerCase().includes(keyword)) score += 10;
    });

    // +5 за каждые 10 слов (но не более +25)
    const wordCount = quote.text.split(' ').length;
    score += Math.min(Math.floor(wordCount / 10) * 5, 25);

    return Math.min(score, 100);
  }

  /**
   * Проверка уникальности цитаты
   */
  async isUnique(quote, existingQuotes) {
    // Простое сравнение по сходству текста
    const similarity = (a, b) => {
      const longer = a.length > b.length ? a : b;
      const shorter = a.length > b.length ? b : a;
      if (longer.length === 0) return 1.0;
      return (longer.length - this.editDistance(longer, shorter)) / longer.length;
    };

    for (const existing of existingQuotes) {
      const sim = similarity(
        quote.text.toLowerCase(),
        existing.text.toLowerCase()
      );

      // Если сходство > 80%, считаем неуникальной
      if (sim > 0.8) return false;
    }

    return true;
  }

  /**
   * Расстояние Левенштейна
   */
  editDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Категоризация цитаты
   */
  categorize(quote) {
    const categories = {
      location: ['место', 'вид', 'расположение', 'находится', 'ходьбы'],
      food: ['еда', 'завтрак', 'ресторан', 'вкусно', 'блюдо'],
      service: ['персонал', 'обслуживание', 'администратор', 'дружелюбный'],
      room: ['номер', 'комната', 'кровать', 'чисто', 'уютно'],
      price: ['цена', 'стоимость', 'дорого', 'дешево', 'бюджет'],
      experience: ['впечатление', 'эмоции', 'незабываемый', 'восторг']
    };

    const text = quote.text.toLowerCase();
    let maxScore = 0;
    let category = 'general';

    for (const [cat, keywords] of Object.entries(categories)) {
      let score = 0;
      keywords.forEach(keyword => {
        if (text.includes(keyword)) score++;
      });
      if (score > maxScore) {
        maxScore = score;
        category = cat;
      }
    }

    return category;
  }
}
```

#### 2. Использование Экстрактора

```javascript
// Обработка отзыва
async function processReview(review) {
  const extractor = new QuoteExtractor();

  // 1. Извлечь цитаты
  const rawQuotes = extractor.extractQuotes(review.content.text);

  // 2. Обработать каждую цитату
  const processedQuotes = [];
  for (const rawQuote of rawQuotes) {
    // Оценить важность
    const importance = extractor.calculateImportance(rawQuote, review);

    // Категоризация
    const category = extractor.categorize(rawQuote);

    // Проверка уникальности
    const existingQuotes = await Quote.find({ category });
    const isUnique = await extractor.isUnique(rawQuote, existingQuotes);

    // Только важные и уникальные
    if (importance >= 60 && isUnique) {
      processedQuotes.push({
        text: rawQuote.text,
        startIndex: rawQuote.startIndex,
        endIndex: rawQuote.endIndex,
        importance,
        category,
        isUnique: true,
        usedInArticles: []
      });
    }
  }

  // 3. Сохранить цитаты
  review.quotes = processedQuotes;
  review.processing.extractedQuotes = processedQuotes.length;
  review.processing.status = 'processed';
  review.processing.processedAt = new Date();

  await review.save();

  return processedQuotes;
}
```

---

## 📚 Каталог Цитат (Quote Catalog)

### Схема Каталога

```javascript
const QuoteCatalogSchema = new mongoose.Schema({
  quoteId: String,                 // Уникальный ID цитаты

  // Текст цитаты
  text: {
    type: String,
    required: true,
    index: 'text'                  // Текстовый индекс для поиска
  },

  // Источник
  source: {
    reviewId: String,              // ID оригинального отзыва
    partnerId: String,             // ID партнёра
    author: String,                // Автор отзыва
    date: Date                     // Дата отзыва
  },

  // Классификация
  category: {
    type: String,
    enum: ['location', 'food', 'service', 'room', 'price', 'experience', 'general'],
    index: true
  },

  // Метрики
  metrics: {
    importance: Number,            // 0-100
    sentiment: String,             // positive, negative, neutral
    length: Number,                // Длина в символах
    wordCount: Number              // Количество слов
  },

  // Использование
  usage: {
    timesUsed: Number,             // Сколько раз использована
    articlesUsed: [String],        // ID статей
    lastUsed: Date                 // Последнее использование
  },

  // Связанные сущности
  entities: {
    locations: [String],           // Упомянутые места
    people: [String],              // Упомянутые люди
    dates: [String]                // Упомянутые даты
  },

  // Статус
  status: {
    approved: Boolean,             // Модерация пройдена
    featured: Boolean,             // Избранная цитата
    archived: Boolean              // Архивирована
  }
});
```

---

## 🔄 Автоматическая Компиляция Статей

### Компилятор Статей

```javascript
class ArticleCompiler {
  /**
   * Компиляция статьи из цитат
   */
  async compileArticle(topic, quotesData) {
    // 1. Получить релевантные цитаты
    const quotes = await this.getRelevantQuotes(topic);

    // 2. Группировка по категориям
    const grouped = this.groupQuotesByCategory(quotes);

    // 3. Создание структуры статьи
    const article = {
      title: topic.title,
      introduction: this.generateIntroduction(topic),
      sections: []
    };

    // 4. Генерация секций
    for (const [category, categoryQuotes] of Object.entries(grouped)) {
      const section = {
        title: this.getCategoryTitle(category),
        content: this.compileSection(categoryQuotes),
        quotes: categoryQuotes
      };
      article.sections.push(section);
    }

    // 5. Заключение
    article.conclusion = this.generateConclusion(quotes);

    return article;
  }

  /**
   * Получение релевантных цитат
   */
  async getRelevantQuotes(topic) {
    return await QuoteCatalog.find({
      $or: [
        { 'entities.locations': { $in: topic.locations } },
        { text: { $regex: new RegExp(topic.keywords.join('|'), 'i') } }
      ],
      'status.approved': true,
      'metrics.importance': { $gte: 70 }
    })
    .sort({ 'metrics.importance': -1 })
    .limit(50);
  }

  /**
   * Группировка по категориям
   */
  groupQuotesByCategory(quotes) {
    const grouped = {};

    quotes.forEach(quote => {
      const cat = quote.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(quote);
    });

    return grouped;
  }

  /**
   * Компиляция секции
   */
  compileSection(quotes) {
    let content = '';

    // Вступление к секции
    content += this.generateSectionIntro(quotes[0].category) + '\n\n';

    // Добавление цитат
    quotes.forEach((quote, index) => {
      content += `> "${quote.text}"\n`;
      content += `> — ${quote.source.author}\n\n`;

      // Переходный текст между цитатами
      if (index < quotes.length - 1) {
        content += this.generateTransition() + '\n\n';
      }
    });

    return content;
  }

  /**
   * Генерация вступления к секции
   */
  generateSectionIntro(category) {
    const intros = {
      location: 'Туристы особенно отмечают расположение и виды:',
      food: 'Многие гости высоко оценивают кулинарные впечатления:',
      service: 'Об обслуживании посетители пишут следующее:',
      room: 'Комфорт номеров описывается так:',
      price: 'Соотношение цены и качества оценивается так:',
      experience: 'Общие впечатления от посещения:'
    };

    return intros[category] || 'Отзывы посетителей:';
  }

  /**
   * Переходные фразы
   */
  generateTransition() {
    const transitions = [
      'Другой турист добавляет:',
      'Ещё один посетитель отмечает:',
      'Похожие впечатления у следующего гостя:',
      'Также стоит отметить:',
      'Интересное наблюдение:'
    ];

    return transitions[Math.floor(Math.random() * transitions.length)];
  }
}
```

### Схема Скомпилированной Статьи

```javascript
const CompiledArticleSchema = new mongoose.Schema({
  articleId: String,

  // Заголовок и метаданные
  title: String,
  slug: String,
  topic: {
    type: String,
    locations: [String],
    keywords: [String]
  },

  // Контент
  content: {
    introduction: String,
    sections: [{
      title: String,
      category: String,
      content: String,              // Скомпилированный текст
      quotesUsed: [String]          // ID использованных цитат
    }],
    conclusion: String
  },

  // Источники
  sources: {
    totalQuotes: Number,
    totalPartners: Number,
    partners: [{
      partnerId: String,
      partnerName: String,
      quotesContributed: Number
    }]
  },

  // Статистика
  stats: {
    wordCount: Number,
    readingTime: Number,            // Минуты
    lastCompiled: Date,
    timesUpdated: Number
  },

  // Версионирование
  version: {
    major: Number,
    minor: Number,
    full: String                    // "v1.2"
  },

  // История компиляций
  compilationHistory: [{
    version: String,
    compiledAt: Date,
    quotesAdded: Number,
    quotesRemoved: Number
  }],

  // Публикация
  published: {
    status: Boolean,
    publishedAt: Date,
    updatedAt: Date
  }
});
```

---

## 🔄 Интеграция с RSS/Atom

### RSS Feed для Партнёров

```javascript
class RSSIntegration {
  /**
   * Подключение к RSS партнёра
   */
  async connectPartnerRSS(partner) {
    const Parser = require('rss-parser');
    const parser = new Parser();

    try {
      const feed = await parser.parseURL(partner.reviewsAPI.endpoint);

      // Обработка каждого элемента feed
      for (const item of feed.items) {
        await this.processRSSItem(item, partner);
      }

      partner.reviewsAPI.lastSync = new Date();
      await partner.save();

    } catch (error) {
      console.error(`RSS sync error for ${partner.name}:`, error);
    }
  }

  /**
   * Обработка RSS элемента
   */
  async processRSSItem(item, partner) {
    // Проверка, не импортирован ли уже
    const existing = await Review.findOne({
      'source.originalUrl': item.link
    });

    if (existing) return;

    // Создание отзыва
    const review = new Review({
      reviewId: this.generateReviewId(partner),
      source: {
        partnerId: partner.partnerId,
        partnerName: partner.name,
        originalUrl: item.link,
        importedAt: new Date()
      },
      author: {
        name: this.extractAuthor(item),
        verified: false
      },
      content: {
        title: item.title,
        text: item.contentSnippet || item.content,
        date: new Date(item.pubDate),
        language: this.detectLanguage(item.content)
      },
      processing: {
        status: 'pending'
      }
    });

    await review.save();

    // Запустить обработку
    await processReview(review);
  }

  /**
   * Автоматическая синхронизация
   */
  startAutoSync(interval = 3600000) { // 1 час
    setInterval(async () => {
      const partners = await Partner.find({
        'reviewsAPI.endpoint': { $exists: true },
        'affiliate.status': 'active'
      });

      for (const partner of partners) {
        await this.connectPartnerRSS(partner);
      }
    }, interval);
  }
}
```

---

## 📤 Обратная Связь Партнёрам

### Виджет для Партнёров

```javascript
/**
 * Генерация виджета со скомпилированными статьями
 */
class PartnerWidgetGenerator {
  generateWidget(partner, articles) {
    return `
      <!-- Виджет Свободной Энциклопедии Туризма -->
      <div id="travel-wiki-widget" data-partner="${partner.partnerId}">
        <h3>📚 Статьи из Энциклопедии Туризма</h3>
        <div class="widget-articles">
          ${articles.map(article => `
            <div class="widget-article">
              <h4>${article.title}</h4>
              <p>${article.content.introduction.substring(0, 200)}...</p>
              <a href="${article.url}" target="_blank">Читать полностью</a>
              <div class="widget-contribution">
                Использовано ${article.quotesFromThisPartner} цитат из ваших отзывов
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <script src="https://travel-wiki.com/widget.js"></script>
    `;
  }

  /**
   * API для получения виджета
   */
  async getWidgetForPartner(partnerId) {
    // Получить статьи, где использованы цитаты этого партнёра
    const articles = await CompiledArticle.find({
      'sources.partners.partnerId': partnerId,
      'published.status': true
    }).limit(5);

    // Для каждой статьи подсчитать вклад партнёра
    const enrichedArticles = articles.map(article => {
      const partnerContribution = article.sources.partners.find(
        p => p.partnerId === partnerId
      );

      return {
        ...article.toObject(),
        quotesFromThisPartner: partnerContribution?.quotesContributed || 0,
        url: `https://travel-wiki.com/articles/${article.slug}`
      };
    });

    const partner = await Partner.findOne({ partnerId });

    return this.generateWidget(partner, enrichedArticles);
  }
}
```

---

## 🎯 Use Case: Венеция

### Сценарий

**Партнёры в Венеции:**
- Grand Hotel Venezia (100 отзывов)
- Ristorante Italiano (75 отзывов)
- Venice Tours (50 отзывов)

**Процесс:**

1. **Импорт отзывов:**
   - Через RSS каждый час
   - Через API раз в день
   - Всего: 225 отзывов

2. **Экстракция цитат:**
   - Извлечено: 487 цитат
   - Уникальных: 156 цитат
   - Категории: location (45), food (32), service (29), experience (50)

3. **Компиляция статьи:**
   ```markdown
   # Венеция: Город на Воде — Отзывы Туристов

   ## Введение
   Венеция — один из самых романтичных городов мира.
   Вот что пишут о ней туристы.

   ## Расположение и Виды
   Туристы особенно отмечают расположение и виды:

   > "Вид из окна на Гранд-канал просто потрясающий!"
   > — Мария Иванова

   Другой турист добавляет:

   > "Площадь Сан-Марко находится всего в 5 минутах ходьбы."
   > — Джон Смит

   ## Кулинарные Впечатления
   Многие гости высоко оценивают кулинарные впечатления:

   > "Паста с морепродуктами в Ristorante Italiano —
   > лучшее, что я пробовал!"
   > — Пьер Дюпон

   ## Сервис
   Об обслуживании посетители пишут следующее:

   > "Персонал невероятно дружелюбный и говорит по-русски."
   > — Мария Иванова

   ## Заключение
   На основе 225 отзывов от 3 партнёров.
   ```

4. **Публикация:**
   - Статья опубликована в энциклопедии
   - Виджеты отправлены партнёрам
   - Партнёры получили обогащённый контент

---

## 📊 Метрики и Аналитика

### Дашборд для Партнёров

```javascript
// Статистика для партнёра
{
  partner: "Grand Hotel Venezia",
  period: "Декабрь 2024",

  reviews: {
    total: 100,
    processed: 100,
    quotesExtracted: 234
  },

  impact: {
    articlesCreated: 5,
    quotesUsed: 67,
    totalReach: 15000  // Просмотры статей
  },

  affiliate: {
    sales: 45,
    revenue: 67500,    // €67,500
    commission: 3375   // €3,375
  }
}
```

---

## 🔐 Модерация и Качество

### Система Модерации

```javascript
const ModerationSchema = new mongoose.Schema({
  itemId: String,              // ID отзыва/цитаты
  itemType: String,            // review, quote, article

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },

  moderator: String,           // ID модератора
  moderatedAt: Date,

  flags: [{
    type: String,              // spam, offensive, incorrect
    reporter: String,
    reportedAt: Date
  }],

  qualityScore: Number         // 0-100
});
```

---

## 🚀 Следующие Шаги

1. ✅ Концепция партнёрской системы (этот документ)
2. 📋 Реализация экстрактора цитат
3. 💻 API для партнёров
4. 🔄 RSS/Atom интеграция
5. 📚 Компилятор статей
6. 🎨 Виджеты для партнёров
7. 🧪 Тестирование

---

**Версия:** 1.0
**Дата:** 2024-12-28
**Статус:** Приложение - Концепция Партнёрской Обратной Связи
