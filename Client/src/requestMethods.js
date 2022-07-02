import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: " https://school-dismissal-system.herokuapp.com/api/",
});