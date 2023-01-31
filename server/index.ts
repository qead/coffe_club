import express, { Request, Response } from 'express';
import next from 'next';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import routes from './routes';
import getCfgValue from './utils/getConfigValue';
const dev = process.env.NODE_ENV !== 'production';
const PORT = getCfgValue('PORT');//process.env.PORT;
const mongoPORT=getCfgValue('mongodb.port');
const mongoUSER = getCfgValue('mongodb.username');
const mongoPASSWORD = getCfgValue('mongodb.password');
const mongoUri = `mongodb://${process.env.dbhost||'localhost'}:${mongoPORT}`;//getCfgValue('mongoUri');//process.env.mongoUri;
const cookieSecret = process.env.cookieSecret;
const app = next({ dev });
const handle = app.getRequestHandler();
(async () => {
	try {
		await mongoose.connect(mongoUri, {
			user:mongoUSER,
			pass:mongoPASSWORD,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		await app.prepare();
		const server = express();
		server.use(express.json());
		server.use(cookieParser(cookieSecret));
		routes(server);
		server.all('*', (req: Request, res: Response) => {
			return handle(req, res);
		});
		server.listen(PORT, (err?: any) => {
			if (err) throw err;
			console.log(`> Ready on localhost:${PORT} - it is development mode ${dev}`);
		});
	} catch (e) {
		console.error('APP HAS BEEN CRASHED:',e);
		process.exit(1);
	}
})();