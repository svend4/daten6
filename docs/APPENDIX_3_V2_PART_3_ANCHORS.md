# ПРИЛОЖЕНИЕ 3 (v2.0) - ЧАСТЬ 3: Система Плагинов и Якорей

**Версия:** 2.0
**Дата:** 2024-12-28
**Статус:** Финальная версия
**Тип документа:** Техническое руководство с расширениями для научной работы

---

## 📚 О Документе

Эта часть является интеграцией системы плагинов и якорей из документа `PLUGIN_ANCHOR_SYSTEM.md` с дополнительными примерами применения к научной и исследовательской работе.

**Структура:**
1. Основная концепция двухуровневой архитектуры (из источника)
2. Типы якорей и их конфигурации (из источника)
3. Поддержка разных языков программирования (из источника)
4. Автоматическое обновление данных (из источника)
5. **НОВОЕ:** Применение к научной работе (курсовые, дипломы, диссертации)
6. **НОВОЕ:** Интеграция с академическими базами данных
7. **НОВОЕ:** Практические чек-листы для исследователей

---

## 🔌 Концепция: Двухуровневая Архитектура Презентации

### Уровни Презентации

```
┌─────────────────────────────────────────────────────────┐
│  УРОВЕНЬ 1: СТАТИЧЕСКИЙ СКЕЛЕТ (Внешний/Неизменяемый)  │
│                                                         │
│  ├─ HTML структура (неизменяемая)                      │
│  ├─ CSS стили (фиксированные)                          │
│  ├─ JavaScript навигация (константная логика)          │
│  └─ API endpoints (стабильные интерфейсы)              │
│                                                         │
│           ↓ Якоря подключения ↓                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
           │  │  │  │  │  │
           ↓  ↓  ↓  ↓  ↓  ↓
┌─────────────────────────────────────────────────────────┐
│  УРОВЕНЬ 2: ДИНАМИЧЕСКИЙ КОНТЕНТ (Внутренний/Изменяемый)│
│                                                         │
│  ├─ Виджеты на PHP (меню ресторана)                   │
│  ├─ Страницы на Python (галереи)                      │
│  ├─ API на Node.js (каталоги)                         │
│  ├─ Компоненты на Ruby (блоги)                        │
│  └─ Любые внешние источники                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Принцип Работы Якорей

### Что Такое Якорь?

**Якорь (Anchor)** - это точка подключения внешнего контента к главному каталогу.

Аналогия: **Электрическая розетка**
- Розетка (якорь) - стандартизированный интерфейс
- Вилка (плагин) - внешнее устройство
- Электричество (данные) - поток информации

```javascript
// Якорь в главном каталоге
<div id="anchor-menu-001" class="content-anchor">
    <!-- Сюда подключается внешний виджет меню -->
</div>

// Виджет может быть написан на:
// - PHP
// - Python
// - Node.js
// - Ruby
// - Java
// - Любом другом языке
```

### Типы Якорей

#### 1. **iframe Якорь**

Подключение через iframe (изолированное окружение):

```html
<div class="anchor" data-anchor-id="ANCHOR-IFRAME-001">
    <iframe
        src="https://external-service.com/widget"
        width="100%"
        height="400"
        frameborder="0"
        sandbox="allow-scripts allow-same-origin">
    </iframe>
</div>
```

**Плюсы:**
- ✅ Полная изоляция
- ✅ Безопасность
- ✅ Любой внешний контент

**Минусы:**
- ❌ Ограниченная интеграция
- ❌ SEO проблемы
- ❌ Стилизация сложна

#### 2. **API Якорь**

Получение данных через REST API:

```javascript
// Якорь загружает данные через API
async function loadAnchorData(anchorId) {
    const response = await fetch(`/api/anchors/${anchorId}/data`);
    const data = await response.json();

    // Рендеринг данных в DOM
    renderAnchor(anchorId, data);
}
```

**Плюсы:**
- ✅ Полный контроль рендеринга
- ✅ SEO-friendly
- ✅ Кастомизация стилей

**Минусы:**
- ❌ Требует трансформацию данных
- ❌ Больше кода на фронтенде

#### 3. **SSI Якорь** (Server-Side Includes)

Включение контента на стороне сервера:

```html
<!--#include virtual="/widgets/menu.php" -->
```

**Плюсы:**
- ✅ Выполнение на сервере
- ✅ SEO-friendly
- ✅ Кэшируемость

**Минусы:**
- ❌ Требует серверную настройку
- ❌ Нет динамического обновления

#### 4. **Web Components Якорь**

Использование веб-компонентов:

```html
<custom-menu-widget
    data-anchor-id="ANCHOR-WC-001"
    data-source="https://api.restaurant.com/menu">
</custom-menu-widget>
```

**Плюсы:**
- ✅ Стандартизированный
- ✅ Переиспользуемый
- ✅ Инкапсуляция

**Минусы:**
- ❌ Поддержка браузеров
- ❌ Сложность разработки

#### 5. **Микрофронтенд Якорь**

Подключение целого микро-приложения:

```javascript
// main.js
import { loadMicroApp } from 'qiankun'; // или single-spa

loadMicroApp({
    name: 'menu-widget',
    entry: 'https://menu.restaurant.com',
    container: '#anchor-menu-001',
    activeRule: '/menu'
});
```

**Плюсы:**
- ✅ Независимое развертывание
- ✅ Технологическая независимость
- ✅ Масштабируемость

**Минусы:**
- ❌ Сложность архитектуры
- ❌ Больше ресурсов

---

## 📋 Структура Якоря

### Минимальная Конфигурация

```javascript
{
  // Уникальный идентификатор
  "anchorId": "ANCHOR-MENU-001",

  // Название (для отображения)
  "name": "Меню Ресторана",

  // Тип якоря
  "type": "api",  // api, iframe, ssi, webcomponent, microfrontend

  // Источник данных
  "source": {
    "url": "https://restaurant.com/api/menu",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer TOKEN"
    }
  },

  // Позиция в каталоге
  "position": {
    "parentId": "catalog-root",
    "order": 1
  }
}
```

### Расширенная Конфигурация

```javascript
{
  anchorId: "ANCHOR-MENU-001",
  name: "Меню Ресторана",
  description: "Динамическое меню с обновлением каждый час",

  // Тип и подтип
  type: "api",
  subtype: "rest",  // rest, graphql, soap, websocket

  // Источник
  source: {
    url: "https://restaurant.com/api/menu",
    method: "GET",
    format: "json",  // json, xml, html, csv
    language: "php", // Язык источника (для документации)

    // Аутентификация
    auth: {
      type: "bearer",  // bearer, basic, apikey, oauth
      token: "encrypted-token"
    },

    // Заголовки
    headers: {
      "Content-Type": "application/json",
      "X-API-Version": "2.0"
    },

    // Параметры запроса
    params: {
      "lang": "ru",
      "currency": "RUB"
    }
  },

  // Трансформация данных
  transform: {
    // Функция преобразования (JavaScript код)
    function: `
      function transform(data) {
        return {
          items: data.menu.items.map(item => ({
            id: item.id,
            title: item.name,
            description: item.desc,
            price: item.price_rub,
            image: item.photo_url
          }))
        };
      }
    `,

    // Шаблон отображения (Handlebars, EJS, etc.)
    template: "menu-item-card"
  },

  // Обновление
  refresh: {
    mode: "auto",         // auto, manual, schedule
    interval: 3600000,    // 1 час (мс)
    schedule: "0 * * * *" // Cron выражение (каждый час)
  },

  // Кэширование
  cache: {
    enabled: true,
    ttl: 1800000,         // 30 минут
    strategy: "stale-while-revalidate"
  },

  // Позиция в каталоге
  position: {
    parentId: "catalog-root",
    hierarchyPath: "1.2.3",
    order: 5
  },

  // Отображение
  display: {
    // Шаблон карточки
    cardTemplate: "default",  // default, compact, detailed

    // CSS классы
    cssClasses: ["menu-widget", "bordered"],

    // Стили
    styles: {
      backgroundColor: "#f9f9f9",
      borderRadius: "8px"
    },

    // Поведение
    behavior: {
      clickable: true,
      expandable: true,
      sortable: true
    }
  },

  // Метаданные
  metadata: {
    version: "1.2.0",
    author: "Ресторан Ла Петит",
    tags: ["меню", "еда", "ресторан"],
    category: "food-service",

    // Дополнительные поля
    customFields: {
      restaurantId: "rest-001",
      cuisineType: "french",
      priceRange: "$$-$$$"
    }
  },

  // Статус
  status: {
    enabled: true,
    visible: true,
    lastUpdate: "2024-12-28T15:00:00Z",
    lastError: null
  },

  // События
  events: {
    onLoad: "handleMenuLoad",
    onError: "handleMenuError",
    onUpdate: "handleMenuUpdate"
  }
}
```

---

## 🌐 Поддержка Разных Языков

### PHP Виджет

**Источник (PHP):**
```php
<?php
// menu-widget.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Подключение к БД
$db = new PDO('mysql:host=localhost;dbname=restaurant', 'user', 'pass');

// Получение меню
$stmt = $db->query('SELECT * FROM menu_items WHERE active = 1');
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Возврат JSON
echo json_encode([
    'success' => true,
    'data' => [
        'items' => $items,
        'updated_at' => date('c')
    ]
]);
?>
```

**Якорь (Конфигурация):**
```javascript
{
  anchorId: "ANCHOR-PHP-MENU",
  type: "api",
  source: {
    url: "https://restaurant.com/widgets/menu-widget.php",
    format: "json",
    language: "php"
  }
}
```

### Python Flask API

**Источник (Python):**
```python
# menu_api.py
from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

@app.route('/api/menu')
def get_menu():
    conn = sqlite3.connect('restaurant.db')
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM menu_items WHERE active = 1')
    items = cursor.fetchall()

    return jsonify({
        'success': True,
        'data': {
            'items': [
                {
                    'id': item[0],
                    'name': item[1],
                    'price': item[2],
                    'description': item[3]
                }
                for item in items
            ]
        }
    })

if __name__ == '__main__':
    app.run(port=5000)
```

**Якорь:**
```javascript
{
  anchorId: "ANCHOR-PYTHON-MENU",
  source: {
    url: "http://localhost:5000/api/menu",
    language: "python"
  }
}
```

### Node.js Express API

**Источник (Node.js):**
```javascript
// menu-api.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/menu', async (req, res) => {
    // Получение из БД
    const items = await db.query('SELECT * FROM menu_items');

    res.json({
        success: true,
        data: { items }
    });
});

app.listen(3000);
```

**Якорь:**
```javascript
{
  anchorId: "ANCHOR-NODEJS-MENU",
  source: {
    url: "http://localhost:3000/api/menu",
    language: "nodejs"
  }
}
```

### Ruby Sinatra API

**Источник (Ruby):**
```ruby
# menu_api.rb
require 'sinatra'
require 'json'
require 'sequel'

DB = Sequel.connect('sqlite://restaurant.db')

get '/api/menu' do
  content_type :json

  items = DB[:menu_items].where(active: 1).all

  {
    success: true,
    data: { items: items }
  }.to_json
end
```

**Якорь:**
```javascript
{
  anchorId: "ANCHOR-RUBY-MENU",
  source: {
    url: "http://localhost:4567/api/menu",
    language: "ruby"
  }
}
```

---

## 🔄 Автоматическое Обновление

### Механизм 1: Polling (Опрос)

```javascript
class AnchorManager {
    constructor() {
        this.anchors = new Map();
    }

    // Регистрация якоря
    register(config) {
        const anchor = new Anchor(config);
        this.anchors.set(config.anchorId, anchor);

        // Автоматическое обновление
        if (config.refresh.mode === 'auto') {
            anchor.startAutoRefresh();
        }
    }

    // Обновление всех якорей
    async refreshAll() {
        for (const anchor of this.anchors.values()) {
            await anchor.refresh();
        }
    }
}

class Anchor {
    constructor(config) {
        this.config = config;
        this.data = null;
        this.refreshTimer = null;
    }

    async refresh() {
        try {
            // Получение данных
            const response = await fetch(this.config.source.url, {
                method: this.config.source.method,
                headers: this.config.source.headers
            });

            const rawData = await response.json();

            // Трансформация (если нужна)
            this.data = this.config.transform
                ? this.transform(rawData)
                : rawData;

            // Обновление DOM
            this.render();

            // Событие успешного обновления
            this.emit('update', this.data);

        } catch (error) {
            console.error(`Anchor ${this.config.anchorId} error:`, error);
            this.emit('error', error);
        }
    }

    startAutoRefresh() {
        const interval = this.config.refresh.interval;

        this.refreshTimer = setInterval(() => {
            this.refresh();
        }, interval);

        // Первое обновление сразу
        this.refresh();
    }

    transform(data) {
        if (this.config.transform.function) {
            const fn = new Function('data', this.config.transform.function);
            return fn(data);
        }
        return data;
    }

    render() {
        const container = document.querySelector(
            `[data-anchor-id="${this.config.anchorId}"]`
        );

        if (container) {
            container.innerHTML = this.generateHTML();
        }
    }

    generateHTML() {
        // Генерация HTML из данных
        return this.data.items.map(item => `
            <div class="anchor-item">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `).join('');
    }

    emit(event, data) {
        const handler = this.config.events[`on${event}`];
        if (handler && typeof window[handler] === 'function') {
            window[handler](data);
        }
    }
}
```

### Механизм 2: WebSocket (Real-time)

```javascript
class WebSocketAnchor extends Anchor {
    constructor(config) {
        super(config);
        this.ws = null;
    }

    connect() {
        this.ws = new WebSocket(this.config.source.url);

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.data = this.transform(data);
            this.render();
            this.emit('update', this.data);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.emit('error', error);
        };
    }
}
```

### Механизм 3: Server-Sent Events (SSE)

```javascript
class SSEAnchor extends Anchor {
    constructor(config) {
        super(config);
        this.eventSource = null;
    }

    connect() {
        this.eventSource = new EventSource(this.config.source.url);

        this.eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.data = this.transform(data);
            this.render();
            this.emit('update', this.data);
        };
    }
}
```

---

## 🎨 Примеры Интеграции

### Пример 1: Меню Ресторана (PHP)

**HTML (Главная страница):**
```html
<div class="catalog-item">
    <h2>Меню Ресторана</h2>

    <!-- Якорь для PHP виджета -->
    <div
        data-anchor-id="ANCHOR-MENU-001"
        class="content-anchor"
        data-loading="true">
        <div class="loading">Загрузка меню...</div>
    </div>
</div>
```

**JavaScript (Инициализация):**
```javascript
// Регистрация якоря
anchorManager.register({
    anchorId: 'ANCHOR-MENU-001',
    type: 'api',
    source: {
        url: 'https://restaurant.com/widgets/menu.php',
        method: 'GET',
        format: 'json'
    },
    refresh: {
        mode: 'auto',
        interval: 3600000  // 1 час
    },
    transform: {
        function: `
            function transform(data) {
                return {
                    items: data.menu.map(item => ({
                        title: item.dish_name,
                        price: item.price_rub + ' ₽',
                        description: item.description
                    }))
                };
            }
        `
    }
});
```

### Пример 2: Галерея Фотографий (Python)

**HTML:**
```html
<div data-anchor-id="ANCHOR-GALLERY-001" class="gallery-anchor">
    <!-- Сюда загрузится галерея из Python API -->
</div>
```

**JavaScript:**
```javascript
anchorManager.register({
    anchorId: 'ANCHOR-GALLERY-001',
    type: 'api',
    source: {
        url: 'http://photos-api.com/api/gallery',
        language: 'python'
    },
    display: {
        cardTemplate: 'gallery-grid',
        cssClasses: ['photo-grid', 'masonry']
    }
});
```

### Пример 3: Каталог Товаров (Node.js GraphQL)

**HTML:**
```html
<div data-anchor-id="ANCHOR-PRODUCTS-001">
    <!-- Товары из GraphQL API -->
</div>
```

**JavaScript:**
```javascript
anchorManager.register({
    anchorId: 'ANCHOR-PRODUCTS-001',
    type: 'api',
    subtype: 'graphql',
    source: {
        url: 'http://shop-api.com/graphql',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
                query {
                    products(limit: 20) {
                        id
                        name
                        price
                        image
                    }
                }
            `
        })
    }
});
```

---

## 📊 Архитектура Backend

### API для Управления Якорями

```javascript
// routes/anchors.js
const express = require('express');
const router = express.Router();
const Anchor = require('../models/Anchor');

// GET /api/anchors - Список якорей
router.get('/', async (req, res) => {
    const anchors = await Anchor.find({ 'status.enabled': true });
    res.json({ success: true, data: anchors });
});

// GET /api/anchors/:id - Получить якорь
router.get('/:id', async (req, res) => {
    const anchor = await Anchor.findOne({ anchorId: req.params.id });
    res.json({ success: true, data: anchor });
});

// GET /api/anchors/:id/data - Получить данные якоря
router.get('/:id/data', async (req, res) => {
    const anchor = await Anchor.findOne({ anchorId: req.params.id });

    // Получить данные из внешнего источника
    const data = await fetchAnchorData(anchor);

    res.json({ success: true, data });
});

// POST /api/anchors - Создать якорь
router.post('/', async (req, res) => {
    const anchor = new Anchor(req.body);
    await anchor.save();

    res.json({ success: true, data: anchor });
});

// PUT /api/anchors/:id/refresh - Обновить данные
router.put('/:id/refresh', async (req, res) => {
    const anchor = await Anchor.findOne({ anchorId: req.params.id });
    const data = await fetchAnchorData(anchor);

    anchor.lastUpdate = {
        timestamp: new Date(),
        status: 'success',
        data: data
    };
    await anchor.save();

    res.json({ success: true, data });
});

// Helper function
async function fetchAnchorData(anchor) {
    const fetch = require('node-fetch');

    const response = await fetch(anchor.source.url, {
        method: anchor.source.method || 'GET',
        headers: anchor.source.headers || {}
    });

    return await response.json();
}

module.exports = router;
```

---

## 🚀 Развертывание

### Docker Compose для Микросервисов

```yaml
version: '3.8'

services:
  # Главный каталог (Node.js)
  main-catalog:
    build: ./main-catalog
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/catalog

  # PHP Меню
  php-menu:
    build: ./widgets/php-menu
    ports:
      - "8080:80"
    volumes:
      - ./widgets/php-menu:/var/www/html

  # Python Галерея
  python-gallery:
    build: ./widgets/python-gallery
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production

  # Node.js Каталог товаров
  nodejs-products:
    build: ./widgets/nodejs-products
    ports:
      - "4000:4000"

  # MongoDB
  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db

  # Redis (кэш)
  redis:
    image: redis:7

volumes:
  mongo-data:
```

---

# 🎓 ПРИМЕНЕНИЕ К НАУЧНОЙ РАБОТЕ

## Раздел 1: Интеграция с Академическими Базами Данных

### 1.1. Якорь для PubMed (Медицинские Публикации)

#### Конфигурация Якоря

```javascript
{
  anchorId: "ANCHOR-PUBMED-001",
  name: "Последние публикации по теме исследования",
  description: "Автоматическое обновление списка статей из PubMed",

  type: "api",
  subtype: "rest",

  source: {
    url: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
    method: "GET",
    format: "json",
    language: "external-api",

    params: {
      db: "pubmed",
      term: "machine learning AND medical diagnosis",
      retmode: "json",
      retmax: 50,
      sort: "pub_date",
      datetype: "pdat",
      reldate: 90  // Последние 90 дней
    }
  },

  // Трансформация из формата PubMed в нужный формат
  transform: {
    function: `
      async function transform(data) {
        const idList = data.esearchresult.idlist;

        // Получение детальной информации
        const details = await fetch(
          'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?' +
          'db=pubmed&retmode=json&id=' + idList.join(',')
        );
        const detailsData = await details.json();

        return {
          totalCount: data.esearchresult.count,
          articles: idList.map(id => {
            const article = detailsData.result[id];
            return {
              id: id,
              title: article.title,
              authors: article.authors.map(a => a.name).join(', '),
              journal: article.fulljournalname,
              pubDate: article.pubdate,
              doi: article.elocationid,
              pmid: id,
              url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
            };
          })
        };
      }
    `
  },

  // Обновление каждый день
  refresh: {
    mode: "schedule",
    schedule: "0 8 * * *"  // Каждый день в 8:00
  },

  cache: {
    enabled: true,
    ttl: 86400000  // 24 часа
  }
}
```

#### Применение в Диссертации

```javascript
// Глава "Обзор литературы" в диссертации
const literatureReviewAnchors = [
  {
    anchorId: "ANCHOR-PUBMED-ML-DIAGNOSIS",
    chapterSection: "2.1. Машинное обучение в медицинской диагностике",
    searchTerm: "machine learning AND medical diagnosis",
    minYear: 2020
  },
  {
    anchorId: "ANCHOR-PUBMED-DEEP-LEARNING",
    chapterSection: "2.2. Глубокое обучение для анализа изображений",
    searchTerm: "deep learning AND medical imaging",
    minYear: 2021
  },
  {
    anchorId: "ANCHOR-PUBMED-CNN-RADIOLOGY",
    chapterSection: "2.3. CNN в радиологии",
    searchTerm: "convolutional neural networks AND radiology",
    minYear: 2019
  }
];

// Автоматическая генерация списка литературы
function generateBibliographyFromAnchors() {
  const allArticles = literatureReviewAnchors
    .flatMap(anchor => anchorManager.getData(anchor.anchorId).articles)
    .sort((a, b) => a.authors.localeCompare(b.authors));

  return allArticles.map(article => ({
    type: "journal-article",
    authors: article.authors,
    title: article.title,
    journal: article.journal,
    year: new Date(article.pubDate).getFullYear(),
    doi: article.doi,
    url: article.url
  }));
}
```

### 1.2. Якорь для arXiv (Препринты)

```javascript
{
  anchorId: "ANCHOR-ARXIV-001",
  name: "Новые препринты по компьютерному зрению",

  type: "api",
  subtype: "rest",

  source: {
    url: "http://export.arxiv.org/api/query",
    method: "GET",
    format: "atom",  // arXiv возвращает Atom XML

    params: {
      search_query: "cat:cs.CV AND submittedDate:[202401 TO 202412]",
      start: 0,
      max_results: 100,
      sortBy: "submittedDate",
      sortOrder: "descending"
    }
  },

  transform: {
    function: `
      function transform(atomXML) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(atomXML, 'text/xml');
        const entries = doc.querySelectorAll('entry');

        return {
          papers: Array.from(entries).map(entry => ({
            id: entry.querySelector('id').textContent,
            title: entry.querySelector('title').textContent.trim(),
            authors: Array.from(entry.querySelectorAll('author name'))
              .map(a => a.textContent),
            summary: entry.querySelector('summary').textContent.trim(),
            published: entry.querySelector('published').textContent,
            updated: entry.querySelector('updated').textContent,
            categories: Array.from(entry.querySelectorAll('category'))
              .map(c => c.getAttribute('term')),
            pdfUrl: entry.querySelector('link[title="pdf"]')
              ?.getAttribute('href')
          }))
        };
      }
    `
  },

  refresh: {
    mode: "auto",
    interval: 43200000  // 12 часов
  }
}
```

### 1.3. Якорь для Google Scholar (Через Serpapi)

```javascript
{
  anchorId: "ANCHOR-SCHOLAR-001",
  name: "Цитирования моей предыдущей статьи",

  type: "api",

  source: {
    url: "https://serpapi.com/search",
    method: "GET",

    params: {
      engine: "google_scholar",
      q: '"Your Paper Title 2023"',
      num: 100,
      api_key: process.env.SERPAPI_KEY
    }
  },

  transform: {
    function: `
      function transform(data) {
        return {
          citationCount: data.search_information?.total_results || 0,
          citations: data.organic_results?.map(result => ({
            title: result.title,
            authors: result.publication_info?.authors,
            year: result.publication_info?.summary?.match(/\\d{4}/)?.[0],
            snippet: result.snippet,
            link: result.link,
            citedBy: result.inline_links?.cited_by?.total
          })) || []
        };
      }
    `
  },

  refresh: {
    mode: "schedule",
    schedule: "0 0 * * 0"  // Каждое воскресенье
  }
}
```

### 1.4. Якорь для RSS Журналов

#### Пример для Nature

```javascript
{
  anchorId: "ANCHOR-RSS-NATURE-AI",
  name: "Новые статьи Nature - AI/ML",

  type: "api",

  source: {
    url: "https://www.nature.com/subjects/machine-learning.rss",
    method: "GET",
    format: "rss"
  },

  transform: {
    function: `
      function transform(rssXML) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rssXML, 'text/xml');
        const items = doc.querySelectorAll('item');

        return {
          articles: Array.from(items).map(item => ({
            title: item.querySelector('title').textContent,
            link: item.querySelector('link').textContent,
            pubDate: new Date(item.querySelector('pubDate').textContent),
            description: item.querySelector('description').textContent,
            guid: item.querySelector('guid').textContent
          }))
        };
      }
    `
  },

  refresh: {
    mode: "auto",
    interval: 21600000  // 6 часов
  }
}
```

#### Множественные RSS для Диссертации

```javascript
const journalAnchors = [
  {
    anchorId: "ANCHOR-RSS-NATURE",
    url: "https://www.nature.com/subjects/machine-learning.rss",
    journal: "Nature"
  },
  {
    anchorId: "ANCHOR-RSS-SCIENCE",
    url: "https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=science",
    journal: "Science"
  },
  {
    anchorId: "ANCHOR-RSS-NEJM",
    url: "https://www.nejm.org/action/showFeed?type=etoc&feed=rss&jc=nejm",
    journal: "New England Journal of Medicine"
  },
  {
    anchorId: "ANCHOR-RSS-LANCET",
    url: "https://www.thelancet.com/rssfeed/lancet_current.xml",
    journal: "The Lancet"
  }
];

// Регистрация всех якорей
journalAnchors.forEach(config => {
  anchorManager.register({
    anchorId: config.anchorId,
    type: "api",
    source: { url: config.url, format: "rss" },
    metadata: { journal: config.journal },
    refresh: { mode: "auto", interval: 21600000 }
  });
});
```

---

## Раздел 2: Применение к Курсовой Работе (3-4 недели)

### Неделя 1: Настройка Базовых Якорей

```javascript
// Якорь для сбора литературы по теме
const courseWorkAnchors = {
  week1: {
    anchorId: "ANCHOR-COURSE-LIT-001",
    name: "Основная литература по теме",
    type: "api",

    source: {
      url: "https://scholar.google.com/scholar",
      params: {
        q: "введение в машинное обучение",
        hl: "ru",
        num: 30
      }
    },

    // Обновление только вручную на начальном этапе
    refresh: { mode: "manual" },

    output: {
      format: "bibtex",
      file: "./references/week1_literature.bib"
    }
  }
};
```

### Неделя 2-3: Добавление Специализированных Якорей

```javascript
// Якорь для отслеживания статистики и данных
{
  anchorId: "ANCHOR-COURSE-DATA-001",
  name: "Датасеты и статистика",

  type: "api",

  sources: [
    {
      name: "Kaggle Datasets",
      url: "https://www.kaggle.com/api/v1/datasets/list",
      params: { search: "machine learning beginner" }
    },
    {
      name: "UCI ML Repository",
      url: "https://archive.ics.uci.edu/ml/datasets.php",
      format: "html"
    }
  ],

  transform: {
    function: `
      function transform(data) {
        return {
          datasets: data.map(ds => ({
            name: ds.title,
            url: ds.url,
            size: ds.totalBytes,
            description: ds.subtitle,
            downloadCount: ds.downloadCount,
            usability: ds.usabilityRating
          }))
        };
      }
    `
  }
}
```

### Неделя 4: Автоматическая Генерация Библиографии

```javascript
// Якорь для финальной компиляции списка литературы
class CourseWorkBibliographyCompiler {
  constructor() {
    this.anchors = [];
  }

  addSource(anchorId, weight = 1.0) {
    this.anchors.push({ anchorId, weight });
  }

  async compile() {
    const allSources = [];

    for (const { anchorId, weight } of this.anchors) {
      const data = anchorManager.getData(anchorId);

      data.articles.forEach(article => {
        allSources.push({
          ...article,
          importance: this.calculateImportance(article) * weight
        });
      });
    }

    // Сортировка по важности
    allSources.sort((a, b) => b.importance - a.importance);

    // Топ-30 источников для курсовой
    return allSources.slice(0, 30);
  }

  calculateImportance(article) {
    let score = 0;

    // Критерии важности
    score += article.citedBy ? Math.min(article.citedBy / 10, 50) : 0;
    score += article.year >= 2020 ? 30 : 10;
    score += article.journal?.impact_factor || 0;

    return score;
  }

  exportToBibtex() {
    const sources = this.compile();

    return sources.map(source => `
@article{${source.id},
  author = {${source.authors}},
  title = {${source.title}},
  journal = {${source.journal}},
  year = {${source.year}},
  doi = {${source.doi}},
  url = {${source.url}}
}
    `).join('\n\n');
  }
}

// Использование
const compiler = new CourseWorkBibliographyCompiler();
compiler.addSource('ANCHOR-SCHOLAR-001', 1.5);  // Высокий приоритет
compiler.addSource('ANCHOR-PUBMED-001', 1.2);
compiler.addSource('ANCHOR-ARXIV-001', 0.8);    // Низкий приоритет (препринты)

const bibtex = compiler.exportToBibtex();
fs.writeFileSync('./references.bib', bibtex);
```

---

## Раздел 3: Применение к Дипломной Работе (2-3 месяца)

### Месяц 1: Комплексная Система Якорей

```javascript
// Многоуровневая система для диплома
const diplomaAnchorSystem = {
  // Уровень 1: Основные источники
  primary: [
    {
      anchorId: "ANCHOR-DIPLOMA-PUBMED",
      topics: ["machine learning", "medical diagnosis"],
      weight: 2.0,
      minCitations: 50
    },
    {
      anchorId: "ANCHOR-DIPLOMA-SCHOLAR",
      topics: ["deep learning", "healthcare"],
      weight: 1.8,
      minCitations: 30
    }
  ],

  // Уровень 2: Специализированные источники
  specialized: [
    {
      anchorId: "ANCHOR-DIPLOMA-ARXIV",
      categories: ["cs.LG", "cs.CV", "cs.AI"],
      weight: 1.2,
      dateRange: "2022-2024"
    },
    {
      anchorId: "ANCHOR-DIPLOMA-IEEE",
      conferences: ["CVPR", "ICCV", "NeurIPS"],
      weight: 1.5
    }
  ],

  // Уровень 3: Дополнительные данные
  supplementary: [
    {
      anchorId: "ANCHOR-DIPLOMA-DATASETS",
      type: "data",
      sources: ["Kaggle", "UCI", "ImageNet"]
    },
    {
      anchorId: "ANCHOR-DIPLOMA-CODE",
      type: "github",
      repos: ["tensorflow", "pytorch", "scikit-learn"]
    }
  ]
};
```

### Месяц 2: Мониторинг Цитирований

```javascript
// Якорь для отслеживания релевантных цитирований
{
  anchorId: "ANCHOR-DIPLOMA-CITATION-TRACKING",
  name: "Отслеживание цитирований ключевых работ",

  type: "api",

  keyPapers: [
    "10.1038/nature14539",  // Deep Learning (LeCun et al.)
    "10.1038/s41586-019-1924-6",  // AI in Medicine
    // ... другие ключевые DOI
  ],

  source: {
    url: "https://api.crossref.org/works",
    method: "GET"
  },

  transform: {
    function: `
      async function transform(keyPapers) {
        const citationData = [];

        for (const doi of keyPapers) {
          const response = await fetch(
            'https://api.crossref.org/works/' + doi
          );
          const data = await response.json();

          citationData.push({
            doi: doi,
            title: data.message.title[0],
            citedBy: data.message['is-referenced-by-count'],
            authors: data.message.author,
            year: data.message.published['date-parts'][0][0],

            // Получение списка цитирующих работ
            citingWorks: await fetchCitingWorks(doi)
          });
        }

        return { citations: citationData };
      }

      async function fetchCitingWorks(doi) {
        const response = await fetch(
          'https://opencitations.net/index/coci/api/v1/citations/' + doi
        );
        return await response.json();
      }
    `
  },

  refresh: {
    mode: "schedule",
    schedule: "0 0 * * 1"  // Каждый понедельник
  }
}
```

### Месяц 3: Автоматическая Компиляция Главы "Обзор Литературы"

```javascript
class LiteratureReviewGenerator {
  constructor(anchorIds) {
    this.anchorIds = anchorIds;
    this.sections = new Map();
  }

  // Группировка статей по темам
  async categorizeArticles() {
    const allArticles = [];

    for (const anchorId of this.anchorIds) {
      const data = anchorManager.getData(anchorId);
      allArticles.push(...data.articles);
    }

    // ML кластеризация статей по темам
    const topics = await this.clusterByTopics(allArticles);

    topics.forEach(topic => {
      this.sections.set(topic.name, topic.articles);
    });
  }

  async clusterByTopics(articles) {
    // Использование TF-IDF + K-means для кластеризации
    const vectors = articles.map(a =>
      this.textToVector(a.title + ' ' + a.abstract)
    );

    const kmeans = new KMeans(5);  // 5 основных тем
    const clusters = kmeans.fit(vectors);

    return clusters.map((cluster, idx) => ({
      name: this.inferTopicName(cluster.articles),
      articles: cluster.articles
    }));
  }

  // Генерация текста обзора
  generateMarkdown() {
    let markdown = '# Глава 2. Обзор Литературы\n\n';

    for (const [topicName, articles] of this.sections) {
      markdown += `## 2.${this.sections.size}. ${topicName}\n\n`;

      // Группировка статей по годам
      const byYear = this.groupByYear(articles);

      for (const [year, yearArticles] of byYear) {
        markdown += `### Работы ${year} года\n\n`;

        yearArticles.forEach(article => {
          markdown += this.formatArticleCitation(article);
        });
      }
    }

    return markdown;
  }

  formatArticleCitation(article) {
    return `
**${article.title}** (${article.authors}, ${article.year})

${article.abstract || article.summary}

*Ключевые результаты:*
${this.extractKeyFindings(article)}

*Релевантность для исследования:*
${this.assessRelevance(article)}

---
    `;
  }

  extractKeyFindings(article) {
    // Извлечение ключевых находок с помощью NLP
    // (можно использовать GPT API для суммаризации)
    return article.summary;
  }

  assessRelevance(article) {
    // Оценка релевантности для текущего исследования
    const keywords = this.extractKeywords(article);
    const myKeywords = ["machine learning", "diagnosis", "CNN"];

    const overlap = keywords.filter(k => myKeywords.includes(k)).length;

    if (overlap >= 2) {
      return "Высокая релевантность - прямое отношение к теме исследования";
    } else if (overlap === 1) {
      return "Средняя релевантность - затрагивает смежные вопросы";
    } else {
      return "Низкая релевантность - общий контекст области";
    }
  }
}

// Использование
const generator = new LiteratureReviewGenerator([
  'ANCHOR-DIPLOMA-PUBMED',
  'ANCHOR-DIPLOMA-SCHOLAR',
  'ANCHOR-DIPLOMA-ARXIV'
]);

await generator.categorizeArticles();
const literatureReview = generator.generateMarkdown();

fs.writeFileSync('./chapters/02_literature_review.md', literatureReview);
```

---

## Раздел 4: Применение к Диссертации (1-2 года)

### Долгосрочная Система Мониторинга

```javascript
// Полноценная система для кандидатской/докторской диссертации
const dissertationAnchorEcosystem = {
  // 1. Глобальный мониторинг литературы
  literatureMonitoring: {
    databases: [
      {
        anchorId: "ANCHOR-DISS-PUBMED-GLOBAL",
        queries: [
          "machine learning AND cancer detection",
          "deep learning AND oncology",
          "AI AND tumor classification"
        ],
        refresh: "daily",
        minImpactFactor: 5.0
      },
      {
        anchorId: "ANCHOR-DISS-WOS",  // Web of Science
        source: {
          url: "https://wos-api.clarivate.com/api/wos",
          auth: { type: "apikey", key: process.env.WOS_API_KEY }
        },
        filters: {
          documentTypes: ["Article", "Review"],
          categories: ["Computer Science, AI", "Medicine, Research"]
        }
      },
      {
        anchorId: "ANCHOR-DISS-SCOPUS",
        source: {
          url: "https://api.elsevier.com/content/search/scopus",
          auth: { type: "apikey", key: process.env.SCOPUS_API_KEY }
        }
      }
    ]
  },

  // 2. Отслеживание конкурентов и коллабораций
  competitorTracking: {
    researchers: [
      {
        anchorId: "ANCHOR-DISS-RESEARCHER-001",
        name: "Geoffrey Hinton",
        orcid: "0000-0002-1495-0454",
        trackPublications: true,
        trackCitations: true
      },
      {
        anchorId: "ANCHOR-DISS-RESEARCHER-002",
        name: "Andrew Ng",
        googleScholarId: "JicYPdAAAAAJ"
      }
    ],

    labs: [
      {
        anchorId: "ANCHOR-DISS-LAB-MIT",
        institution: "MIT CSAIL",
        rssFeeds: ["http://csail.mit.edu/news/rss"]
      }
    ]
  },

  // 3. Мониторинг датасетов и бенчмарков
  datasetTracking: {
    anchors: [
      {
        anchorId: "ANCHOR-DISS-DATASETS",
        sources: [
          "https://www.kaggle.com/datasets",
          "https://paperswithcode.com/datasets",
          "https://huggingface.co/datasets"
        ],
        filters: {
          domain: "medical-imaging",
          minSize: "1GB",
          license: ["CC BY", "MIT", "Apache 2.0"]
        }
      }
    ]
  },

  // 4. Отслеживание конференций и дедлайнов
  conferences: {
    anchorId: "ANCHOR-DISS-CONFERENCES",
    tracks: [
      { name: "NeurIPS", url: "https://neurips.cc" },
      { name: "ICML", url: "https://icml.cc" },
      { name: "CVPR", url: "https://cvpr.org" },
      { name: "MICCAI", url: "https://www.miccai.org" }
    ],

    // Автоматическое напоминание о дедлайнах
    notifications: {
      email: true,
      slack: true,
      leadTime: 30  // дней до дедлайна
    }
  },

  // 5. Версионирование собственных публикаций
  ownPublications: {
    anchorId: "ANCHOR-DISS-OWN-PUBS",
    trackMetrics: {
      citations: true,
      downloads: true,
      altmetrics: true,
      socialMedia: true
    },

    sources: [
      "Google Scholar",
      "ResearchGate",
      "Mendeley",
      "Academia.edu"
    ]
  }
};
```

### Автоматическая Генерация Библиографии (500+ источников)

```javascript
class DissertationBibliographyManager {
  constructor() {
    this.sources = new Map();
    this.categories = new Map();
    this.usageTracker = new Map();
  }

  // Добавление источника из якоря
  async importFromAnchor(anchorId, category) {
    const data = anchorManager.getData(anchorId);

    data.articles.forEach(article => {
      const sourceId = this.generateSourceId(article);

      this.sources.set(sourceId, {
        ...article,
        category: category,
        importedFrom: anchorId,
        importDate: new Date(),
        usageCount: 0,
        citedInChapters: []
      });

      // Категоризация
      if (!this.categories.has(category)) {
        this.categories.set(category, []);
      }
      this.categories.get(category).push(sourceId);
    });
  }

  // Отслеживание использования источника
  markAsUsed(sourceId, chapterNumber, pageNumber) {
    const source = this.sources.get(sourceId);

    if (source) {
      source.usageCount++;
      source.citedInChapters.push({
        chapter: chapterNumber,
        page: pageNumber,
        date: new Date()
      });

      this.usageTracker.set(sourceId, source);
    }
  }

  // Фильтрация по критериям важности
  filterByImportance(minCitations = 10, minYear = 2015) {
    return Array.from(this.sources.values())
      .filter(source =>
        source.citedBy >= minCitations &&
        source.year >= minYear
      );
  }

  // Экспорт в разные форматы
  exportToBibtex(filterFn = null) {
    const sources = filterFn
      ? Array.from(this.sources.values()).filter(filterFn)
      : Array.from(this.sources.values());

    return sources
      .sort((a, b) => a.authors.localeCompare(b.authors))
      .map(source => this.formatBibtex(source))
      .join('\n\n');
  }

  exportToEndNote() {
    // Формат EndNote
  }

  exportToMendeley() {
    // Формат Mendeley
  }

  exportToZotero() {
    // Формат Zotero
  }

  // Генерация статистики использования
  generateUsageReport() {
    const report = {
      totalSources: this.sources.size,
      usedSources: Array.from(this.sources.values())
        .filter(s => s.usageCount > 0).length,

      byCategory: {},
      byYear: {},
      byJournal: {},

      topCited: this.getTopCited(20),
      unused: this.getUnused(),

      chapterBreakdown: this.getChapterBreakdown()
    };

    // Группировка по категориям
    for (const [category, sourceIds] of this.categories) {
      report.byCategory[category] = {
        total: sourceIds.length,
        used: sourceIds.filter(id =>
          this.sources.get(id).usageCount > 0
        ).length
      };
    }

    return report;
  }

  getTopCited(n = 20) {
    return Array.from(this.sources.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, n)
      .map(source => ({
        title: source.title,
        authors: source.authors,
        usageCount: source.usageCount,
        chapters: source.citedInChapters.map(c => c.chapter)
      }));
  }

  getUnused() {
    return Array.from(this.sources.values())
      .filter(source => source.usageCount === 0)
      .map(source => ({
        title: source.title,
        category: source.category,
        year: source.year,
        importedFrom: source.importedFrom
      }));
  }

  getChapterBreakdown() {
    const breakdown = {};

    for (const source of this.sources.values()) {
      source.citedInChapters.forEach(citation => {
        const chapter = citation.chapter;

        if (!breakdown[chapter]) {
          breakdown[chapter] = {
            uniqueSources: new Set(),
            totalCitations: 0
          };
        }

        breakdown[chapter].uniqueSources.add(source.title);
        breakdown[chapter].totalCitations++;
      });
    }

    // Конвертация Set в count
    for (const chapter in breakdown) {
      breakdown[chapter].uniqueSources =
        breakdown[chapter].uniqueSources.size;
    }

    return breakdown;
  }

  // Автоматическое удаление дубликатов
  async detectDuplicates() {
    const duplicates = [];
    const sources = Array.from(this.sources.values());

    for (let i = 0; i < sources.length; i++) {
      for (let j = i + 1; j < sources.length; j++) {
        const similarity = this.calculateSimilarity(
          sources[i],
          sources[j]
        );

        if (similarity > 0.9) {
          duplicates.push({
            source1: sources[i],
            source2: sources[j],
            similarity: similarity
          });
        }
      }
    }

    return duplicates;
  }

  calculateSimilarity(source1, source2) {
    // Левенштейн для заголовков
    const titleSim = this.levenshteinSimilarity(
      source1.title,
      source2.title
    );

    // Сравнение авторов
    const authorSim = this.authorSimilarity(
      source1.authors,
      source2.authors
    );

    // Год и DOI
    const yearMatch = source1.year === source2.year ? 1 : 0;
    const doiMatch = source1.doi === source2.doi ? 1 : 0;

    // Взвешенная сумма
    return (
      titleSim * 0.4 +
      authorSim * 0.3 +
      yearMatch * 0.15 +
      doiMatch * 0.15
    );
  }

  formatBibtex(source) {
    const type = source.type || 'article';
    const id = this.generateBibtexId(source);

    return `@${type}{${id},
  author = {${source.authors}},
  title = {${source.title}},
  journal = {${source.journal}},
  year = {${source.year}},
  volume = {${source.volume || ''}},
  number = {${source.number || ''}},
  pages = {${source.pages || ''}},
  doi = {${source.doi}},
  url = {${source.url}},
  note = {Cited ${source.usageCount} times in dissertation}
}`;
  }

  generateBibtexId(source) {
    const firstAuthor = source.authors.split(',')[0]
      .trim()
      .split(' ')
      .pop()
      .toLowerCase();

    const year = source.year;
    const titleWord = source.title.split(' ')[0].toLowerCase();

    return `${firstAuthor}${year}${titleWord}`;
  }
}

// Использование для диссертации
const bibManager = new DissertationBibliographyManager();

// Импорт из всех якорей
await bibManager.importFromAnchor('ANCHOR-DISS-PUBMED-GLOBAL', 'Medical AI');
await bibManager.importFromAnchor('ANCHOR-DISS-WOS', 'Machine Learning');
await bibManager.importFromAnchor('ANCHOR-DISS-SCOPUS', 'Computer Vision');
await bibManager.importFromAnchor('ANCHOR-DISS-ARXIV', 'Recent Preprints');

// Отслеживание использования в тексте
// (автоматически при вставке цитат)
bibManager.markAsUsed('hinton2012deep', 1, 15);
bibManager.markAsUsed('lecun2015deep', 1, 18);

// Генерация финального списка литературы
const bibtex = bibManager.exportToBibtex(
  source => source.usageCount > 0  // Только использованные
);

fs.writeFileSync('./dissertation_references.bib', bibtex);

// Отчет об использовании
const report = bibManager.generateUsageReport();
console.log(`
Статистика библиографии:
- Всего источников: ${report.totalSources}
- Использовано: ${report.usedSources}
- Не использовано: ${report.totalSources - report.usedSources}

Топ-5 наиболее цитируемых:
${report.topCited.slice(0, 5).map(s =>
  `  - ${s.title} (${s.usageCount} раз)`
).join('\n')}

Распределение по главам:
${Object.entries(report.chapterBreakdown).map(([ch, data]) =>
  `  Глава ${ch}: ${data.uniqueSources} источников, ${data.totalCitations} цитат`
).join('\n')}
`);
```

---

## Раздел 5: Интеграция с Zotero/Mendeley

### Якорь для Zotero API

```javascript
{
  anchorId: "ANCHOR-ZOTERO-SYNC",
  name: "Синхронизация с библиотекой Zotero",

  type: "api",

  source: {
    url: "https://api.zotero.org/users/{userId}/items",
    method: "GET",

    auth: {
      type: "bearer",
      token: process.env.ZOTERO_API_KEY
    },

    headers: {
      "Zotero-API-Version": "3"
    },

    params: {
      format: "json",
      limit: 100,
      sort: "dateModified",
      direction: "desc"
    }
  },

  // Двусторонняя синхронизация
  sync: {
    direction: "bidirectional",  // pull, push, bidirectional

    // Загрузка новых источников из Zotero
    pull: {
      enabled: true,
      schedule: "0 */6 * * *"  // Каждые 6 часов
    },

    // Отправка источников из якорей в Zotero
    push: {
      enabled: true,
      onNewSource: true,  // При добавлении нового источника
      batchSize: 50
    }
  },

  transform: {
    function: `
      function transform(zoteroItems) {
        return {
          items: zoteroItems.map(item => ({
            key: item.key,
            version: item.version,
            library: item.library,

            // Метаданные
            type: item.data.itemType,
            title: item.data.title,
            creators: item.data.creators,
            date: item.data.date,

            // Публикация
            publicationTitle: item.data.publicationTitle,
            volume: item.data.volume,
            issue: item.data.issue,
            pages: item.data.pages,

            // Идентификаторы
            doi: item.data.DOI,
            isbn: item.data.ISBN,
            issn: item.data.ISSN,
            url: item.data.url,

            // Теги и коллекции
            tags: item.data.tags.map(t => t.tag),
            collections: item.data.collections,

            // Вложения (PDF)
            attachments: item.data.attachments
          }))
        };
      }
    `
  }
}
```

### Автоматическое Добавление Статей в Zotero

```javascript
class ZoteroIntegration {
  constructor(apiKey, userId) {
    this.apiKey = apiKey;
    this.userId = userId;
    this.baseUrl = `https://api.zotero.org/users/${userId}`;
  }

  // Добавление статьи из PubMed/arXiv в Zotero
  async addArticleToZotero(article, collection = null) {
    const zoteroItem = this.convertToZoteroFormat(article);

    const response = await fetch(`${this.baseUrl}/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Zotero-API-Version': '3'
      },
      body: JSON.stringify([zoteroItem])
    });

    const result = await response.json();

    // Добавление в коллекцию
    if (collection) {
      await this.addToCollection(result.successful[0].key, collection);
    }

    // Автоматическое скачивание PDF
    if (article.pdfUrl) {
      await this.attachPDF(result.successful[0].key, article.pdfUrl);
    }

    return result;
  }

  convertToZoteroFormat(article) {
    return {
      itemType: 'journalArticle',
      title: article.title,
      creators: this.parseAuthors(article.authors),
      abstractNote: article.abstract,
      publicationTitle: article.journal,
      volume: article.volume,
      issue: article.issue,
      pages: article.pages,
      date: article.pubDate,
      DOI: article.doi,
      url: article.url,
      tags: article.keywords?.map(k => ({ tag: k })) || [],
      collections: []
    };
  }

  parseAuthors(authorsString) {
    // "Smith J, Doe A" -> [{lastName: "Smith", firstName: "J"}, ...]
    return authorsString.split(',').map(author => {
      const parts = author.trim().split(' ');
      return {
        creatorType: 'author',
        lastName: parts[0],
        firstName: parts.slice(1).join(' ')
      };
    });
  }

  async attachPDF(itemKey, pdfUrl) {
    // Скачивание PDF
    const pdfResponse = await fetch(pdfUrl);
    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Загрузка в Zotero
    await fetch(`${this.baseUrl}/items/${itemKey}/file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/pdf',
        'If-None-Match': '*'
      },
      body: pdfBuffer
    });
  }

  // Создание коллекции для каждой главы диссертации
  async createChapterCollections() {
    const chapters = [
      { name: "Глава 1: Введение", key: "chapter1" },
      { name: "Глава 2: Обзор литературы", key: "chapter2" },
      { name: "Глава 3: Методология", key: "chapter3" },
      { name: "Глава 4: Эксперименты", key: "chapter4" },
      { name: "Глава 5: Результаты", key: "chapter5" },
      { name: "Глава 6: Заключение", key: "chapter6" }
    ];

    for (const chapter of chapters) {
      await fetch(`${this.baseUrl}/collections`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Zotero-API-Version': '3'
        },
        body: JSON.stringify({
          name: chapter.name,
          parentCollection: false
        })
      });
    }
  }
}

// Использование
const zotero = new ZoteroIntegration(
  process.env.ZOTERO_API_KEY,
  process.env.ZOTERO_USER_ID
);

// Автоматическое добавление новых статей из якорей
anchorManager.on('ANCHOR-PUBMED-001', 'update', async (data) => {
  for (const article of data.articles) {
    // Проверка, что статья еще не добавлена
    const exists = await zotero.checkIfExists(article.doi);

    if (!exists) {
      await zotero.addArticleToZotero(article, 'chapter2');  // Глава 2
      console.log(`✓ Добавлено в Zotero: ${article.title}`);
    }
  }
});
```

---

## Раздел 6: Практические Чек-Листы

### Чек-Лист: Настройка Якорей для Курсовой Работы

```markdown
# Настройка Системы Якорей для Курсовой (3-4 недели)

## Неделя 1: Подготовка

- [ ] Определить тему и ключевые слова исследования
- [ ] Создать якорь для Google Scholar (ANCHOR-COURSE-SCHOLAR)
  - [ ] Настроить поисковые запросы (3-5 ключевых фраз)
  - [ ] Установить фильтр по годам (последние 5 лет)
  - [ ] Запустить первичный сбор (30-50 статей)

- [ ] Создать якорь для arXiv (если релевантно)
  - [ ] Выбрать категории (cs.AI, cs.LG, etc.)
  - [ ] Настроить сортировку по дате

- [ ] Настроить локальное хранилище
  - [ ] Создать папку ./references/
  - [ ] Инициализировать BibTeX файл
  - [ ] Настроить автоматический backup

## Неделя 2: Сбор и Фильтрация

- [ ] Проверить качество собранных источников
  - [ ] Минимум 20 релевантных статей
  - [ ] Удалить дубликаты
  - [ ] Проверить доступность полных текстов

- [ ] Настроить автоматическую фильтрацию
  - [ ] По числу цитирований (min: 5)
  - [ ] По импакт-фактору журнала
  - [ ] По релевантности ключевым словам

- [ ] Интеграция с Zotero/Mendeley
  - [ ] Импортировать топ-30 источников
  - [ ] Организовать по коллекциям
  - [ ] Добавить теги

## Неделя 3: Анализ и Использование

- [ ] Начать цитирование в тексте
  - [ ] Отслеживать использование через markAsUsed()
  - [ ] Проверять корректность цитат

- [ ] Настроить мониторинг новых публикаций
  - [ ] RSS-якоря для топ-журналов (3-5 источников)
  - [ ] Еженедельная проверка обновлений

- [ ] Генерация промежуточного списка литературы
  - [ ] Экспорт в BibTeX
  - [ ] Проверка форматирования
  - [ ] Удаление неиспользованных источников

## Неделя 4: Финализация

- [ ] Финальная компиляция библиографии
  - [ ] Проверить все цитаты в тексте
  - [ ] Убедиться в отсутствии дубликатов
  - [ ] Проверить корректность мета-данных

- [ ] Генерация отчета использования
  - [ ] Количество источников: 25-35
  - [ ] Процент использования: >80%
  - [ ] Средний год публикации: 2019-2024

- [ ] Экспорт в требуемый формат
  - [ ] BibTeX для LaTeX
  - [ ] Word-совместимый формат
  - [ ] Проверка по ГОСТ (если требуется)

## Контроль Качества

- [ ] Все источники имеют полные мета-данные
- [ ] Каждый источник использован минимум 1 раз
- [ ] Нет дубликатов или конфликтующих записей
- [ ] Форматирование соответствует требованиям
- [ ] Создан backup всей библиографии
```

### Чек-Лист: Настройка Якорей для Диплома

```markdown
# Настройка Системы Якорей для Диплома (2-3 месяца)

## Месяц 1: Комплексная Настройка

### Неделя 1-2: Базовая Инфраструктура

- [ ] Создать многоуровневую систему якорей
  - [ ] Уровень 1: Основные БД (PubMed, Web of Science, Scopus)
    - [ ] ANCHOR-DIPLOMA-PUBMED (медицина/биология)
    - [ ] ANCHOR-DIPLOMA-WOS (мультидисциплинарный)
    - [ ] ANCHOR-DIPLOMA-SCOPUS (инженерия/CS)

  - [ ] Уровень 2: Специализированные источники
    - [ ] ANCHOR-DIPLOMA-IEEE (конференции)
    - [ ] ANCHOR-DIPLOMA-ARXIV (препринты)
    - [ ] ANCHOR-DIPLOMA-SCHOLAR (общий поиск)

  - [ ] Уровень 3: Дополнительные данные
    - [ ] ANCHOR-DIPLOMA-DATASETS (наборы данных)
    - [ ] ANCHOR-DIPLOMA-GITHUB (код и репозитории)
    - [ ] ANCHOR-DIPLOMA-RSS (журналы)

- [ ] Настроить систему управления библиографией
  - [ ] Инициализировать DissertationBibliographyManager
  - [ ] Создать структуру категорий (6-8 основных)
  - [ ] Настроить автоматическое дедублирование

- [ ] Интеграция с менеджерами литературы
  - [ ] Подключить Zotero API
  - [ ] Создать коллекции по главам
  - [ ] Настроить автоматический импорт

### Неделя 3-4: Настройка Мониторинга

- [ ] RSS-якоря для ключевых журналов (10-15)
  - [ ] Nature, Science, Cell (если биомед)
  - [ ] IEEE, ACM (если CS/инженерия)
  - [ ] Специализированные журналы области

- [ ] Отслеживание конференций
  - [ ] Список целевых конференций (5-7)
  - [ ] Мониторинг дедлайнов
  - [ ] Отслеживание accepted papers

- [ ] Мониторинг исследователей
  - [ ] Топ-10 лидеров области
  - [ ] Потенциальные коллабораторы
  - [ ] Конкуренты (схожие темы)

## Месяц 2: Активный Сбор и Анализ

### Неделя 5-6: Глубокий Анализ

- [ ] Сбор 100-150 основных источников
  - [ ] Фильтрация по релевантности
  - [ ] Проверка доступности полных текстов
  - [ ] Категоризация по темам

- [ ] Создание карты литературы
  - [ ] Кластеризация статей по темам
  - [ ] Визуализация связей между источниками
  - [ ] Идентификация ключевых работ

- [ ] Настройка трекинга цитирований
  - [ ] Отслеживание 20-30 ключевых работ
  - [ ] Мониторинг обратных цитирований
  - [ ] Анализ цитируемости

### Неделя 7-8: Интеграция в Текст

- [ ] Начать активное цитирование
  - [ ] Глава 1 (Введение): 15-20 источников
  - [ ] Глава 2 (Обзор): 50-70 источников
  - [ ] Главы 3-4 (Методы/Эксперименты): 30-40

- [ ] Использовать систему отслеживания
  - [ ] markAsUsed() для каждой цитаты
  - [ ] Отслеживание номеров глав и страниц
  - [ ] Генерация промежуточных отчетов

## Месяц 3: Финализация

### Неделя 9-10: Полнота и Качество

- [ ] Проверка полноты покрытия
  - [ ] Все основные направления освещены
  - [ ] Нет пробелов в аргументации
  - [ ] Баланс между источниками разных типов

- [ ] Обновление якорей последний раз
  - [ ] Проверка на новые важные публикации
  - [ ] Добавление последних препринтов
  - [ ] Финальная дедупликация

### Неделя 11-12: Финальная Компиляция

- [ ] Генерация итогового списка литературы
  - [ ] Цель: 80-120 источников
  - [ ] Экспорт в BibTeX/EndNote
  - [ ] Форматирование по ГОСТ/APA/другому стилю

- [ ] Проверка всех метаданных
  - [ ] DOI для всех современных статей
  - [ ] Корректные годы и авторы
  - [ ] Проверка через Crossref API

- [ ] Генерация финальных отчетов
  - [ ] Статистика использования
  - [ ] Распределение по годам
  - [ ] Топ-цитируемые работы
  - [ ] Coverage report (какие темы покрыты)

## Контроль Качества

- [ ] Количество источников: 80-120
- [ ] Процент использования: >75%
- [ ] Средний год публикации: 2018-2024
- [ ] Процент высокоимпактных журналов: >40%
- [ ] Баланс типов источников:
  - [ ] Журналы: 60-70%
  - [ ] Конференции: 20-25%
  - [ ] Препринты/Другое: 5-15%
- [ ] Отсутствие дубликатов (проверено автоматически)
- [ ] Все источники доступны (PDF или доступ через вуз)
```

### Чек-Лист: Настройка Якорей для Диссертации

```markdown
# Настройка Системы Якорей для Диссертации (1-2 года)

## Фаза 1: Инициализация (Месяцы 1-3)

### Глобальная Архитектура

- [ ] Развернуть полную экосистему якорей
  - [ ] 5-7 основных баз данных
  - [ ] 15-20 RSS-фидов журналов
  - [ ] 10-15 отслеживаемых исследователей
  - [ ] 5-10 лабораторий/институтов
  - [ ] Мониторинг 8-12 конференций

- [ ] Настроить долгосрочное хранилище
  - [ ] MongoDB для метаданных
  - [ ] S3/локальное хранилище для PDF
  - [ ] Git репозиторий для версионирования
  - [ ] Автоматический backup (ежедневный)

- [ ] Интеграция с инструментами
  - [ ] Zotero/Mendeley (основная библиотека)
  - [ ] Notion/Obsidian (заметки)
  - [ ] Slack/Email (уведомления)
  - [ ] Jupyter Notebooks (анализ)

### Базовый Сбор

- [ ] Первичный сбор широкого спектра
  - [ ] Цель: 300-500 потенциальных источников
  - [ ] Покрытие всех аспектов темы
  - [ ] Включая исторический контекст

- [ ] Систематический обзор литературы
  - [ ] Следование PRISMA guidelines
  - [ ] Документирование критериев включения/исключения
  - [ ] Создание PRISMA flow diagram

- [ ] Создание онтологии предметной области
  - [ ] Таксономия концепций
  - [ ] Связи между областями
  - [ ] Визуализация знаний

## Фаза 2: Активная Работа (Месяцы 4-18)

### Непрерывный Мониторинг

- [ ] Еженедельные задачи
  - [ ] Проверка обновлений якорей
  - [ ] Добавление 3-5 новых источников
  - [ ] Обновление категоризации
  - [ ] Резервное копирование

- [ ] Ежемесячные задачи
  - [ ] Обзор новых важных публикаций
  - [ ] Обновление списка отслеживаемых авторов
  - [ ] Анализ трендов (что становится популярным)
  - [ ] Генерация отчетов прогресса

- [ ] Ежеквартальные задачи
  - [ ] Глубокий анализ покрытия
  - [ ] Ревизия и очистка библиотеки
  - [ ] Обновление поисковых запросов
  - [ ] Планирование на следующий квартал

### Интеграция в Написание

- [ ] Параллельное написание и сбор
  - [ ] Цитировать по мере написания
  - [ ] Отслеживать пробелы в литературе
  - [ ] Добавлять якоря для новых направлений

- [ ] Использование системы отслеживания
  - [ ] Детальный трекинг (глава, раздел, параграф)
  - [ ] Связывание цитат с аргументами
  - [ ] Версионирование цитат (на случай обновлений)

### Качественный Анализ

- [ ] Систематический анализ источников
  - [ ] Критическая оценка каждого источника
  - [ ] Идентификация методологических слабостей
  - [ ] Выявление противоречий в литературе

- [ ] Построение аргументации
  - [ ] Карта аргументов с цитатами
  - [ ] Идентификация research gaps
  - [ ] Обоснование новизны исследования

## Фаза 3: Финализация (Месяцы 19-24)

### Последние 6 Месяцев

- [ ] Финальное обновление (месяц -6)
  - [ ] Последний широкий поиск
  - [ ] Добавление новейших работ (last 6 months)
  - [ ] Проверка цитируемости ключевых работ

- [ ] Полная проверка (месяц -3)
  - [ ] Верификация всех метаданных
  - [ ] Проверка доступности всех источников
  - [ ] Тестирование всех ссылок/DOI
  - [ ] Форматирование по стандарту

- [ ] Финальная компиляция (месяц -1)
  - [ ] Генерация итогового списка (200-400 источников)
  - [ ] Проверка соответствия требованиям ВАК
  - [ ] Статистический анализ библиографии
  - [ ] Создание дополнительных материалов

### Подготовка к Защите

- [ ] Создание производных материалов
  - [ ] Список ключевых 20-30 работ для заучивания
  - [ ] Карточки с основными цитатами
  - [ ] Хронологическая таблица развития области
  - [ ] Визуальные материалы (графики цитирований)

- [ ] Автоматизация отчетности
  - [ ] Скрипты для генерации статистики
  - [ ] Визуализации библиографического анализа
  - [ ] Экспорт в различные форматы

## Метрики Успеха

### Количественные

- [ ] Объем библиографии
  - [ ] Кандидатская: 150-250 источников
  - [ ] Докторская: 300-500 источников

- [ ] Качество источников
  - [ ] >50% из журналов Q1/Q2 (SJR)
  - [ ] >30% за последние 5 лет
  - [ ] >70% на английском языке (для технических наук)

- [ ] Покрытие
  - [ ] Все ключевые работы области цитированы
  - [ ] Исторический контекст представлен (10-20% старых работ)
  - [ ] Новейшие тренды отражены (10-15% препринтов/last year)

### Качественные

- [ ] Систематичность
  - [ ] Следование PRISMA или аналогичным стандартам
  - [ ] Документированные критерии отбора
  - [ ] Воспроизводимость поиска

- [ ] Критичность
  - [ ] Анализ противоречий в литературе
  - [ ] Идентификация методологических проблем
  - [ ] Обоснование research gap

- [ ] Актуальность
  - [ ] Включение работ до момента подачи
  - [ ] Отслеживание препринтов ключевых авторов
  - [ ] Мониторинг важных конференций

## Автоматизация и Инструменты

- [ ] CI/CD для библиографии
  - [ ] Автоматические daily/weekly обновления
  - [ ] Проверка дубликатов
  - [ ] Валидация метаданных
  - [ ] Генерация отчетов

- [ ] Резервное копирование
  - [ ] Локальный backup (ежедневно)
  - [ ] Cloud backup (еженедельно)
  - [ ] Git версионирование (при каждом изменении)
  - [ ] Экспорт в нескольких форматах

- [ ] Мониторинг и алерты
  - [ ] Email при появлении важных публикаций
  - [ ] Slack уведомления о новых цитированиях
  - [ ] Дедлайны конференций
  - [ ] Обновления от отслеживаемых авторов
```

---

## Заключение

Система плагинов и якорей предоставляет мощный инструментарий для:

1. **Автоматизации сбора** академических источников из множества баз данных
2. **Непрерывного мониторинга** новых публикаций, цитирований, и трендов
3. **Интеграции разнородных источников** (PubMed, arXiv, Google Scholar, RSS)
4. **Версионирования библиографии** в соответствии с эволюцией исследования
5. **Масштабирования** от курсовой работы (30 источников) до диссертации (500+)

Ключевые преимущества:
- ✅ Полная автоматизация рутинных задач
- ✅ Гарантированная актуальность источников
- ✅ Отслеживание использования каждого источника
- ✅ Интеграция с популярными инструментами (Zotero, Mendeley)
- ✅ Масштабируемость от малых до крупных проектов

---

**Документ создан:** 2024-12-28
**Версия:** 2.0
**Основан на:** PLUGIN_ANCHOR_SYSTEM.md
**Дополнения:** Применение к научной работе, интеграция с академическими БД
