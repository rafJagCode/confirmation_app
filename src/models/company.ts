import { ObjectId } from 'mongodb';

export type Company = {
  _id: ObjectId;
  name: string;
  visited: boolean;
  visitedAt: [Date];
};
