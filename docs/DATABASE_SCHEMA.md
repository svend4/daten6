# Схема Базы Данных: Система Динамического Каталога

## 📊 Обзор

Система использует **MongoDB** как основную базу данных для гибкого хранения иерархических данных.

### Коллекции

1. `catalog_items` - Элементы каталога
2. `users` - Пользователи системы
3. `activity_log` - Журнал активности
4. `sessions` - Сессии пользователей
5. `tags` - Справочник тегов

---

## 📦 Collection: catalog_items

### Mongoose Schema

```javascript
const mongoose = require('mongoose');

const catalogItemSchema = new mongoose.Schema({
  // Основная информация
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },

  description: {
    type: String,
    maxlength: 5000
  },

  type: {
    type: String,
    enum: ['category', 'collection', 'item', 'widget', 'page'],
    required: true,
    index: true
  },

  // Иерархия
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CatalogItem',
    index: true,
    default: null
  },

  path: {
    type: String,
    required: true,
    index: true
  },

  level: {
    type: Number,
    required: true,
    min: 0,
    max: 20,
    index: true
  },

  order: {
    type: Number,
    default: 0,
    index: true
  },

  // Визуальные элементы
  thumbnail: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/|\/uploads\/)/.test(v);
      },
      message: 'Некорректный URL изображения'
    }
  },

  images: [{
    type: String
  }],

  icon: {
    type: String,
    default: '📁'
  },

  color: {
    type: String,
    match: /^#[0-9A-F]{6}$/i,
    default: '#0066cc'
  },

  // Метаданные
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
    index: true
  }],

  metadata: {
    author: String,
    year: Number,
    source: String,
    language: {
      type: String,
      default: 'ru'
    },
    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },

  // Связи
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CatalogItem'
  }],

  childrenCount: {
    type: Number,
    default: 0,
    min: 0
  },

  // Контент
  content: {
    type: String,
    maxlength: 50000
  },

  contentType: {
    type: String,
    enum: ['html', 'markdown', 'plain'],
    default: 'html'
  },

  widgets: [{
    type: {
      type: String,
      enum: ['gallery', 'video', 'map', 'chart', 'custom']
    },
    config: mongoose.Schema.Types.Mixed
  }],

  // Публикация
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  },

  publishedAt: Date,

  // Права доступа
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  permissions: {
    view: [{
      type: String,
      enum: ['guest', 'user', 'editor', 'admin']
    }],
    edit: [{
      type: String,
      enum: ['editor', 'admin']
    }],
    delete: [{
      type: String,
      enum: ['admin']
    }]
  },

  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    canonicalUrl: String
  },

  // Статистика
  stats: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  }

}, {
  timestamps: true, // Автоматические createdAt, updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы
catalogItemSchema.index({ path: 1 });
catalogItemSchema.index({ parentId: 1, order: 1 });
catalogItemSchema.index({ tags: 1 });
catalogItemSchema.index({ type: 1, isPublished: 1 });
catalogItemSchema.index({ title: 'text', description: 'text' });

// Виртуальные поля
catalogItemSchema.virtual('url').get(function() {
  return `/catalog${this.path}`;
});

catalogItemSchema.virtual('hasChildren').get(function() {
  return this.childrenCount > 0;
});

// Методы экземпляра
catalogItemSchema.methods.getParents = async function() {
  const parents = [];
  let currentPath = this.path;

  while (currentPath !== '/') {
    currentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
    const parent = await this.model('CatalogItem').findOne({ path: currentPath });
    if (parent) {
      parents.unshift(parent);
    }
  }

  return parents;
};

catalogItemSchema.methods.incrementViews = async function() {
  this.stats.views += 1;
  await this.save();
};

// Статические методы
catalogItemSchema.statics.getRootItems = function() {
  return this.find({
    parentId: null,
    isPublished: true
  }).sort({ order: 1 });
};

catalogItemSchema.statics.getByPath = function(path) {
  return this.findOne({ path, isPublished: true });
};

// Middleware
catalogItemSchema.pre('save', async function(next) {
  // Генерация slug из title
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title);
  }

  // Генерация path
  if (this.isModified('parentId') || this.isModified('slug')) {
    if (this.parentId) {
      const parent = await this.model('CatalogItem').findById(this.parentId);
      this.path = `${parent.path}/${this.slug}`;
      this.level = parent.level + 1;
    } else {
      this.path = `/${this.slug}`;
      this.level = 0;
    }
  }

  next();
});

catalogItemSchema.pre('remove', async function(next) {
  // Удаление дочерних элементов
  await this.model('CatalogItem').deleteMany({ parentId: this._id });

  // Обновление родителя
  if (this.parentId) {
    await this.model('CatalogItem').findByIdAndUpdate(
      this.parentId,
      {
        $pull: { children: this._id },
        $inc: { childrenCount: -1 }
      }
    );
  }

  next();
});

module.exports = mongoose.model('CatalogItem', catalogItemSchema);
```

### Примеры Документов

#### Пример 1: Корневая Категория

```json
{
  "_id": "674d1a2b3c4e5f6a7b8c9d01",
  "title": "Почтовые Марки",
  "slug": "pochtovye-marki",
  "description": "Коллекция почтовых марок со всего мира",
  "type": "category",
  "parentId": null,
  "path": "/pochtovye-marki",
  "level": 0,
  "order": 1,
  "thumbnail": "/uploads/2024/stamps-main.jpg",
  "images": [
    "/uploads/2024/stamps-1.jpg",
    "/uploads/2024/stamps-2.jpg"
  ],
  "icon": "🏛️",
  "color": "#3498db",
  "tags": ["марки", "коллекция", "филателия"],
  "metadata": {
    "author": "Музей Филателии",
    "year": 2024,
    "source": "Государственный архив",
    "language": "ru",
    "customFields": {
      "totalItems": 1245,
      "rarity": "mixed",
      "period": "1900-2024"
    }
  },
  "children": [
    "674d1a2b3c4e5f6a7b8c9d02",
    "674d1a2b3c4e5f6a7b8c9d03"
  ],
  "childrenCount": 245,
  "content": null,
  "isPublished": true,
  "publishedAt": "2024-01-15T10:00:00.000Z",
  "owner": "674d1a2b3c4e5f6a7b8c9e01",
  "permissions": {
    "view": ["guest", "user", "editor", "admin"],
    "edit": ["editor", "admin"],
    "delete": ["admin"]
  },
  "seo": {
    "metaTitle": "Коллекция Почтовых Марок | Музей Филателии",
    "metaDescription": "Уникальная коллекция почтовых марок...",
    "keywords": ["марки", "филателия", "коллекция"]
  },
  "stats": {
    "views": 15678,
    "likes": 342,
    "shares": 89
  },
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-12-28T14:30:00.000Z"
}
```

#### Пример 2: Подкатегория

```json
{
  "_id": "674d1a2b3c4e5f6a7b8c9d02",
  "title": "Марки Европы",
  "slug": "marki-evropy",
  "description": "Почтовые марки европейских стран",
  "type": "collection",
  "parentId": "674d1a2b3c4e5f6a7b8c9d01",
  "path": "/pochtovye-marki/marki-evropy",
  "level": 1,
  "order": 1,
  "thumbnail": "/uploads/2024/europe-stamps.jpg",
  "images": [],
  "icon": "🗺️",
  "color": "#2ecc71",
  "tags": ["марки", "европа", "география"],
  "metadata": {
    "author": "Отдел Европейской Филателии",
    "year": 2024,
    "customFields": {
      "countries": ["Франция", "Германия", "Италия", "Испания"],
      "period": "1850-2024"
    }
  },
  "children": [
    "674d1a2b3c4e5f6a7b8c9d10",
    "674d1a2b3c4e5f6a7b8c9d11"
  ],
  "childrenCount": 45,
  "isPublished": true,
  "publishedAt": "2024-01-20T12:00:00.000Z",
  "owner": "674d1a2b3c4e5f6a7b8c9e01",
  "permissions": {
    "view": ["guest", "user", "editor", "admin"],
    "edit": ["editor", "admin"],
    "delete": ["admin"]
  },
  "stats": {
    "views": 5432,
    "likes": 123,
    "shares": 34
  },
  "createdAt": "2024-01-20T12:00:00.000Z",
  "updatedAt": "2024-12-20T16:45:00.000Z"
}
```

#### Пример 3: Конечный Элемент (Марка)

```json
{
  "_id": "674d1a2b3c4e5f6a7b8c9d10",
  "title": "Марка «Эйфелева Башня», 1989",
  "slug": "eiffeleva-bashnya-1989",
  "description": "Юбилейная марка к 100-летию Эйфелевой башни",
  "type": "item",
  "parentId": "674d1a2b3c4e5f6a7b8c9d02",
  "path": "/pochtovye-marki/marki-evropy/franciya/eiffeleva-bashnya-1989",
  "level": 3,
  "order": 5,
  "thumbnail": "/uploads/2024/eiffel-stamp-thumb.jpg",
  "images": [
    "/uploads/2024/eiffel-stamp-front.jpg",
    "/uploads/2024/eiffel-stamp-back.jpg"
  ],
  "icon": "🗼",
  "color": "#e74c3c",
  "tags": ["франция", "париж", "эйфелева башня", "юбилей", "1989"],
  "metadata": {
    "author": "La Poste (Почта Франции)",
    "year": 1989,
    "source": "Официальный выпуск",
    "language": "fr",
    "customFields": {
      "denomination": "2.20 франка",
      "printRun": 10000000,
      "designer": "Pierre Albuisson",
      "catalogNumber": "Yvert #2585",
      "perforation": "13",
      "dimensions": "36x26 мм",
      "printMethod": "Офсет",
      "condition": "MNH (Mint Never Hinged)",
      "rarity": "common",
      "marketValue": "0.50 EUR"
    }
  },
  "children": [],
  "childrenCount": 0,
  "content": "<h2>История</h2><p>Марка выпущена 28 марта 1989 года...</p>",
  "contentType": "html",
  "widgets": [
    {
      "type": "gallery",
      "config": {
        "images": [
          "/uploads/2024/eiffel-context-1.jpg",
          "/uploads/2024/eiffel-context-2.jpg"
        ],
        "layout": "grid"
      }
    }
  ],
  "isPublished": true,
  "publishedAt": "2024-02-10T09:00:00.000Z",
  "owner": "674d1a2b3c4e5f6a7b8c9e02",
  "permissions": {
    "view": ["guest", "user", "editor", "admin"],
    "edit": ["editor", "admin"],
    "delete": ["admin"]
  },
  "seo": {
    "metaTitle": "Марка «Эйфелева Башня» 1989 | Французская Филателия",
    "metaDescription": "Юбилейная почтовая марка Франции...",
    "keywords": ["марка", "франция", "эйфелева башня", "1989"]
  },
  "stats": {
    "views": 234,
    "likes": 45,
    "shares": 12
  },
  "createdAt": "2024-02-10T09:00:00.000Z",
  "updatedAt": "2024-11-15T11:20:00.000Z"
}
```

#### Пример 4: Страница с Контентом

```json
{
  "_id": "674d1a2b3c4e5f6a7b8c9d20",
  "title": "Меню Ресторана «Ла Петит»",
  "slug": "menu-la-petit",
  "description": "Актуальное меню французского ресторана",
  "type": "page",
  "parentId": null,
  "path": "/menu-la-petit",
  "level": 0,
  "order": 5,
  "thumbnail": "/uploads/2024/restaurant-menu.jpg",
  "images": [],
  "icon": "🍽️",
  "color": "#9b59b6",
  "tags": ["меню", "ресторан", "кухня"],
  "metadata": {
    "author": "Ресторан «Ла Петит»",
    "year": 2024,
    "customFields": {
      "cuisine": "французская",
      "priceRange": "$$-$$$",
      "location": "Москва, ул. Арбат, 15"
    }
  },
  "children": [
    "674d1a2b3c4e5f6a7b8c9d21",
    "674d1a2b3c4e5f6a7b8c9d22"
  ],
  "childrenCount": 4,
  "content": "<h1>Добро пожаловать!</h1><p>Наше меню...</p>",
  "contentType": "html",
  "widgets": [
    {
      "type": "custom",
      "config": {
        "component": "MenuPriceList",
        "currency": "RUB",
        "showImages": true
      }
    }
  ],
  "isPublished": true,
  "publishedAt": "2024-03-01T08:00:00.000Z",
  "owner": "674d1a2b3c4e5f6a7b8c9e05",
  "permissions": {
    "view": ["guest", "user", "editor", "admin"],
    "edit": ["admin"],
    "delete": ["admin"]
  },
  "stats": {
    "views": 8765,
    "likes": 234,
    "shares": 67
  },
  "createdAt": "2024-03-01T08:00:00.000Z",
  "updatedAt": "2024-12-28T10:15:00.000Z"
}
```

---

## 👤 Collection: users

### Mongoose Schema

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/
  },

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },

  password: {
    type: String,
    required: true,
    minlength: 8
  },

  role: {
    type: String,
    enum: ['guest', 'user', 'editor', 'admin'],
    default: 'user'
  },

  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: {
      type: String,
      maxlength: 500
    },
    website: String,
    socialLinks: {
      twitter: String,
      facebook: String,
      instagram: String
    }
  },

  preferences: {
    language: {
      type: String,
      default: 'ru'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    }
  },

  stats: {
    itemsCreated: {
      type: Number,
      default: 0
    },
    itemsEdited: {
      type: Number,
      default: 0
    }
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  lastLoginAt: Date,

  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: Date
  }]

}, {
  timestamps: true
});

// Индексы
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

// Методы
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
```

### Пример Документа

```json
{
  "_id": "674d1a2b3c4e5f6a7b8c9e01",
  "email": "curator@museum.ru",
  "username": "museumcurator",
  "password": "$2b$12$hashed_password_here",
  "role": "editor",
  "profile": {
    "firstName": "Анна",
    "lastName": "Иванова",
    "avatar": "/uploads/avatars/user-001.jpg",
    "bio": "Куратор коллекции почтовых марок",
    "website": "https://stamps-museum.ru"
  },
  "preferences": {
    "language": "ru",
    "theme": "light",
    "emailNotifications": true
  },
  "stats": {
    "itemsCreated": 156,
    "itemsEdited": 423
  },
  "isActive": true,
  "isVerified": true,
  "lastLoginAt": "2024-12-28T14:30:00.000Z",
  "loginHistory": [
    {
      "ip": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2024-12-28T14:30:00.000Z"
    }
  ],
  "createdAt": "2023-06-15T10:00:00.000Z",
  "updatedAt": "2024-12-28T14:30:00.000Z"
}
```

---

## 📝 Collection: activity_log

### Mongoose Schema

```javascript
const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'view', 'publish', 'unpublish'],
    required: true,
    index: true
  },

  entity: {
    type: String,
    enum: ['catalog_item', 'user', 'tag'],
    required: true
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },

  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed
  },

  metadata: {
    ip: String,
    userAgent: String,
    duration: Number
  }

}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Индексы
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ entityId: 1, createdAt: -1 });

// TTL индекс - удалять логи старше 90 дней
activityLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7776000 } // 90 дней
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
```

### Пример Документа

```json
{
  "_id": "674d1a2b3c4e5f6a7b8c9f01",
  "action": "update",
  "entity": "catalog_item",
  "entityId": "674d1a2b3c4e5f6a7b8c9d10",
  "userId": "674d1a2b3c4e5f6a7b8c9e01",
  "changes": {
    "before": {
      "title": "Марка «Эйфелева Башня»",
      "description": "Старое описание"
    },
    "after": {
      "title": "Марка «Эйфелева Башня», 1989",
      "description": "Юбилейная марка к 100-летию..."
    }
  },
  "metadata": {
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "duration": 1234
  },
  "createdAt": "2024-12-28T15:45:00.000Z"
}
```

---

## 🏷️ Collection: tags

### Mongoose Schema

```javascript
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  displayName: String,

  description: String,

  category: {
    type: String,
    enum: ['general', 'location', 'period', 'theme', 'custom']
  },

  count: {
    type: Number,
    default: 0
  },

  color: String,

  icon: String

}, {
  timestamps: true
});

// Индексы
tagSchema.index({ name: 1 }, { unique: true });
tagSchema.index({ count: -1 });

module.exports = mongoose.model('Tag', tagSchema);
```

### Пример Документа

```json
{
  "_id": "674d1a2b3c4e5f6a7b8c9g01",
  "name": "марки",
  "displayName": "Почтовые Марки",
  "description": "Категория почтовых марок",
  "category": "theme",
  "count": 1245,
  "color": "#3498db",
  "icon": "🏛️",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-12-28T16:00:00.000Z"
}
```

---

## 🔍 Запросы и Агрегации

### 1. Получить все дочерние элементы категории

```javascript
const getChildren = async (parentId, page = 1, limit = 20) => {
  return await CatalogItem.find({
    parentId,
    isPublished: true
  })
  .sort({ order: 1 })
  .limit(limit)
  .skip((page - 1) * limit)
  .select('title slug thumbnail tags childrenCount type');
};
```

### 2. Получить путь к элементу (breadcrumb)

```javascript
const getBreadcrumb = async (itemId) => {
  const item = await CatalogItem.findById(itemId);
  if (!item) return [];

  const breadcrumb = [];
  let current = item;

  while (current) {
    breadcrumb.unshift({
      _id: current._id,
      title: current.title,
      path: current.path
    });

    if (current.parentId) {
      current = await CatalogItem.findById(current.parentId);
    } else {
      break;
    }
  }

  return breadcrumb;
};
```

### 3. Поиск по тегам

```javascript
const searchByTags = async (tags, page = 1, limit = 20) => {
  return await CatalogItem.find({
    tags: { $in: tags },
    isPublished: true
  })
  .sort({ 'stats.views': -1 })
  .limit(limit)
  .skip((page - 1) * limit);
};
```

### 4. Топ-10 популярных элементов

```javascript
const getTopItems = async (limit = 10) => {
  return await CatalogItem.find({
    type: 'item',
    isPublished: true
  })
  .sort({ 'stats.views': -1 })
  .limit(limit)
  .select('title thumbnail stats');
};
```

### 5. Агрегация статистики по категориям

```javascript
const getCategoryStats = async () => {
  return await CatalogItem.aggregate([
    {
      $match: {
        type: 'category',
        isPublished: true
      }
    },
    {
      $group: {
        _id: '$type',
        totalItems: { $sum: '$childrenCount' },
        totalViews: { $sum: '$stats.views' },
        avgViews: { $avg: '$stats.views' }
      }
    }
  ]);
};
```

### 6. Полнотекстовый поиск

```javascript
const fullTextSearch = async (query, page = 1, limit = 20) => {
  return await CatalogItem.find(
    {
      $text: { $search: query },
      isPublished: true
    },
    {
      score: { $meta: 'textScore' }
    }
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(limit)
  .skip((page - 1) * limit);
};
```

---

## 🔄 Миграции

### Миграция 1: Добавление поля SEO

```javascript
// migrations/001_add_seo_fields.js
const mongoose = require('mongoose');
const CatalogItem = require('../models/CatalogItem');

module.exports = {
  async up() {
    await CatalogItem.updateMany(
      { seo: { $exists: false } },
      {
        $set: {
          seo: {
            metaTitle: '',
            metaDescription: '',
            keywords: [],
            canonicalUrl: ''
          }
        }
      }
    );
  },

  async down() {
    await CatalogItem.updateMany(
      {},
      { $unset: { seo: '' } }
    );
  }
};
```

### Миграция 2: Пересчет childrenCount

```javascript
// migrations/002_recalculate_children_count.js
module.exports = {
  async up() {
    const items = await CatalogItem.find({});

    for (const item of items) {
      const count = await CatalogItem.countDocuments({
        parentId: item._id
      });

      await CatalogItem.updateOne(
        { _id: item._id },
        { $set: { childrenCount: count } }
      );
    }
  }
};
```

---

## 📊 Индексирование и Производительность

### Рекомендуемые Индексы

```javascript
// Для catalog_items
db.catalog_items.createIndex({ path: 1 });
db.catalog_items.createIndex({ parentId: 1, order: 1 });
db.catalog_items.createIndex({ tags: 1 });
db.catalog_items.createIndex({ type: 1, isPublished: 1 });
db.catalog_items.createIndex({ slug: 1 }, { unique: true });
db.catalog_items.createIndex({ title: "text", description: "text" });
db.catalog_items.createIndex({ "stats.views": -1 });
db.catalog_items.createIndex({ createdAt: -1 });

// Для users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Для activity_log
db.activity_log.createIndex({ createdAt: -1 });
db.activity_log.createIndex({ userId: 1, createdAt: -1 });
db.activity_log.createIndex({ entityId: 1, createdAt: -1 });
db.activity_log.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// Для tags
db.tags.createIndex({ name: 1 }, { unique: true });
db.tags.createIndex({ count: -1 });
```

### Анализ Производительности

```javascript
// Проверка использования индексов
db.catalog_items.find({
  parentId: ObjectId("..."),
  isPublished: true
}).explain("executionStats");

// Статистика индексов
db.catalog_items.aggregate([
  { $indexStats: {} }
]);
```

---

**Версия:** 1.0
**Дата:** 2024-12-28
**Статус:** Database Schema Specification
