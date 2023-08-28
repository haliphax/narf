import axios from "axios";
import { Remult } from "remult";
import { ROOT_URI } from "./constants";

const remult = new Remult(axios);
remult.apiClient.url = `${ROOT_URI}api`;

export default remult;
