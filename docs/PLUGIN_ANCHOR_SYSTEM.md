# Система Плагинов и Якорей

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

**Версия:** 1.0
**Дата:** 2024-12-28
**Статус:** Система Плагинов и Якорей
