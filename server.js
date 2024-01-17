const ejs = require('ejs');
const fs = require('fs');

const data = [
  { task_info: 'task1', Lvl: 1, Id_task: 292, id_sys: 112, ParentId: 0 },
  { task_info: 'task2', Lvl: 2, Id_task: 2, id_sys: 114, ParentId: 292 },
  { task_info: 'task3', Lvl: 3, Id_task: 3, id_sys: 114, ParentId: 292 },
  { task_info: 'task4', Lvl: 1, Id_task: 295, id_sys: 110, ParentId: 0 },
  { task_info: 'task5', Lvl: 2, Id_task: 4, id_sys: 116, ParentId: 295 },
  { task_info: 'task6', Lvl: 3, Id_task: 5, id_sys: 116, ParentId: 295 },
];

ejs.renderFile('menu.ejs', { tasks: data }, (err, html) => {
  if (err) {
    console.error(err);
    return;
  }

  fs.writeFile('menu.html', html, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Menu HTML file generated successfully!');
  });
});

// Загружаем HTTP модуль
const http = require("http");

const hostname = "127.0.0.1";
const port = 8000;

// Создаём HTTP-сервер
const server = http.createServer((req, res) => {
  // Устанавливаем HTTP-заголовок ответа с HTTP статусом и Content type
  res.writeHead(200, { "Content-Type": "text/plain" });

  // Отсылаем тело ответа "Hello World"
  res.end("Hello World\n");
});

// Выводим лог как только сервер будет запущен
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});