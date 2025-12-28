// ============================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ============================================

const AppState = {
    currentPath: 'root',
    currentItem: null,
    breadcrumb: [],
    items: [],
    searchQuery: ''
};

// ============================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Прототип Динамического Каталога запущен');

    // Инициализация
    initializeApp();

    // Обработчики событий
    setupEventListeners();

    // Загрузка корневых данных
    loadCatalog('root');
});

function initializeApp() {
    // Проверка наличия данных
    if (typeof MOCK_DATA === 'undefined') {
        console.error('❌ Данные не загружены');
        return;
    }

    console.log('✅ Данные загружены:', Object.keys(MOCK_DATA).length, 'категорий');
}

function setupEventListeners() {
    // Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Навигация по истории браузера
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.path) {
            loadCatalog(event.state.path, false);
        }
    });
}

// ============================================
// ЗАГРУЗКА И ОТОБРАЖЕНИЕ КАТАЛОГА
// ============================================

function loadCatalog(path, updateHistory = true) {
    console.log('📂 Загрузка каталога:', path);

    // Показать состояние загрузки
    showLoading(true);

    // Имитация задержки загрузки (для реалистичности)
    setTimeout(() => {
        // Получение данных
        const items = getDataByPath(path);
        const currentItem = path !== 'root' ? getItemById(path) : null;

        // Обновление состояния
        AppState.currentPath = path;
        AppState.currentItem = currentItem;
        AppState.items = items;
        AppState.breadcrumb = buildBreadcrumb(path);

        // Обновление истории браузера
        if (updateHistory) {
            const url = path === 'root' ? '/' : `/?path=${path}`;
            history.pushState({ path }, '', url);
        }

        // Отрисовка
        renderBreadcrumb();
        renderCategoryInfo();
        renderGrid();

        // Скрыть состояние загрузки
        showLoading(false);

        console.log('✅ Каталог загружен:', items.length, 'элементов');
    }, 300);
}

// ============================================
// ОТРИСОВКА КОМПОНЕНТОВ
// ============================================

function renderBreadcrumb() {
    const breadcrumbEl = document.getElementById('breadcrumb');
    if (!breadcrumbEl) return;

    breadcrumbEl.innerHTML = AppState.breadcrumb.map((item, index) => {
        const isLast = index === AppState.breadcrumb.length - 1;
        const href = isLast ? '#' : `javascript:loadCatalog('${item.id}')`;

        return `<li><a href="${href}">${item.title}</a></li>`;
    }).join('');
}

function renderCategoryInfo() {
    const titleEl = document.getElementById('categoryTitle');
    const descEl = document.getElementById('categoryDescription');
    const countEl = document.getElementById('itemCount');
    const tagsEl = document.getElementById('categoryTags');

    if (AppState.currentItem) {
        titleEl.textContent = AppState.currentItem.title;
        descEl.textContent = AppState.currentItem.description;
        countEl.textContent = `${AppState.items.length} элементов`;

        // Теги
        if (AppState.currentItem.tags) {
            tagsEl.innerHTML = AppState.currentItem.tags.map(tag =>
                `<span class="tag">#${tag}</span>`
            ).join('');
        }
    } else {
        // Главная страница
        titleEl.textContent = 'Добро пожаловать!';
        descEl.textContent = 'Выберите категорию для просмотра содержимого';
        countEl.textContent = `${AppState.items.length} категорий`;
        tagsEl.innerHTML = '';
    }
}

function renderGrid() {
    const gridEl = document.getElementById('catalogGrid');
    const emptyStateEl = document.getElementById('emptyState');

    if (!gridEl) return;

    // Пустое состояние
    if (AppState.items.length === 0) {
        gridEl.innerHTML = '';
        emptyStateEl.style.display = 'block';
        return;
    }

    emptyStateEl.style.display = 'none';

    // Отрисовка карточек
    gridEl.innerHTML = AppState.items.map(item => createGridCell(item)).join('');

    // Добавление обработчиков кликов
    gridEl.querySelectorAll('.grid-cell').forEach((cell, index) => {
        cell.addEventListener('click', () => {
            handleCellClick(AppState.items[index]);
        });
    });
}

function createGridCell(item) {
    const thumbnailContent = item.thumbnail
        ? `<img src="${item.thumbnail}" alt="${item.title}" loading="lazy">`
        : `<div class="cell-icon" style="color: ${item.color || '#333'}">${item.icon || '📁'}</div>`;

    const counter = item.childrenCount > 0
        ? `<div class="cell-counter">${item.childrenCount}</div>`
        : '';

    const tags = item.tags && item.tags.length > 0
        ? `<div class="cell-tags">
            ${item.tags.slice(0, 3).map(tag => `<span class="tag">#${tag}</span>`).join('')}
           </div>`
        : '';

    return `
        <div class="grid-cell" data-id="${item.id}">
            <div class="cell-thumbnail" style="background: ${item.color || '#ccc'}">
                ${thumbnailContent}
                ${counter}
            </div>
            <div class="cell-content">
                <h3 class="cell-title">${item.title}</h3>
                <p class="cell-description">${truncate(item.description, 80)}</p>
                ${tags}
            </div>
        </div>
    `;
}

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================

function handleCellClick(item) {
    console.log('🖱️ Клик по элементу:', item.title);

    if (item.type === 'item') {
        // Конечный элемент - открыть модальное окно
        openModal(item);
    } else {
        // Категория/Коллекция - перейти вглубь
        loadCatalog(item.id);
    }
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    AppState.searchQuery = query;

    if (query.length === 0) {
        // Сброс поиска
        renderGrid();
        return;
    }

    console.log('🔍 Поиск:', query);

    // Фильтрация элементов
    const filtered = AppState.items.filter(item => {
        return item.title.toLowerCase().includes(query) ||
               item.description.toLowerCase().includes(query) ||
               (item.tags && item.tags.some(tag => tag.includes(query)));
    });

    // Временное обновление для отображения результатов
    const originalItems = AppState.items;
    AppState.items = filtered;
    renderGrid();
    AppState.items = originalItems; // Восстановление
}

// ============================================
// МОДАЛЬНОЕ ОКНО
// ============================================

function openModal(item) {
    console.log('📖 Открытие детального просмотра:', item.title);

    const modal = document.getElementById('itemModal');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalBody) return;

    // Формирование контента модального окна
    const metadataHtml = item.metadata
        ? Object.entries(item.metadata).map(([key, value]) => `
            <div class="modal-meta-item">
                <div class="modal-meta-label">${formatLabel(key)}</div>
                <div class="modal-meta-value">${formatValue(value)}</div>
            </div>
        `).join('')
        : '';

    const tagsHtml = item.tags
        ? item.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')
        : '';

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${item.title}</h2>
            <div class="category-tags">${tagsHtml}</div>
        </div>

        ${item.thumbnail ? `<img src="${item.thumbnail}" class="modal-image" alt="${item.title}">` : ''}

        <div class="modal-description">
            <p>${item.description}</p>
        </div>

        ${metadataHtml ? `
            <div class="modal-meta">
                ${metadataHtml}
            </div>
        ` : ''}

        <div class="modal-actions mt-3">
            <button class="btn btn-primary" onclick="closeModal()">Закрыть</button>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('itemModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Закрытие по Escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function showLoading(show) {
    const loadingEl = document.getElementById('loadingState');
    const gridEl = document.getElementById('catalogGrid');

    if (loadingEl && gridEl) {
        loadingEl.style.display = show ? 'block' : 'none';
        gridEl.style.display = show ? 'none' : 'grid';
    }
}

function truncate(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength
        ? text.substring(0, maxLength) + '...'
        : text;
}

function formatLabel(key) {
    const labels = {
        year: 'Год',
        country: 'Страна',
        denomination: 'Номинал',
        catalogNumber: 'Каталожный номер',
        rarity: 'Редкость',
        condition: 'Состояние',
        designer: 'Дизайнер',
        price: 'Цена',
        weight: 'Вес',
        calories: 'Калории',
        cookTime: 'Время приготовления',
        ingredients: 'Ингредиенты'
    };

    return labels[key] || key;
}

function formatValue(value) {
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    return value;
}

// ============================================
// ДЕМОНСТРАЦИОННЫЕ ФУНКЦИИ
// ============================================

// Функция для демонстрации возможностей
function demoNavigation() {
    console.log('🎬 Запуск демонстрации навигации...');

    setTimeout(() => {
        console.log('1️⃣ Переход в "Почтовые Марки"');
        loadCatalog('stamps');
    }, 1000);

    setTimeout(() => {
        console.log('2️⃣ Переход в "Марки с Городами"');
        loadCatalog('stamps-cities');
    }, 3000);

    setTimeout(() => {
        console.log('3️⃣ Переход в "Города Европы"');
        loadCatalog('stamps-cities-europe');
    }, 5000);

    setTimeout(() => {
        console.log('4️⃣ Переход во "Франция"');
        loadCatalog('stamps-france');
    }, 7000);

    setTimeout(() => {
        console.log('5️⃣ Возврат на главную');
        loadCatalog('root');
    }, 9000);
}

// Экспорт для использования в консоли
window.demoNavigation = demoNavigation;
window.loadCatalog = loadCatalog;
window.AppState = AppState;

console.log('💡 Подсказка: Запустите demoNavigation() для просмотра демонстрации');
