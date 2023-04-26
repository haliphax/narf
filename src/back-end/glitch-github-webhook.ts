import bodyParser from 'body-parser';
import { createHmac, timingSafeEqual } from 'crypto';
import { Express, Request, Response } from 'express';
const { execSync } = require('child_process');

const glitchGitHubWebHook = (app: Express) => {
	app.use(bodyParser.json());
	app.post('/git', (req: Request, res: Response) => {
		const hmac = createHmac('sha1', process.env.SECRET!);
		const sig = 'sha1=' + hmac.update(JSON.stringify(req.body)).digest('hex');

		if (
			timingSafeEqual(
				Buffer.from(sig),
				Buffer.from(req.headers['x-hub-signature'] as string)
			)
		) {
			if (req.headers['x-github-event'] === 'push') {
				[
					'git fetch origin master',
					'git reset --hard origin/master',
					'git pull origin master --force',
					'npm ci',
					'npm run install',
					'refresh'
				].forEach((cmd) => {
					console.log(execSync(cmd).toString());
				});
			}

			return res.sendStatus(200);
		}
		else {
			console.error('webhook signature incorrect');
			return res.sendStatus(403);
		}
	});
};

export default glitchGitHubWebHook;
