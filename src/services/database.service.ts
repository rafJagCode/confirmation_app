import * as mongoDB from 'mongodb';
import dotenv from 'dotenv';
import { CompanySchema } from '../models/company';

export const collections: { companies?: mongoDB.Collection } = {};

export async function connectToDatabase() {
  dotenv.config();

  let uri: string;
  if (process.env.ENV === 'DEV') uri = process.env.DEV_DB_URI;
  else uri = process.env.DB_URI;

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(uri);

  await client.connect();

  const db: mongoDB.Db = client.db('resumes');
  db.command(CompanySchema);

  const companiesCollection: mongoDB.Collection = db.collection('companies');

  collections.companies = companiesCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${companiesCollection.collectionName}`
  );
}
