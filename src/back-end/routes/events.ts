import { Application, Response } from "express";
import { v4 as uuid } from "uuid";
import { Story } from "../../models/story";

interface NarfClient {
	id: string;
	response: Response;
}

const clients = new Map<string, NarfClient[]>();

/** Server-sent events endpoint for story updates */
export const events = (app: Application) => {
	app.get("/:story/events", async (r, s) => {
		s.set({
			"Cache-Control": "no-cache",
			"Content-Type": "text/event-stream",
			Connection: "keep-alive",
		});
		s.flushHeaders();

		const story = r.params.story;
		const client: NarfClient = { id: uuid(), response: s };

		console.log(`Client ${client.id} connected`);

		if (clients.has(story)) {
			clients.set(story, (clients.get(story) ?? []).concat(client));
		} else {
			clients.set(story, [client]);
		}

		r.on("close", () => {
			console.log(`Client ${client.id} disconnected`);
			clients.set(
				story,
				(clients.get(story) ?? []).filter((c) => c.id !== client.id),
			);
		});
	});
};

export const updateStory = (story: Story) => {
	console.log(`Sending update to story ${story.id}`);
	clients.get(story.id)?.map((c) => {
		console.log(`Updating client ${c.id}`);
		c.response.write(`data: update\n\n`);
		c.response.flush();
	});
};
