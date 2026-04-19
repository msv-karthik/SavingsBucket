import axios from "./axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/buckets`;


export const getBuckets = async () => {
  return axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const createBucket = async ({ name, goal_amount, is_main }) => {
  return axios.post(
    BASE_URL,
    { name, goal_amount, is_main },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
};


export const updateBucket = async (id, { name, goal_amount, is_main }) => {
  return axios.patch(
    `${BASE_URL}/${id}`,
    { name, goal_amount, is_main },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
};