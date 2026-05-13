const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

jest.setTimeout(60000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

describe('Authentication & OTP API Tests', () => {
  const validUser = {
    username: 'testuser123',
    email: 'test@college.edu',
    password: 'Password@123!'
  };

  describe('POST /api/auth/register (Signup)', () => {
    it('Should successfully register a new user and generate OTP', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('OTP sent');
      
      const user = await User.findOne({ email: validUser.email });
      expect(user).toBeTruthy();
      expect(user.isVerified).toBe(false);
      expect(user.otp).toBeTruthy();
    });

    it('Should fail registration with a weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, password: 'weakpassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Password must be at least 8 characters long');
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    it('Should verify user with correct OTP and return token', async () => {
      // Register
      await request(app).post('/api/auth/register').send(validUser);
      const user = await User.findOne({ email: validUser.email });

      // Verify OTP
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: validUser.email, otp: user.otp });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      
      const verifiedUser = await User.findOne({ email: validUser.email });
      expect(verifiedUser.isVerified).toBe(true);
      expect(verifiedUser.otp).toBeNull();
    });

    it('Should fail verification with incorrect OTP', async () => {
      await request(app).post('/api/auth/register').send(validUser);
      
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: validUser.email, otp: '000000' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid OTP');
    });
  });

  describe('POST /api/auth/login (Login)', () => {
    it('Should fail login if user is not verified', async () => {
      await request(app).post('/api/auth/register').send(validUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('verify your email');
    });

    it('Should successfully log in if user is verified', async () => {
      await request(app).post('/api/auth/register').send(validUser);
      const user = await User.findOne({ email: validUser.email });
      await request(app).post('/api/auth/verify-otp').send({ email: validUser.email, otp: user.otp });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
});
