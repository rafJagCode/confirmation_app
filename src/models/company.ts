import { ObjectId } from 'mongodb';

export type Company = {
  _id: ObjectId;
  name: string;
  visited: boolean;
  visitedAt: [] | [Date];
};

export const CompanySchema = {
  collMod: 'companies',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'visited', 'visitedAt'],
      additionalProperties: false,
      properties: {
        _id: {},
        name: {
          bsonType: 'string',
          description: "'name' is required and is a string",
        },
        visited: {
          bsonType: 'bool',
          description: "'price' is required and is a boolean",
        },
        visitedAt: {
          bsonType: 'array',
          description: "'category' is required and is an array",
        },
      },
    },
  },
};
