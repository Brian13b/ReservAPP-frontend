import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/canchas";

export const getCanchas = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getCanchaById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createCancha = async (cancha) => {
  const response = await axios.post(API_URL, cancha);
  return response.data;
};

export const updateCancha = async (id, cancha) => {
  const response = await axios.put(`${API_URL}/${id}`, cancha);
  return response.data;
}

export const deleteCancha = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}
