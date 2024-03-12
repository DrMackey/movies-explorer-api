# Проект **Портфолио**

> backend

Веб-сервис по поиску фильмом, созданный в рамках сдачи диплома на курсе Веб-разработчик в [Яндекс Практикум](https://practicum.yandex.ru 'сервис онлайн-образования'). Сервис позволяет искать фильмы, сохранять и удалять их в личном кабинете, а также регистрироваться, авторизоваться,редактировать профиль и другие функции.

### **Структура проекта**

---

- Movie (backend) _<- вы здесь_
- [Movie (frontend)](https://github.com/DrMackey/movies-explorer-frontend)

### **API**

---

- `POST /signup` — регистрация пользователя (name, email и password)
- `POST /signin` — авторизация пользователя (email и password, возвращает jwt)
- `GET /users/me` — возвращает информацию о пользователе (email и имя)
- `PATCH /users/me` — обновляет информацию о пользователе (email и имя)
- `GET /movies` — возвращает все сохранённые текущим пользователем фильмы
- `POST /movies` — создаёт фильм (country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail и movieId)
- `DELETE /movies/movieId` — удаляет сохранённый фильм по id

### **Технологии и инструменты**

---

- сервер на Ubuntu в Яндекс.Облаке + `Nginx`
- API сервер `Node.js` + `Express.js`
- база данных `MongoDB` + `Mongoose`
- валидация данных `Celebrate`, `Validator`
- безопасность данных `Bcrypt`, `Jsonwebtoken`
- логирование запросов `Winston`
- тестирование с помощью `Postman`
- менеджер процессов на сервере pm2
- SSL-сертификаты от Letsencrypt
