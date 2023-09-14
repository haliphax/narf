import pkg from "../../../package.json";

export const LOCALSTORAGE_GLOBAL_PREFIX = "narf.";
export const NARF_VERSION = pkg.version;
export const ROOT_URI = (document.getElementById("rootURI") as HTMLInputElement)
	.value;
