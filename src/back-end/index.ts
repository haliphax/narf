import cors from 'cors';
import express from 'express';
import { remultExpress } from 'remult/remult-express';
// models
import Participant from '../models/participant';
import Story from '../models/story';
import Vote from '../models/vote';

const host = process.env.host ?? 'localhost';
const port = parseInt(process.env.port ?? '3001');

const app = express();

app.use(cors({
	origin: host === 'localhost'
		? 'http://localhost:1234'
		: 'https://haliphax.github.io'
}));

app.use(remultExpress({
	entities: [Participant, Story, Vote],
	async initApi(remult) {
		const repo = remult.repo(Story);

		if (await repo.count() === 0) {
			await repo.insert([
				{ id: '1', title: 'Testing this thing' },
			]);
		}
	},
}));
app.listen(port, host, () => {
	console.log(`API listening at http://${host}:${port}`);
});
