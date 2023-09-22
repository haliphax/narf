import pkg from "../../../package.json";

const getRootURI = () => {
	try {
		return (document.getElementById("rootURI") as HTMLInputElement).value;
	} catch (e) {
		return "/";
	}
};

export const LOCALSTORAGE_GLOBAL_PREFIX = "narf.";
export const NARF_VERSION = pkg.version;
export const ROOT_URI = getRootURI();
