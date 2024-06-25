import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import moment from 'moment';
import dotenv from 'dotenv';
import path from 'path';
import companiesRouter from '../routes/companies.router';
import parseTitle from '../utils/parseTitle';
import { Company } from '../models/company';
import { ObjectId } from 'mongodb';
import { notFoundMiddleware, errorMiddleware } from '../middlewares/index';
import {
  connectToDatabase,
  collections,
  mongo,
} from '../services/database.service';

const app = express();
const testName = 'TEST_%2!#%3hd@QDYRhvs$Ds8dy';
let testId: null | ObjectId;

const setupServer = async () => {
  dotenv.config();
  await connectToDatabase();

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(bodyParser.json());

  app.use('/resumes', companiesRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
};

beforeAll(async () => {
  await setupServer();
  const company: Omit<Company, '_id'> = {
    name: testName,
    visited: false,
    visitedAt: [],
  };

  const result = await collections.companies.insertOne(company);
  testId = result.insertedId;
});

afterAll(async () => {
  await collections.companies.deleteMany({ name: testName });
  await mongo.client.close();
});

describe('Testing companies routes', function () {
  test('responds to GET /resumes with correct api key', async () => {
    const res = await request(app)
      .get('/resumes')
      .set('api-key', process.env.API_KEY);

    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((company: Company) => {
      expect(company).toHaveProperty('name');
      expect(company).toHaveProperty('visited');
      expect(company).toHaveProperty('visitedAt');
    });
  });

  test('responds to GET /resumes without api key', async () => {
    const res = await request(app).get('/resumes');

    expect(res.statusCode).toBe(401);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.body).toStrictEqual({
      code: 401,
      message: 'Missing api-key in headers.',
    });
  });

  test('responds to GET /resumes/:id with existing id', async () => {
    const res = await request(app).get(`/resumes/${testId}`);
    const updatedCompany = (await collections.companies.findOne({
      _id: testId,
    })) as Company;

    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8');
    expect(updatedCompany.name).toBe(testName);
    expect(parseTitle(res.text)).toBe('Thank you for confirmation');
    expect(updatedCompany.visited).toBe(true);
    expect(Array.isArray(updatedCompany.visitedAt)).toBe(true);
    expect(
      moment(
        updatedCompany.visitedAt[0],
        'YYYY-MM-DDTHH:mm:ss.SSSSZ',
        true
      ).isValid()
    ).toBe(true);
  });

  test('responds to GET /resumes/:id with non-existing id', async () => {
    const res = await request(app).get(`/resumes/${new ObjectId()}`);

    expect(res.statusCode).toBe(404);
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8');
    expect(parseTitle(res.text)).toBe('Not Found');
  });

  test('responds to POST /resumes with correct api-key and body', async () => {
    const payload = { name: testName };
    const res = await request(app)
      .post('/resumes')
      .send(payload)
      .set('api-key', process.env.API_KEY);

    expect(res.statusCode).toBe(201);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.body.message).toBe('Successfully created new company record.');
    expect(res.body).toHaveProperty('insertedId');
  });

  test('responds to POST /resumes without name property in body request', async () => {
    const payload = {};
    const res = await request(app)
      .post('/resumes')
      .send(payload)
      .set('api-key', process.env.API_KEY);

    expect(res.statusCode).toBe(400);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.body).toStrictEqual({
      code: 400,
      message: 'Name was not provided inside body request.',
    });
  });

  test('responds to POST /resumes without api key', async () => {
    const payload = { name: testName };
    const res = await request(app).post('/resumes').send(payload);

    expect(res.statusCode).toBe(401);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.body).toStrictEqual({
      code: 401,
      message: 'Missing api-key in headers.',
    });
  });
});
