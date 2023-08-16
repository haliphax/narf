import fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const opts = { encoding: "UTF-8" };
const filename = "dist/front-end/index.html";
const rgx = new RegExp('="/([^"]*)"', "g");

const input = await readFile(filename, opts);
await writeFile(
	filename,
	input.replace(
		rgx,
		(r, c1) => `="${process.env.ROOT_URI}${c1 ? `/${c1}` : ""}"`
	),
	opts
);
