import axios from "axios";
import { Remult } from "remult";

const rootURI = (document.getElementById("rootURI") as HTMLInputElement).value;
const remult = new Remult(axios);
remult.apiClient.url = `${rootURI}api`;

export default remult;
