import * as mongoDB from 'mongodb';
import dotenv from 'dotenv';
import { CompanySchema } from '../models/company';

export const collections: { companies?: mongoDB.Collection } = {};
export const mongo: { client?: mongoDB.MongoClient } = {};

export async function connectToDatabase() {
  dotenv.config();

  let uri: string;
  if (process.env.ENV === 'DEV') uri = process.env.DEV_DB_URI;
  else uri = process.env.DB_URI;

  mongo.client = new mongoDB.MongoClient(uri);

  await mongo.client.connect();

  const db: mongoDB.Db = mongo.client.db('resumes');
  db.command(CompanySchema);

  const companiesCollection: mongoDB.Collection = db.collection('companies');

  collections.companies = companiesCollection;
}
