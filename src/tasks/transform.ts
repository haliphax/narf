import fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const filename = "dist/front-end/index.html";
const rgx = new RegExp('="/([^"]*)"', "g");
const rootURI = process.env.ROOT_URI || "/";

(async () => {
	const input = (await readFile(filename)).toString();
	await writeFile(
		filename,
		input.replace(rgx, (_: string, c1: string) => `="${rootURI}${c1}"`),
	);
})();
