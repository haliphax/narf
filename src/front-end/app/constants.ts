import pkg from "../../../package.json";

export const LOCALSTORAGE_GLOBAL_PREFIX = "narf.";
export const NARF_VERSION = pkg.version;

const rootUriElement = document.getElementById("rootURI");
export const ROOT_URI = rootUriElement
	? (rootUriElement as HTMLInputElement).value
	: "/";
