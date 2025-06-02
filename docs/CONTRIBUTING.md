# Руководство для разработчиков SportMobile

Этот документ содержит информацию для разработчиков, желающих внести свой вклад в проект SportMobile. Следуйте этим рекомендациям, чтобы обеспечить согласованность и качество кода.

## Содержание

1. [Настройка среды разработки](#настройка-среды-разработки)
2. [Структура проекта](#структура-проекта)
3. [Стиль кода](#стиль-кода)
4. [Рабочий процесс Git](#рабочий-процесс-git)
5. [Создание компонентов](#создание-компонентов)
6. [Управление состоянием](#управление-состоянием)
7. [Оптимизация производительности](#оптимизация-производительности)
8. [Тестирование](#тестирование)
9. [Локализация](#локализация)
10. [Документация](#документация)

## Настройка среды разработки

### Требования

- Node.js (версия 14 или выше)
- npm или yarn
- Expo CLI
- React Native Debugger (опционально)
- Android Studio / Xcode (для тестирования на эмуляторах)
- VSCode или другой предпочтительный редактор кода

### Установка

1. Клонировать репозиторий:
   ```bash
   git clone https://github.com/username/SportMobile.git
   cd SportMobile
   ```

2. Установить зависимости:
   ```bash
   npm install
   # или
   yarn install
   ```

3. Запустить приложение:
   ```bash
   npm start
   # или
   yarn start
   ```

### Рекомендуемые расширения для VSCode

- ESLint
- Prettier
- React Native Tools
- Color Highlight

## Структура проекта

Подробное описание структуры проекта доступно в [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md). Важно следовать этой структуре при добавлении новых файлов и компонентов.

## Стиль кода

### JavaScript / React Native

- Используйте **функциональные компоненты** с хуками вместо классовых компонентов
- Придерживайтесь стандарта ES6+ для JavaScript
- Используйте деструктуризацию для props и state
- Именуйте файлы компонентов в формате PascalCase (например, `EventCard.js`)
- Используйте стрелочные функции для callback-функций

```javascript
// Правильно
const EventCard = ({ title, date, onPress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
      <Text>{date}</Text>
    </TouchableOpacity>
  );
};

// Неправильно
function eventCard(props) {
  var isExpanded = false;
  
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text>{props.title}</Text>
      <Text>{props.date}</Text>
    </TouchableOpacity>
  );
}
```

### Стили

- Используйте `StyleSheet.create()` для определения стилей
- Группируйте связанные стили вместе
- Используйте понятные имена для стилей
- Избегайте inline-стилей, кроме случаев с динамическими значениями

```javascript
// Правильно
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  // ...
});

// Неправильно
<View style={{ flex: 1, padding: 16 }}>
  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
    Title
  </Text>
</View>
```

### Именование

- **Компоненты**: PascalCase (например, `EventCard`)
- **Функции**: camelCase (например, `handleSubmit`)
- **Константы**: UPPER_SNAKE_CASE (например, `API_URL`)
- **Файлы**: PascalCase для компонентов, camelCase для утилит и сервисов

## Рабочий процесс Git

### Ветвление

Используйте следующую стратегию ветвления:

- `main` - стабильная версия приложения
- `develop` - основная ветка разработки
- `feature/название-функции` - для новых функций
- `bugfix/описание-бага` - для исправления ошибок
- `release/версия` - для подготовки релиза

### Коммиты

Используйте понятные сообщения коммитов в формате:

```
тип: краткое описание

Подробное описание (если необходимо)
```

Где `тип` может быть:
- `feat` - новая функция
- `fix` - исправление ошибки
- `docs` - изменения в документации
- `style` - форматирование, отсутствующие точки с запятой и т.д.
- `refactor` - рефакторинг кода
- `test` - добавление тестов
- `chore` - обновление задач сборки, настроек менеджера пакетов и т.д.

### Pull Requests

1. Создайте новую ветку от `develop`
2. Внесите необходимые изменения
3. Отправьте ветку в репозиторий
4. Создайте Pull Request в `develop`
5. Дождитесь ревью и одобрения
6. После одобрения выполните merge

## Создание компонентов

### Структура компонента

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// Вспомогательные функции
const formatData = (data) => {
  // ...
};

// Компонент
const MyComponent = ({ title, data, onPress }) => {
  // Состояние
  const [isLoading, setIsLoading] = useState(false);
  
  // Эффекты
  useEffect(() => {
    // ...
    return () => {
      // Очистка
    };
  }, [data]);
  
  // Обработчики событий
  const handlePress = () => {
    setIsLoading(true);
    onPress();
    setIsLoading(false);
  };
  
  // Рендеринг
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {/* ... */}
    </View>
  );
};

// PropTypes
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
  onPress: PropTypes.func,
};

// Значения по умолчанию
MyComponent.defaultProps = {
  data: [],
  onPress: () => {},
};

// Стили
const styles = StyleSheet.create({
  container: {
    // ...
  },
  title: {
    // ...
  },
});

export default MyComponent;
```

### Рекомендации

- Разбивайте сложные компоненты на более мелкие подкомпоненты
- Используйте `memo` для предотвращения ненужных ререндеров
- Не используйте inline-функции в обработчиках событий
- Используйте пропсы для передачи данных вниз по дереву компонентов

## Управление состоянием

### Локальное состояние

Используйте хуки `useState` и `useReducer` для локального состояния компонентов:

```javascript
const [state, setState] = useState(initialState);
// или
const [state, dispatch] = useReducer(reducer, initialState);
```

### Глобальное состояние

Для глобального состояния используйте React Context API:

```javascript
// UserContext.js
import React, { createContext, useContext, useReducer } from 'react';

const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, { user: null });
  
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
```

## Оптимизация производительности

### Рекомендации

1. Используйте `React.memo` для предотвращения ненужных ререндеров
2. Используйте `useCallback` для мемоизации функций
3. Используйте `useMemo` для кэширования результатов вычислений
4. Используйте `FlatList` и `SectionList` вместо `ScrollView` для длинных списков
5. Используйте `useNativeDriver: true` для анимаций
6. Оптимизируйте изображения (размер, формат)
7. Избегайте глубокой вложенности компонентов

```javascript
// Пример оптимизации
const MemoizedComponent = React.memo(({ data }) => {
  // ...
});

const ParentComponent = () => {
  const memoizedData = useMemo(() => processData(rawData), [rawData]);
  const handlePress = useCallback(() => {
    // ...
  }, [dependency]);
  
  return <MemoizedComponent data={memoizedData} onPress={handlePress} />;
};
```

## Тестирование

### Типы тестов

1. **Модульные тесты** - тестирование отдельных функций и компонентов
2. **Интеграционные тесты** - тестирование взаимодействия между компонентами
3. **E2E тесты** - тестирование всего приложения с позиции пользователя

### Инструменты

- Jest - фреймворк для тестирования
- React Native Testing Library - утилиты для тестирования компонентов
- Detox - фреймворк для E2E тестирования

### Пример теста

```javascript
// Button.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button title="Press me" />);
    expect(getByText('Press me')).toBeTruthy();
  });
  
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Press me" onPress={onPress} />);
    fireEvent.press(getByText('Press me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

## Локализация

Приложение поддерживает несколько языков. Для добавления новых текстов или языков:

1. Добавьте новые строки в файлы локализации в `src/constants/localization/`
2. Используйте функцию `t()` для получения переведенных строк

```javascript
// Пример использования
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('welcome_message')}</Text>
    </View>
  );
};
```

## Документация

### Документирование кода

Используйте JSDoc для документирования функций и компонентов:

```javascript
/**
 * Компонент карточки события.
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок события
 * @param {string} props.date - Дата события
 * @param {Function} props.onPress - Обработчик нажатия
 * @returns {React.Component} Компонент карточки события
 */
const EventCard = ({ title, date, onPress }) => {
  // ...
};
```

### Документирование API

Для документирования API используйте следующий формат:

```javascript
/**
 * @api {get} /events Получить список событий
 * @apiName GetEvents
 * @apiGroup Events
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} [limit=10] Лимит событий
 * @apiParam {Number} [offset=0] Смещение
 * @apiParam {String} [category] Категория событий
 *
 * @apiSuccess {Object[]} events Список событий
 * @apiSuccess {Number} events.id ID события
 * @apiSuccess {String} events.title Название события
 * @apiSuccess {String} events.date Дата события
 *
 * @apiError {Object} error Информация об ошибке
 * @apiError {Number} error.code Код ошибки
 * @apiError {String} error.message Сообщение об ошибке
 */
```

## Заключение

Следуя этим рекомендациям, вы поможете поддерживать код проекта SportMobile в чистоте и порядке, что облегчит его развитие и поддержку в будущем. Если у вас есть вопросы или предложения по улучшению этого руководства, не стесняйтесь создать issue или pull request. 