# Техническая Спецификация: Система Динамического Каталога

## 📑 Содержание

1. [Системные Требования](#системные-требования)
2. [Компонентная Архитектура](#компонентная-архитектура)
3. [API Спецификация](#api-спецификация)
4. [Структура Базы Данных](#структура-базы-данных)
5. [Frontend Компоненты](#frontend-компоненты)
6. [Система Обновления](#система-обновления)
7. [Безопасность](#безопасность)
8. [Оптимизация](#оптимизация)

---

## 🖥️ Системные Требования

### Серверные Требования

```yaml
Production:
  CPU: 2+ cores
  RAM: 4GB minimum, 8GB recommended
  Storage: 50GB+ (зависит от объема изображений)
  Node.js: 20.x LTS
  MongoDB: 7.0+
  Redis: 7.0+

Development:
  CPU: 2+ cores
  RAM: 8GB
  Storage: 20GB
  Node.js: 20.x
  MongoDB: 7.0+
```

### Клиентские Требования

```yaml
Поддерживаемые браузеры:
  - Chrome: 120+
  - Firefox: 120+
  - Safari: 17+
  - Edge: 120+

Минимальное разрешение: 320px (mobile)
Оптимальное разрешение: 1920px (desktop)
```

---

## 🧩 Компонентная Архитектура

### Frontend: React Component Tree

```
App
├── Providers
│   ├── AuthProvider          # Контекст аутентификации
│   ├── ThemeProvider         # Темизация
│   └── CatalogProvider       # Состояние каталога
│
├── Router
│   ├── PublicRoute
│   │   ├── HomePage          # Главная страница
│   │   ├── CatalogPage       # Страница категории
│   │   └── ItemDetailPage    # Детальный просмотр
│   │
│   └── ProtectedRoute
│       ├── AdminDashboard    # Админ-панель
│       └── EditorPanel       # Панель редактора
│
└── Layouts
    ├── MainLayout
    │   ├── Header
    │   │   ├── Logo
    │   │   ├── SearchBar
    │   │   └── UserMenu
    │   │
    │   ├── Navigation
    │   │   └── Breadcrumb
    │   │
    │   ├── MainContent
    │   │   └── {children}
    │   │
    │   └── Footer
    │
    └── CatalogLayout
        ├── CatalogHeader
        │   ├── Title
        │   ├── Description
        │   └── MetaTags
        │
        └── CatalogGrid
            └── GridCell[]
                ├── CardPreview
                │   ├── Thumbnail
                │   ├── Title
                │   ├── Description
                │   ├── TagList
                │   └── Counter
                │
                └── CardActions
```

---

## 🔌 API Спецификация

### REST API Endpoints

#### 1. Catalog Items

##### GET /api/catalog

Получить корневые категории или элементы

**Query Parameters:**
```typescript
{
  page?: number;        // Номер страницы (default: 1)
  limit?: number;       // Элементов на странице (default: 20)
  sort?: string;        // Поле сортировки (default: 'order')
  order?: 'asc'|'desc'; // Порядок сортировки
  type?: string;        // Фильтр по типу
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "cat-123",
        "title": "Марки",
        "description": "Коллекция почтовых марок",
        "type": "category",
        "thumbnail": "/images/stamps-thumb.jpg",
        "childrenCount": 245,
        "tags": ["марки", "коллекция"],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 8,
      "page": 1,
      "pages": 1,
      "limit": 20
    }
  }
}
```

##### GET /api/catalog/:id

Получить конкретный элемент

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "cat-123",
    "title": "Марки Европы",
    "description": "Подробное описание коллекции...",
    "type": "category",
    "thumbnail": "/images/europe-stamps.jpg",
    "images": [
      "/images/europe-1.jpg",
      "/images/europe-2.jpg"
    ],
    "parentId": "cat-parent",
    "path": "/марки/европа",
    "level": 2,
    "tags": ["марки", "европа"],
    "metadata": {
      "author": "Коллекционер",
      "year": 2024,
      "customFields": {}
    },
    "children": ["cat-france", "cat-germany"],
    "childrenCount": 45,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-12-28T14:20:00Z"
  }
}
```

##### GET /api/catalog/:id/children

Получить дочерние элементы

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc'|'desc';
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "parent": {
      "_id": "cat-123",
      "title": "Марки Европы"
    },
    "items": [
      {
        "_id": "cat-france",
        "title": "Франция",
        "thumbnail": "/images/france.jpg",
        "childrenCount": 45
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "pages": 1
    }
  }
}
```

##### POST /api/catalog

Создать новый элемент

**Request Body:**
```json
{
  "title": "Новая категория",
  "description": "Описание...",
  "type": "category",
  "parentId": "parent-id",
  "tags": ["tag1", "tag2"],
  "thumbnail": "base64-image-or-url",
  "metadata": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new-cat-id",
    "title": "Новая категория",
    "path": "/parent/новая-категория",
    "createdAt": "2024-12-28T15:00:00Z"
  }
}
```

##### PUT /api/catalog/:id

Обновить элемент

**Request Body:**
```json
{
  "title": "Обновленное название",
  "description": "Новое описание",
  "tags": ["новый", "тег"]
}
```

##### DELETE /api/catalog/:id

Удалить элемент

**Query Parameters:**
```typescript
{
  recursive?: boolean; // Удалить с дочерними элементами (default: false)
}
```

#### 2. Search & Navigation

##### GET /api/catalog/search

Поиск по каталогу

**Query Parameters:**
```typescript
{
  q?: string;           // Текстовый поиск
  tags?: string[];      // Фильтр по тегам
  type?: string;        // Фильтр по типу
  parentId?: string;    // Поиск внутри категории
  page?: number;
  limit?: number;
}
```

##### GET /api/catalog/breadcrumb/:id

Получить путь навигации (хлебные крошки)

**Response:**
```json
{
  "success": true,
  "data": [
    { "_id": "root", "title": "Главная", "path": "/" },
    { "_id": "cat-1", "title": "Марки", "path": "/марки" },
    { "_id": "cat-2", "title": "Европа", "path": "/марки/европа" }
  ]
}
```

##### GET /api/catalog/tags

Получить все используемые теги

**Response:**
```json
{
  "success": true,
  "data": [
    { "tag": "марки", "count": 245 },
    { "tag": "европа", "count": 156 },
    { "tag": "города", "count": 89 }
  ]
}
```

#### 3. File Upload

##### POST /api/upload

Загрузить изображение

**Request:** multipart/form-data
```
file: <binary>
type: 'thumbnail' | 'image'
itemId?: string
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "/uploads/2024/12/image-123.jpg",
    "thumbnail": "/uploads/2024/12/image-123-thumb.jpg",
    "size": 245678,
    "dimensions": { "width": 1920, "height": 1080 }
  }
}
```

---

## 🗄️ Структура Базы Данных

### MongoDB Collections

#### Collection: `catalog_items`

```javascript
{
  _id: ObjectId,
  title: String,                    // Название (обязательное)
  slug: String,                     // URL-friendly название
  description: String,              // Описание
  type: String,                     // enum: category, collection, item, widget, page

  // Иерархия
  parentId: ObjectId | null,        // ID родителя (null для корневых)
  path: String,                     // Полный путь (для быстрого поиска)
  level: Number,                    // Уровень вложенности (0 = корень)
  order: Number,                    // Порядок сортировки

  // Визуальное представление
  thumbnail: String,                // URL превью-изображения
  images: [String],                 // Массив URL изображений
  icon: String,                     // Иконка (emoji или URL)
  color: String,                    // Цвет темы (#hex)

  // Метаданные
  tags: [String],                   // Теги для поиска
  metadata: {
    author: String,
    year: Number,
    source: String,
    customFields: Object            // Произвольные поля
  },

  // Связи
  children: [ObjectId],             // ID дочерних элементов
  childrenCount: Number,            // Количество детей (денормализация)

  // Контент
  content: String,                  // HTML/Markdown контент (для страниц)
  widgets: [Object],                // Конфигурация виджетов

  // Публикация
  isPublished: Boolean,             // Опубликовано
  publishedAt: Date,                // Дата публикации

  // Права доступа
  owner: ObjectId,                  // Ref: users
  permissions: {
    view: [String],                 // Роли с правом просмотра
    edit: [String],                 // Роли с правом редактирования
    delete: [String]                // Роли с правом удаления
  },

  // Системные поля
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,              // Ref: users
  updatedBy: ObjectId               // Ref: users
}
```

**Indexes:**
```javascript
db.catalog_items.createIndex({ path: 1 });
db.catalog_items.createIndex({ parentId: 1, order: 1 });
db.catalog_items.createIndex({ tags: 1 });
db.catalog_items.createIndex({ type: 1 });
db.catalog_items.createIndex({ slug: 1 }, { unique: true });
db.catalog_items.createIndex({ title: "text", description: "text" });
```

#### Collection: `users`

```javascript
{
  _id: ObjectId,
  email: String,                    // Уникальный email
  username: String,                 // Уникальное имя пользователя
  password: String,                 // Хешированный пароль
  role: String,                     // enum: guest, user, editor, admin
  profile: {
    firstName: String,
    lastName: String,
    avatar: String
  },
  createdAt: Date,
  lastLoginAt: Date
}
```

**Indexes:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
```

#### Collection: `activity_log`

```javascript
{
  _id: ObjectId,
  action: String,                   // enum: create, update, delete, view
  entity: String,                   // catalog_item, user
  entityId: ObjectId,
  userId: ObjectId,
  changes: Object,                  // Diff изменений
  ip: String,
  userAgent: String,
  createdAt: Date
}
```

---

## 🎨 Frontend Компоненты

### 1. GridContainer Component

**Файл:** `src/components/Grid/GridContainer.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import GridCell from './GridCell';
import './GridContainer.scss';

const GridContainer = ({
  items,
  columns = 'auto',      // 'auto' | number
  gap = '1rem',
  onItemClick,
  loading = false
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: columns === 'auto'
      ? 'repeat(auto-fill, minmax(250px, 1fr))'
      : `repeat(${columns}, 1fr)`,
    gap: gap
  };

  if (loading) {
    return <div className="grid-loading">Загрузка...</div>;
  }

  return (
    <div className="grid-container" style={gridStyle}>
      {items.map(item => (
        <GridCell
          key={item._id}
          item={item}
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  );
};

export default GridContainer;
```

**Стили:** `src/components/Grid/GridContainer.scss`

```scss
.grid-container {
  padding: 2rem;
  animation: fadeIn 0.3s ease-in;
}

.grid-loading {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #666;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

// Адаптивность
@media (max-width: 768px) {
  .grid-container {
    padding: 1rem;
    gap: 0.75rem !important;
  }
}
```

### 2. GridCell Component

**Файл:** `src/components/Grid/GridCell.jsx`

```jsx
import React from 'react';
import './GridCell.scss';

const GridCell = ({ item, onClick }) => {
  const {
    title,
    thumbnail,
    description,
    tags = [],
    childrenCount = 0,
    icon
  } = item;

  return (
    <div className="grid-cell" onClick={onClick}>
      <div className="cell-thumbnail">
        {thumbnail ? (
          <img src={thumbnail} alt={title} loading="lazy" />
        ) : (
          <div className="cell-icon">{icon || '📁'}</div>
        )}
        {childrenCount > 0 && (
          <div className="cell-counter">{childrenCount}</div>
        )}
      </div>

      <div className="cell-content">
        <h3 className="cell-title">{title}</h3>
        {description && (
          <p className="cell-description">
            {description.substring(0, 80)}...
          </p>
        )}
        {tags.length > 0 && (
          <div className="cell-tags">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GridCell;
```

**Стили:** `src/components/Grid/GridCell.scss`

```scss
.grid-cell {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
}

.cell-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 75%; // 4:3 aspect ratio
  background: #f5f5f5;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cell-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4rem;
  }

  .cell-counter {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: bold;
  }
}

.cell-content {
  padding: 1rem;
}

.cell-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.cell-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.cell-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  .tag {
    font-size: 0.8rem;
    color: #0066cc;
    background: #e6f2ff;
    padding: 2px 8px;
    border-radius: 4px;
  }
}
```

### 3. Breadcrumb Component

**Файл:** `src/components/Navigation/Breadcrumb.jsx`

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.scss';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={item._id}>
          {index > 0 && <span className="separator">›</span>}
          {index < items.length - 1 ? (
            <Link to={item.path} className="breadcrumb-link">
              {item.title}
            </Link>
          ) : (
            <span className="breadcrumb-current">{item.title}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
```

---

## 🔄 Система Обновления

### Механизм Автоматического Обновления

#### 1. WebSocket Real-time Updates

**Backend:** `src/services/websocket.js`

```javascript
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class CatalogWebSocket {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();

    this.wss.on('connection', this.handleConnection.bind(this));
  }

  handleConnection(ws, req) {
    const token = this.extractToken(req);
    const userId = this.verifyToken(token);

    this.clients.set(userId, ws);

    ws.on('close', () => {
      this.clients.delete(userId);
    });
  }

  // Уведомить всех клиентов об изменении
  notifyUpdate(event, data) {
    const message = JSON.stringify({ event, data });

    this.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  // Уведомить конкретного пользователя
  notifyUser(userId, event, data) {
    const ws = this.clients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event, data }));
    }
  }
}

module.exports = CatalogWebSocket;
```

#### 2. File Watcher для Автоматического Импорта

**Backend:** `src/services/fileWatcher.js`

```javascript
const chokidar = require('chokidar');
const path = require('path');
const { processNewItem } = require('./itemProcessor');

class FileWatcher {
  constructor(watchPath = './content/new-items') {
    this.watchPath = watchPath;
    this.watcher = null;
  }

  start() {
    this.watcher = chokidar.watch(this.watchPath, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    this.watcher
      .on('add', async (filePath) => {
        console.log(`Новый файл: ${filePath}`);
        await this.handleNewFile(filePath);
      })
      .on('change', async (filePath) => {
        console.log(`Изменен файл: ${filePath}`);
        await this.handleFileChange(filePath);
      });

    console.log(`Мониторинг: ${this.watchPath}`);
  }

  async handleNewFile(filePath) {
    try {
      const ext = path.extname(filePath).toLowerCase();

      if (['.json', '.yaml', '.yml'].includes(ext)) {
        await processNewItem(filePath);
      } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        await this.processImage(filePath);
      }
    } catch (error) {
      console.error(`Ошибка обработки ${filePath}:`, error);
    }
  }

  async processImage(imagePath) {
    // Генерация превью
    // Добавление в каталог
    // Обновление индекса
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}

module.exports = FileWatcher;
```

#### 3. Quick Add API

**Backend:** `src/routes/quickAdd.js`

```javascript
const express = require('express');
const router = express.Router();
const { generateThumbnail } = require('../utils/imageProcessor');
const CatalogItem = require('../models/CatalogItem');

// Быстрое добавление элемента
router.post('/quick-add', async (req, res) => {
  try {
    const { title, parentId, image, type = 'item' } = req.body;

    // Генерация thumbnail
    const thumbnail = await generateThumbnail(image);

    // Автоматическое определение пути
    const parent = parentId
      ? await CatalogItem.findById(parentId)
      : null;

    const path = parent
      ? `${parent.path}/${slugify(title)}`
      : `/${slugify(title)}`;

    const level = parent ? parent.level + 1 : 0;

    // Создание элемента
    const item = new CatalogItem({
      title,
      type,
      parentId,
      path,
      level,
      thumbnail,
      images: [image],
      createdBy: req.user._id
    });

    await item.save();

    // Обновление родителя
    if (parent) {
      parent.children.push(item._id);
      parent.childrenCount += 1;
      await parent.save();
    }

    // Уведомление через WebSocket
    req.app.ws.notifyUpdate('catalog:new-item', {
      item: item.toJSON(),
      parentId
    });

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

---

## 🔐 Безопасность

### 1. Аутентификация JWT

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
```

### 2. Middleware для Проверки Прав

```javascript
const checkPermission = (action) => {
  return async (req, res, next) => {
    try {
      const item = await CatalogItem.findById(req.params.id);

      if (!item) {
        return res.status(404).json({ error: 'Элемент не найден' });
      }

      const userRole = req.user.role;
      const hasPermission = item.permissions[action].includes(userRole);

      if (!hasPermission && userRole !== 'admin') {
        return res.status(403).json({ error: 'Нет прав доступа' });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

// Использование
router.put('/catalog/:id', checkPermission('edit'), updateItem);
router.delete('/catalog/:id', checkPermission('delete'), deleteItem);
```

### 3. Валидация Данных (Zod)

```javascript
const { z } = require('zod');

const catalogItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  type: z.enum(['category', 'collection', 'item', 'widget', 'page']),
  parentId: z.string().optional(),
  tags: z.array(z.string()).max(20).optional(),
  thumbnail: z.string().url().optional(),
  metadata: z.object({}).passthrough().optional()
});

const validateItem = (req, res, next) => {
  try {
    catalogItemSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
};
```

---

## ⚡ Оптимизация

### 1. Кэширование с Redis

```javascript
const redis = require('redis');
const client = redis.createClient();

// Кэширование списка элементов
const getCatalogItems = async (parentId, page = 1) => {
  const cacheKey = `catalog:${parentId}:page:${page}`;

  // Проверка кэша
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Запрос к БД
  const items = await CatalogItem.find({ parentId })
    .limit(20)
    .skip((page - 1) * 20)
    .sort({ order: 1 });

  // Сохранение в кэш на 5 минут
  await client.setEx(cacheKey, 300, JSON.stringify(items));

  return items;
};

// Инвалидация кэша при обновлении
const invalidateCache = async (parentId) => {
  const keys = await client.keys(`catalog:${parentId}:*`);
  if (keys.length > 0) {
    await client.del(keys);
  }
};
```

### 2. Виртуализация Списка (Frontend)

```jsx
import { FixedSizeGrid } from 'react-window';

const VirtualizedGrid = ({ items, onItemClick }) => {
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 4 + columnIndex;
    const item = items[index];

    if (!item) return null;

    return (
      <div style={style}>
        <GridCell item={item} onClick={onItemClick} />
      </div>
    );
  };

  return (
    <FixedSizeGrid
      columnCount={4}
      columnWidth={300}
      height={800}
      rowCount={Math.ceil(items.length / 4)}
      rowHeight={350}
      width={1200}
    >
      {Cell}
    </FixedSizeGrid>
  );
};
```

### 3. Оптимизация Изображений

```javascript
const sharp = require('sharp');

const generateThumbnail = async (imagePath) => {
  const thumbnailPath = imagePath.replace(/\.(\w+)$/, '-thumb.$1');

  await sharp(imagePath)
    .resize(400, 300, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 80 })
    .toFile(thumbnailPath);

  return thumbnailPath;
};

// Генерация множественных размеров
const generateResponsiveImages = async (imagePath) => {
  const sizes = [
    { width: 400, suffix: 'small' },
    { width: 800, suffix: 'medium' },
    { width: 1200, suffix: 'large' }
  ];

  const promises = sizes.map(({ width, suffix }) => {
    const output = imagePath.replace(/\.(\w+)$/, `-${suffix}.$1`);
    return sharp(imagePath)
      .resize(width)
      .webp({ quality: 85 })
      .toFile(output);
  });

  await Promise.all(promises);
};
```

---

## 📦 Структура Проекта

```
catalog-system/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── CatalogItem.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── catalog.js
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── services/
│   │   │   ├── websocket.js
│   │   │   ├── fileWatcher.js
│   │   │   └── cache.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── utils/
│   │   │   ├── imageProcessor.js
│   │   │   └── slugify.js
│   │   └── app.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Grid/
│   │   │   ├── Navigation/
│   │   │   └── Modal/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── TECHNICAL_SPECIFICATION.md
│   └── API.md
│
└── README.md
```

---

**Версия:** 1.0
**Дата:** 2024-12-28
**Статус:** Technical Specification
