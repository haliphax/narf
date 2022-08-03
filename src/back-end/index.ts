import cors from 'cors';
import express from 'express';
import { remultExpress } from 'remult/remult-express';
// models
import Participant from '../models/participant';
import Story from '../models/story';
import Vote from '../models/vote';

const port = 3001;
const app = express();

app.use(cors({ origin: 'http://localhost:1234' }));
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
app.listen(port, () => {
	console.log(`Example API listening at http://localhost:${port}`);
});
