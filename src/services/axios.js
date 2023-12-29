import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = import.meta.env.VITE_API_URL;

export default axios;