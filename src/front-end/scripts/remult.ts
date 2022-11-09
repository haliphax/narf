import axios from 'axios';
import { Remult } from 'remult';

const remult = new Remult(axios);
remult.apiClient.url = 'http://localhost:3001/api'

export default remult;
