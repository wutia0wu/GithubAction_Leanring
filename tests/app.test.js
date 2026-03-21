const request = require('supertest');
const app = require('../src/app');

beforeEach(() => {
  app.resetTodos();
});

describe('GET /todos', () => {
  test('returns a list of todos', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test('each todo has id, title, done fields', async () => {
    const res = await request(app).get('/todos');
    const todo = res.body[0];
    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('title');
    expect(todo).toHaveProperty('done');
  });
});

describe('POST /todos', () => {
  test('creates a new todo and returns 201', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 'Write tests' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Write tests');
    expect(res.body.done).toBe(false);
    expect(res.body.id).toBeDefined();
  });

  test('returns 400 when title is missing', async () => {
    const res = await request(app).post('/todos').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 when title is empty string', async () => {
    const res = await request(app).post('/todos').send({ title: '   ' });
    expect(res.status).toBe(400);
  });
});

describe('GET /todos/:id', () => {
  test('returns a single todo', async () => {
    const res = await request(app).get('/todos/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  test('returns 404 for non-existent id', async () => {
    const res = await request(app).get('/todos/999');
    expect(res.status).toBe(404);
  });
});

describe('PATCH /todos/:id', () => {
  test('marks a todo as done', async () => {
    const res = await request(app)
      .patch('/todos/1')
      .send({ done: true });
    expect(res.status).toBe(200);
    expect(res.body.done).toBe(true);
  });
});

describe('DELETE /todos/:id', () => {
  test('deletes a todo and returns 204', async () => {
    const res = await request(app).delete('/todos/1');
    expect(res.status).toBe(204);
  });

  test('returns 404 when deleting non-existent todo', async () => {
    const res = await request(app).delete('/todos/999');
    expect(res.status).toBe(404);
  });
});
