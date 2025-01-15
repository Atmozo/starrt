const request = require('supertest');
const app = require('./app');

describe('Express App Integration Tests', () => {
  //test get /api/status
  it('should return service status', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
    expect(res.body.messege).toEqual('service is running!');
  });
});

//test post /api/users
it('should create a new user', async () => {
  const res = await request(app)
    .post('/api/users')
    .send({
      name: 'ashely',
      email: 'ahely@gmail.com'});

  expect(res.statusCode).toEqual(201);
  expect(res.body.id).toEqual({
    id: 1,
    name: 'ashely',
    email: 'ahely@gmail.com',
  });
});

//test post /api/users with missing name and email
it('should return error when name and email is missing', async () => {
  const res = await request(app)
    .post('/api/users')
    .send({});

  expect(res.statusCode).toEqual(400);
  expect(res.body.error).toEqual('name and email is required');
});