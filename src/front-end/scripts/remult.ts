import axios from "axios";
import { Remult } from "remult";

const remult = new Remult(axios);
remult.apiClient.url = "/api";

export default remult;
