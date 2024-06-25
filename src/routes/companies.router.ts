import express from 'express';
import path from 'path';
import { Company } from '../models/company';
import { ObjectId } from 'mongodb';
import { PushOperator } from 'mongodb';
import { Document } from 'mongodb';
import { collections } from '../services/database.service';
import { authMiddleware } from '../middlewares/index';

const router = express.Router();

router.get('', authMiddleware, async (req, res, next) => {
  try {
    const companies = await collections.companies.find({}).toArray();
    res.status(200).send(companies);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = req?.params?.id.trim();
    const query = { _id: new ObjectId(id) };
    const company = (await collections.companies.findOne(query)) as Company;

    if (!company) return next();

    const $set = { visited: true };
    const $push = {
      visitedAt: new Date(),
    } as unknown as PushOperator<Document>;

    await collections.companies.updateOne(query, { $set, $push });

    res.sendFile(path.join(__dirname, '../views/confirmation.html'));
  } catch (err) {
    next(err);
  }
});

router.post('', authMiddleware, async (req, res, next) => {
  try {
    const name = req.body.name;

    if (!name || !name.trim().length) {
      return next({
        code: 400,
        message: 'Name was not provided inside body request.',
      });
    }

    const company: Omit<Company, '_id'> = {
      name,
      visited: false,
      visitedAt: [],
    };

    const result = await collections.companies.insertOne(company);

    if (!result.acknowledged) {
      return next({
        code: 500,
        message: 'Failed to create new company record.',
      });
    }

    res.status(201).send({
      message: 'Successfully created new company record.',
      insertedId: result.insertedId,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
