import request from 'supertest';
import moment from 'moment';
import parseTitle from '../utils/parseTitle';
import setupServer from '../index';
import { Express } from 'express';
import { Company } from '../models/company';
import { ObjectId } from 'mongodb';
import { jest } from '@jest/globals';
import { collections, mongo } from '../services/database.service';

jest.setTimeout(30 * 1000);

const testName = 'TEST_%2!#%3hd@QDYRhvs$Ds8dy';
let testId: null | ObjectId;
let app: Express;

beforeAll(async () => {
  app = await setupServer();
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
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(parseTitle(res.text)).toBe('Something Went Wrong - 401');
  });

  test('responds to GET /resumes/:id with existing id', async () => {
    const res = await request(app).get(`/resumes/${testId}`);
    const updatedCompany = (await collections.companies.findOne({
      _id: testId,
    })) as Company;

    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(updatedCompany.name).toBe(testName);
    expect(parseTitle(res.text)).toBe('Confirmation');
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

    expect(res.statusCode).toBe(400);
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(parseTitle(res.text)).toBe('Something Went Wrong - 400');
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
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(parseTitle(res.text)).toBe('Something Went Wrong - 400');
  });

  test('responds to POST /resumes without api key', async () => {
    const payload = { name: testName };
    const res = await request(app).post('/resumes').send(payload);

    expect(res.statusCode).toBe(401);
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(parseTitle(res.text)).toBe('Something Went Wrong - 401');
  });
});
