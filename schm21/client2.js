// Інтерсептор для запитів з підтримкою дефолтних значень
function fetchRequestInterceptor(url, config = {}, token = null, baseUrl = null) {
    // Дефолтний шаблон заголовків
    const defaultHeaders = {
        'Content-Type': 'application/json',
    }

    // Декомпозиція даних з конфігурації
    const { method = 'GET', headers = {}, credentials = 'include', params = null, ...rest } = config

    // Використання дефолтних параметрів або користувацьких
    const requestOptions = {
        method, // Якщо не вказано, використовуємо 'GET'
        headers: { ...defaultHeaders, ...headers }, // Об'єднання дефолтних і користувацьких заголовків
        credentials, // Передача cookie, якщо не вказано інше
        ...rest,
    }

    // Додавання JWT токена до заголовків (якщо передано)
    if (token) {
        requestOptions.headers['Authorization'] = `Bearer ${token}`
    }

    // Формування повного URL
    let fullUrl = baseUrl ? `${baseUrl}${url}` : url

    // Додавання квері параметрів (якщо є params)
    if (params) {
        const urlObj = new URL(fullUrl)
        const searchParams = new URLSearchParams(params)
        urlObj.search = searchParams.toString()
        fullUrl = urlObj.toString()
    }

    // Повертаємо модифіковані параметри для запиту
    return [fullUrl, requestOptions]
}

// Інтерсептор для відповідей
async function fetchResponseInterceptor(response) {
    // Перевірка статусу відповіді
    if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            return { message: 'Success', data: await response.json() }
        } else {
            return { message: 'Success', data: await response.text() }
        }
    } else {
        return { message: 'Failed', data: null, reason: response.statusText }
    }
}

// Глобальні змінні для синхронізації запитів (якщо вони викликаються одночасно і токен протух)
let isRefreshingTokens = false
let refreshQueue = []

// Функція для додавання до черги
function addToQueue(resolve, reject) {
    refreshQueue.push({ resolve, reject })
}

// Функція для оновлення токенів
async function refreshTokens() {
    console.log(refreshQueue.length)
    if (isRefreshingTokens) {
        // Якщо вже виконується оновлення, чекаємо
        return new Promise((resolve, reject) => {
            addToQueue(resolve, reject)
        })
    }

    isRefreshingTokens = true
    let accessToken = null
    let refreshToken = null

    try {
        // Логіка для оновлення токенів
        const response = await fetch('http://localhost:3000/api/refresh-token', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ refreshToken: "123" }),
        })
        
        // Обробка помилок
        if (!response.ok) {
            throw new Error('Не вдалося оновити токен')
        }

        // Парсинг відповіді
        const data = await response.json()
    
        // Отримання нових токенів
        accessToken = data.accessToken
        refreshToken = data.refreshToken

        // Зберегаємо нові токени
        // localStorage.setItem('accessToken', accessToken)
        // localStorage.setItem('refreshToken', refreshToken)
        
        // Випуск всіх очікуючих запитів
        refreshQueue.forEach(({ resolve }) => resolve(accessToken))
    } catch (err) {
        // Помилка оновлення токенів
        refreshQueue.forEach(({ reject }) => reject(err))
        throw new Error('Не вдалося оновити токен')
    } finally {
        // Очистка черги після завершення
        isRefreshingTokens = false
        refreshQueue = []
        // Повертаємо новий accessToken
        return accessToken
    }
}

// Обгортка для fetch з підтримкою дефолтного виклику
async function $fetch(url, options = {}, isRetry = false, token = null, baseUrl = null) {
    try {
        // Виклик інтерсептора для запитів (модифікація URL та параметрів запиту перед виконанням самого запиту)
        const [finalUrl, finalOptions] = fetchRequestInterceptor(url, options, token, baseUrl)

        // Виклик дефолтного (базового) fetch з модифікованими параметрами
        const response = await fetch(finalUrl, finalOptions)

        // Перевірка на 401 (неавторизовано) і чи це не повторний запит
        if (response.status === 401 && !isRetry) {
            console.log('Токен протух або невірний. Оновлення токенів...')
            // Оновлюємо токени
            const accessToken = await refreshTokens()
            console.log('Токени оновлено:', accessToken, 'Повторний запит...', url)
            // Повторний запит з оновленим токеном
            return $fetch(url, options, true, accessToken, baseUrl)
        }

        // Виклик інтерсептора для обробки відповіді
        return await fetchResponseInterceptor(response)
    } catch (err) {
        console.warn('Fetch Error:', err)
        return { message: 'Failed', data: null, reason: err.message }
    }
}

// Використання

// // 1. Стандартний виклик без додаткових параметрів
// const defaultResponse = await $fetch('https://jsonplaceholder.typicode.com/todos/1')
// console.log(defaultResponse)

// // 2. Виклик з параметрами (token, baseUrl, params)
// const responseWithParams = await $fetch(
//     '/todos',
//     {
//         method: 'GET',
//         params: { userId: 1 }, // Додавання квері параметрів
//         headers: {
//             'Custom-Header': 'CustomValue',
//         },
//     },
//     false,
//     'yourAccessToken',
//     'https://jsonplaceholder.typicode.com',
// )



// const defaultResponse = await $fetch('http://localhost:3000/api/test')
// console.log(defaultResponse)


// Генерація паралельних запитів
const request0 = $fetch('http://localhost:3000/api/test');
const request1 = $fetch('http://localhost:3000/api/test1');
const request2 = $fetch('http://localhost:3000/api/test2');
const request3 = $fetch('http://localhost:3000/api/test3');
const request01 = $fetch('http://localhost:3000/api/test');
const request4 = $fetch('http://localhost:3000/api/test');
const request5 = $fetch('http://localhost:3000/api/test');
const request6 = $fetch('http://localhost:3000/api/test');
const request7 = $fetch('http://localhost:3000/api/test');

Promise.all([request0, request1, request2, request3, request4, request5, request6, request7, request01])
  .then(responses => {
    // return Promise.all(responses.map(response => response.json())); // перетворення всіх відповідей в JSON
    console.log(responses); // масив з результатами всіх запитів
  })
//   .then(data => {
//     console.log(data); // масив з результатами всіх запитів
//   })
  .catch(error => {
    console.error('Error:', error);
  });