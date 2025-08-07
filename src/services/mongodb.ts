import { MongoClient } from 'mongodb';

const url = process.env.MONGODB_URL || '';
const client = new MongoClient(url);

export { client };
