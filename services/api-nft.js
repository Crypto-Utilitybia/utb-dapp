import axios from 'services/axios'

const fetchPools = async () => {
  return await axios.get(`/api/`);
};

export {
  fetchPools
};