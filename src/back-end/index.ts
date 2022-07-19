import express from 'express';
import { remultExpress } from 'remult/remult-express';
import { Participant } from '../models/participant';
import { Story } from '../models/story';
import { Vote } from '../models/vote';

const port = 3001;
const app = express();

app.use(remultExpress({
	entities: [Participant, Story, Vote],
}));

app.listen(port, () => {
	console.log(`Example API listening at http://localhost:${port}`);
});
