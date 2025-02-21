const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key';

// Временное хранилище пользователей
const users = [];

// Настройка CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  credentials: true
}));

// Добавляем preflight OPTIONS
app.options('*', cors());

app.use(express.json());

// Логгирование запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Регистрация
app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body;
  console.log('Register attempt:', { email, name }); // Добавляем логирование

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Пользователь уже существует' });
  }

  const user = {
    id: Date.now().toString(),
    email,
    name,
    nickname: name,
    avatar: 'assets/default-avatar.png',
    description: 'Описание профиля',
    savedRoutes: [],
    createdAt: new Date()
  };

  users.push({ ...user, password });
  console.log('User registered:', user.email); // Добавляем логирование

  const token = jwt.sign({ userId: user.id }, SECRET_KEY);
  res.json({ user, token });
});

// Вход
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email); // Добавляем логирование

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    console.log('Login failed: user not found or password incorrect'); // Добавляем логирование
    return res.status(401).json({ message: 'Неверный email или пароль' });
  }

  console.log('Login successful:', user.email); // Добавляем логирование
  const { password: _, ...userWithoutPassword } = user;
  const token = jwt.sign({ userId: user.id }, SECRET_KEY);
  res.json({ user: userWithoutPassword, token });
});

// Проверка токена
app.get('/api/validate-token', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Middleware для проверки токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
