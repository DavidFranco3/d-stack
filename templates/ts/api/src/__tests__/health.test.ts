import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import { User } from '../models/User.js';
import { Resource } from '../models/Resource.js';

const testEmail = `test-${Date.now()}@dstack.com`;
const createdIds: string[] = [];

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message', 'D-Stack API is running');
  });

  it('returns 200 on /api root', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});

describe('Auth flow (httpOnly cookie sessions)', () => {
  it('registers a user and sets an httpOnly session cookie', async () => {
    const agent = request.agent(app);
    const res = await agent
      .post('/api/auth/register')
      .send({ name: 'Test User', email: testEmail, password: '12345678' });

    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({ name: 'Test User', email: testEmail });
    expect(res.body.token).toBeUndefined(); // token must live in the cookie only
    expect(res.headers['set-cookie']?.[0]).toMatch(/token=/);
    expect(res.headers['set-cookie']?.[0]).toMatch(/HttpOnly/i);
  });

  it('rejects duplicate registration with 409', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: testEmail, password: '12345678' });
    expect(res.status).toBe(409);
  });

  it('rejects invalid credentials with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@dstack.com', password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('logs in with the seeded admin and restores the session via /me', async () => {
    const agent = request.agent(app);
    const login = await agent
      .post('/api/auth/login')
      .send({ email: 'admin@dstack.com', password: '12345678' });

    expect(login.status).toBe(200);
    expect(login.body.user).toHaveProperty('email', 'admin@dstack.com');
    expect(login.body.token).toBeUndefined();

    const me = await agent.get('/api/auth/me');
    expect(me.status).toBe(200);
    expect(me.body.user).toHaveProperty('email', 'admin@dstack.com');
  });

  it('returns user null from /me without a session', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.user).toBeNull();
  });

  it('logs out and clears the session cookie', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: 'admin@dstack.com', password: '12345678' });

    const logout = await agent.post('/api/auth/logout');
    expect(logout.status).toBe(200);

    const me = await agent.get('/api/auth/me');
    expect(me.body.user).toBeNull();
  });
});

describe('Protected resource routes', () => {
  it('returns 401 without a session', async () => {
    const res = await request(app).get('/api/resources');
    expect(res.status).toBe(401);
  });

  it('returns resources with a valid session', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: 'admin@dstack.com', password: '12345678' });

    const res = await agent.get('/api/resources');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });
});

describe('Soft-delete / restore', () => {
  it('soft-deletes a resource and restores it (status 1 -> 0 -> 1)', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: 'admin@dstack.com', password: '12345678' });

    const created = await agent
      .post('/api/resources')
      .send({ name: `Restore Test ${Date.now()}`, category: 'Backend', price: 10, currency: 'USD' });
    expect(created.status).toBe(201);
    const id = created.body.data._id;
    createdIds.push(id);

    const deleted = await agent.delete(`/api/resources/${id}`);
    expect(deleted.status).toBe(200);
    expect(deleted.body.data.status).toBe(0);

    const restored = await agent.patch(`/api/resources/${id}/restore`);
    expect(restored.status).toBe(200);
    expect(restored.body.data.status).toBe(1);

    const list = await agent.get('/api/resources');
    expect(list.body.data.some((r: any) => String(r._id) === String(id))).toBe(true);
  });
});

afterAll(async () => {
  await User.deleteOne({ email: testEmail });
  if (createdIds.length > 0) {
    await Resource.deleteMany({ _id: { $in: createdIds } });
  }
});