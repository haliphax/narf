import axios from "axios";
import { Remult } from "remult";

const remult = new Remult(axios);
remult.apiClient.url = `${process.env.ROOT_URI ?? ""}/api`;

export default remult;
