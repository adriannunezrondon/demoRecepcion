import axios from "axios";
const API_URL = "http://localhost:3164/api/admon/";

export default {
    getBaseUrl() {
      return axios.get(API_URL);
    },   
  };