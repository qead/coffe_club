import mongoose from 'mongoose';
import getCfgValue from './getConfigValue';

const mongoPORT = getCfgValue('mongodb.port');
const mongoUSER = getCfgValue('mongodb.username');
const mongoPASSWORD = getCfgValue('mongodb.password');
const mongoUri = `mongodb://${process.env.dbhost || 'localhost'}:${mongoPORT}`;

let cachedDb = null;

export default async function dbConnect() {
	if (mongoose.connection.readyState === 1) {
		console.log('return existing connection');
		return mongoose.connection;
	}
	if (cachedDb) {
		console.log('return cached db connection');
		return cachedDb;
	}

	const dbOptions = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		user: mongoUSER,
		pass: mongoPASSWORD
	};

	console.log('Creating new DB connection');
	const connection = await mongoose.createConnection(mongoUri, dbOptions);
	console.log('MongoDB connected!');

	cachedDb = connection.db;

	return connection;
}