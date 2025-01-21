import { Story } from "@/models/story";
import { Application, Request, Response } from "express";
import { BackendMethod } from "remult";
import { v4 as uuid } from "uuid";

interface NarfClient {
	id: string;
	response: Response;
}

export const clients = new Map<string, NarfClient[]>();

export const handler = async (r: Request, s: Response) => {
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
		clients.set(story, clients.get(story)!.concat(client));
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
};

/** Server-sent events endpoint for story updates */
export const events = (app: Application) => app.get("/:story/events", handler);

export class UpdateStoryController {
	@BackendMethod({ allowed: false })
	static updateStory(story: Story) {
		console.log(`Sending update to story ${story.id}`);
		clients.get(story.id)?.map((c) => {
			console.log(`Updating client ${story.id} => ${c.id}`);
			c.response.write(`data: update\n\n`);
			c.response.flush();
		});
	}
}
