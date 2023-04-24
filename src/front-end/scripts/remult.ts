import axios from 'axios';
import { Remult } from 'remult';

const remult = new Remult(axios);
remult.apiClient.url =
	location.hostname === 'localhost'
		? 'http://localhost:3001/api'
		: 'https://sphenoid-secret-antimony.glitch.me/api';

export default remult;
