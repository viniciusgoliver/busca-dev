import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://192.168.5.59:3333',
  baseURL: 'http://10.1.50.61:3333',
});

export default api;
