import axios from "./axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;


export const getBuckets = () => {
  return axios.get(`${BASE_URL}/buckets`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const getTransactions = (page = 1, limit = 5) =>
  axios.get(`${BASE_URL}/transactions?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });



export const createTransfer = async (data) => {
  return axios.post(
    `${BASE_URL}/transfer`,
    data, 
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

