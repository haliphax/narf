import axios from 'axios';
import { Remult } from 'remult';

Remult.apiBaseUrl = 'http://localhost:3001/api'

const remult = new Remult(axios);

export default remult;
