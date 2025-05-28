const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join('/data', 'todos.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Asegurar que el archivo de datos existe
if (!fs.existsSync('/data')) {
  fs.mkdirSync('/data');
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf8');
}

// Obtener todas las tareas
app.get('/api/todos', (req, res) => {
  const todos = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  res.json(todos);
});

// Añadir una tarea
app.post('/api/todos', (req, res) => {
  const todos = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const newTodo = {
    id: Date.now().toString(),
    text: req.body.text,
    completed: false
  };
  todos.push(newTodo);
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos), 'utf8');
  res.status(201).json(newTodo);
});

// Eliminar una tarea
app.delete('/api/todos/:id', (req, res) => {
  let todos = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  todos = todos.filter(todo => todo.id !== req.params.id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos), 'utf8');
  res.status(204).end();
});

// Información del sistema
app.get('/api/system-info', (req, res) => {
  const systemInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMemory: Math.round(os.totalmem() / 1024 / 1024) + ' MB',
    freeMemory: Math.round(os.freemem() / 1024 / 1024) + ' MB',
    uptime: Math.round(os.uptime()) + ' segundos',
    containerID: fs.existsSync('/proc/self/cgroup') ? 
      fs.readFileSync('/proc/self/cgroup', 'utf8').split('\n')[0] : 'No disponible'
  };
  res.json(systemInfo);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 