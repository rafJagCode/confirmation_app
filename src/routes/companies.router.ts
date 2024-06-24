import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { Company } from '../models/company';
import { ObjectId } from 'mongodb';
import { PushOperator } from 'mongodb';
import { Document } from 'mongodb';
import { collections } from '../services/database.service';

const router = express.Router();

router.get('', async (req, res) => {
  dotenv.config();
  const apiKey = req.headers['api-key'];
  if (apiKey === process.env.API_KEY) {
    try {
      const companies = await collections.companies.find({}).toArray();
      res.status(200).send(companies);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else res.status(401).send({ error: 'Unauthorized' });
});

router.get('/:id', async (req, res) => {
  try {
    const id = req?.params?.id.trim();
    const query = { _id: new ObjectId(id) };
    const company = (await collections.companies.findOne(query)) as Company;

    if (company) {
      const $set = { visited: true };
      const $push = {
        visitedAt: new Date(),
      } as unknown as PushOperator<Document>;
      await collections.companies.updateOne(query, { $set, $push });
    }

    res.sendFile(path.join(__dirname, '../views/confirmation.html'));
  } catch (err) {
    res.sendFile(path.join(__dirname, '../views/404.html'));
  }
});

export default router;
