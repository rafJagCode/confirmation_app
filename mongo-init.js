db = db.getSiblingDB('admin');

db.auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD
);

db = db.getSiblingDB(process.env.DB_NAME);
db.createUser({
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    {
      role: 'dbOwner',
      db: process.env.DB_NAME,
    },
  ],
});
db.createCollection(process.env.COLLECTION_NAME);
