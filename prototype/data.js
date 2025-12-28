// Тестовые данные для прототипа динамического каталога

const MOCK_DATA = {
    // Корневые категории (Level 0)
    root: [
        {
            id: 'stamps',
            title: 'Почтовые Марки',
            description: 'Коллекция почтовых марок со всего мира',
            icon: '🏛️',
            color: '#3498db',
            tags: ['марки', 'коллекция', 'филателия'],
            childrenCount: 245,
            type: 'category',
            thumbnail: null
        },
        {
            id: 'postcards',
            title: 'Открытки',
            description: 'Старинные и современные открытки',
            icon: '💌',
            color: '#e74c3c',
            tags: ['открытки', 'коллекция'],
            childrenCount: 89,
            type: 'category',
            thumbnail: null
        },
        {
            id: 'menu',
            title: 'Меню Ресторана',
            description: 'Актуальное меню блюд',
            icon: '🍽️',
            color: '#f39c12',
            tags: ['меню', 'еда', 'ресторан'],
            childrenCount: 34,
            type: 'category',
            thumbnail: null
        },
        {
            id: 'paintings',
            title: 'Картины',
            description: 'Галерея произведений искусства',
            icon: '🖼️',
            color: '#9b59b6',
            tags: ['искусство', 'картины', 'галерея'],
            childrenCount: 123,
            type: 'category',
            thumbnail: null
        },
        {
            id: 'widgets',
            title: 'Виджеты',
            description: 'Интерактивные элементы интерфейса',
            icon: '⚙️',
            color: '#2ecc71',
            tags: ['виджеты', 'интерфейс'],
            childrenCount: 67,
            type: 'category',
            thumbnail: null
        },
        {
            id: 'coins',
            title: 'Монеты',
            description: 'Нумизматическая коллекция',
            icon: '💰',
            color: '#f1c40f',
            tags: ['монеты', 'нумизматика', 'коллекция'],
            childrenCount: 156,
            type: 'category',
            thumbnail: null
        },
        {
            id: 'icons',
            title: 'Иконостас',
            description: 'Собрание православных икон',
            icon: '☦️',
            color: '#34495e',
            tags: ['иконы', 'религия', 'искусство'],
            childrenCount: 23,
            type: 'category',
            thumbnail: null
        },
        {
            id: 'photos',
            title: 'Фотографии',
            description: 'Архив исторических фотографий',
            icon: '📸',
            color: '#1abc9c',
            tags: ['фото', 'история', 'архив'],
            childrenCount: 312,
            type: 'category',
            thumbnail: null
        }
    ],

    // Подкатегории марок (Level 1)
    stamps: [
        {
            id: 'stamps-cities',
            title: 'Марки с Городами',
            description: 'Почтовые марки с изображениями городов',
            icon: '🏙️',
            color: '#3498db',
            tags: ['марки', 'города'],
            childrenCount: 120,
            type: 'collection',
            thumbnail: null
        },
        {
            id: 'stamps-nature',
            title: 'Природа',
            description: 'Марки с изображениями природы',
            icon: '🌿',
            color: '#27ae60',
            tags: ['марки', 'природа'],
            childrenCount: 85,
            type: 'collection',
            thumbnail: null
        },
        {
            id: 'stamps-history',
            title: 'Исторические События',
            description: 'Марки, посвященные историческим событиям',
            icon: '📜',
            color: '#8e44ad',
            tags: ['марки', 'история'],
            childrenCount: 40,
            type: 'collection',
            thumbnail: null
        }
    ],

    // Города (Level 2)
    'stamps-cities': [
        {
            id: 'stamps-cities-europe',
            title: 'Города Европы',
            description: 'Европейские столицы и города',
            icon: '🗺️',
            color: '#3498db',
            tags: ['марки', 'города', 'европа'],
            childrenCount: 65,
            type: 'collection',
            thumbnail: null
        },
        {
            id: 'stamps-cities-america',
            title: 'Города Америки',
            description: 'Города Северной и Южной Америки',
            icon: '🗽',
            color: '#e74c3c',
            tags: ['марки', 'города', 'америка'],
            childrenCount: 35,
            type: 'collection',
            thumbnail: null
        },
        {
            id: 'stamps-cities-asia',
            title: 'Города Азии',
            description: 'Азиатские мегаполисы',
            icon: '🏯',
            color: '#f39c12',
            tags: ['марки', 'города', 'азия'],
            childrenCount: 20,
            type: 'collection',
            thumbnail: null
        }
    ],

    // Европа (Level 3)
    'stamps-cities-europe': [
        {
            id: 'stamps-france',
            title: 'Франция',
            description: 'Марки с французскими городами',
            icon: '🗼',
            color: '#0055a4',
            tags: ['франция', 'париж', 'марки'],
            childrenCount: 25,
            type: 'collection',
            thumbnail: null
        },
        {
            id: 'stamps-germany',
            title: 'Германия',
            description: 'Немецкие города на марках',
            icon: '🏰',
            color: '#dd0000',
            tags: ['германия', 'берлин', 'марки'],
            childrenCount: 18,
            type: 'collection',
            thumbnail: null
        },
        {
            id: 'stamps-italy',
            title: 'Италия',
            description: 'Итальянские города',
            icon: '🏛️',
            color: '#009246',
            tags: ['италия', 'рим', 'марки'],
            childrenCount: 22,
            type: 'collection',
            thumbnail: null
        }
    ],

    // Франция - конечные элементы (Level 4)
    'stamps-france': [
        {
            id: 'stamp-eiffel-1989',
            title: 'Эйфелева Башня, 1989',
            description: 'Юбилейная марка к 100-летию Эйфелевой башни. Номинал: 2.20 франка',
            icon: '🗼',
            color: '#0055a4',
            tags: ['париж', 'эйфелева башня', '1989'],
            type: 'item',
            thumbnail: null,
            metadata: {
                year: 1989,
                country: 'Франция',
                denomination: '2.20 франка',
                catalogNumber: 'Yvert #2585',
                rarity: 'Обычная',
                condition: 'MNH',
                designer: 'Pierre Albuisson'
            }
        },
        {
            id: 'stamp-louvre-1993',
            title: 'Лувр, 1993',
            description: 'Музей Лувр с пирамидой. Номинал: 2.80 франка',
            icon: '🎨',
            color: '#0055a4',
            tags: ['париж', 'лувр', 'музей', '1993'],
            type: 'item',
            thumbnail: null,
            metadata: {
                year: 1993,
                country: 'Франция',
                denomination: '2.80 франка',
                rarity: 'Редкая',
                condition: 'Used'
            }
        },
        {
            id: 'stamp-versailles-1982',
            title: 'Версальский Дворец, 1982',
            description: 'Дворец в Версале. Номинал: 3.00 франка',
            icon: '👑',
            color: '#0055a4',
            tags: ['версаль', 'дворец', '1982'],
            type: 'item',
            thumbnail: null,
            metadata: {
                year: 1982,
                country: 'Франция',
                denomination: '3.00 франка',
                rarity: 'Средняя',
                condition: 'MH'
            }
        }
    ],

    // Меню ресторана (Level 1)
    menu: [
        {
            id: 'menu-breakfast',
            title: 'Завтрак',
            description: 'Утреннее меню (8:00 - 11:00)',
            icon: '🥐',
            color: '#f39c12',
            tags: ['завтрак', 'утро'],
            childrenCount: 12,
            type: 'collection',
            thumbnail: null
        },
        {
            id: 'menu-lunch',
            title: 'Обед',
            description: 'Дневное меню (12:00 - 16:00)',
            icon: '🍝',
            color: '#e74c3c',
            tags: ['обед', 'день'],
            childrenCount: 18,
            type: 'collection',
            thumbnail: null
        },
        {
            id: 'menu-dinner',
            title: 'Ужин',
            description: 'Вечернее меню (18:00 - 23:00)',
            icon: '🥩',
            color: '#8e44ad',
            tags: ['ужин', 'вечер'],
            childrenCount: 15,
            type: 'collection',
            thumbnail: null
        },
        {
            id: 'menu-drinks',
            title: 'Напитки',
            description: 'Холодные и горячие напитки',
            icon: '🍷',
            color: '#c0392b',
            tags: ['напитки', 'бар'],
            childrenCount: 25,
            type: 'collection',
            thumbnail: null
        }
    ],

    // Обед (Level 2)
    'menu-lunch': [
        {
            id: 'menu-lunch-soup',
            title: 'Супы',
            description: 'Первые блюда',
            icon: '🍲',
            color: '#e67e22',
            tags: ['суп', 'первое'],
            childrenCount: 5,
            type: 'collection',
            thumbnail: null
        },
        {
            id: 'menu-lunch-main',
            title: 'Вторые Блюда',
            description: 'Основные блюда',
            icon: '🍖',
            color: '#c0392b',
            tags: ['второе', 'основное'],
            childrenCount: 10,
            type: 'collection',
            thumbnail: null
        },
        {
            id: 'menu-lunch-salad',
            title: 'Салаты',
            description: 'Свежие салаты',
            icon: '🥗',
            color: '#27ae60',
            tags: ['салат', 'овощи'],
            childrenCount: 6,
            type: 'collection',
            thumbnail: null
        }
    ],

    // Вторые блюда (Level 3)
    'menu-lunch-main': [
        {
            id: 'dish-pasta-carbonara',
            title: 'Паста Карбонара',
            description: 'Классическая итальянская паста с беконом, яйцом и сыром Пармезан',
            icon: '🍝',
            color: '#e67e22',
            tags: ['паста', 'италия', 'классика'],
            type: 'item',
            thumbnail: null,
            metadata: {
                price: '450 ₽',
                weight: '350 г',
                calories: '580 ккал',
                cookTime: '15 мин',
                ingredients: ['спагетти', 'бекон', 'яйца', 'пармезан', 'специи']
            }
        },
        {
            id: 'dish-steak',
            title: 'Стейк Рибай',
            description: 'Мраморная говядина средней прожарки с овощами гриль',
            icon: '🥩',
            color: '#c0392b',
            tags: ['мясо', 'стейк', 'премиум'],
            type: 'item',
            thumbnail: null,
            metadata: {
                price: '1200 ₽',
                weight: '300 г',
                calories: '720 ккал',
                cookTime: '20 мин',
                ingredients: ['рибай', 'овощи', 'специи', 'соус']
            }
        }
    ]
};

// Функция получения данных по пути
function getDataByPath(path) {
    if (path === 'root' || !path) {
        return MOCK_DATA.root;
    }
    return MOCK_DATA[path] || [];
}

// Функция получения элемента по ID
function getItemById(id) {
    for (const key in MOCK_DATA) {
        const items = MOCK_DATA[key];
        if (Array.isArray(items)) {
            const found = items.find(item => item.id === id);
            if (found) return found;
        }
    }
    return null;
}

// Функция построения breadcrumb
function buildBreadcrumb(itemId) {
    const breadcrumb = [{ id: 'root', title: 'Главная', level: 0 }];

    if (!itemId || itemId === 'root') {
        return breadcrumb;
    }

    // Простой поиск родителей (для демо)
    const pathMap = {
        'stamps': ['root'],
        'stamps-cities': ['root', 'stamps'],
        'stamps-cities-europe': ['root', 'stamps', 'stamps-cities'],
        'stamps-france': ['root', 'stamps', 'stamps-cities', 'stamps-cities-europe'],
        'stamp-eiffel-1989': ['root', 'stamps', 'stamps-cities', 'stamps-cities-europe', 'stamps-france'],
        'menu': ['root'],
        'menu-lunch': ['root', 'menu'],
        'menu-lunch-main': ['root', 'menu', 'menu-lunch'],
        'dish-pasta-carbonara': ['root', 'menu', 'menu-lunch', 'menu-lunch-main']
    };

    const path = pathMap[itemId] || ['root'];

    path.forEach((id, index) => {
        if (id !== 'root') {
            const item = getItemById(id);
            if (item) {
                breadcrumb.push({
                    id: item.id,
                    title: item.title,
                    level: index
                });
            }
        }
    });

    return breadcrumb;
}
