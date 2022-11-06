import axios from 'axios';

const accessToken = window.sessionStorage.getItem('accessToken')

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: {
    Authorization: `Bearer ${accessToken}` 
  }

});

export default API;