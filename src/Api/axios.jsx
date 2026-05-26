import axios from "axios";

const API = axios.create({
    baseURL: "https://ocs-backend-398f.onrender.com"
});

export default API;


