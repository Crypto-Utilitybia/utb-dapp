
import axios from 'axios'

import { PROXY_URL } from 'config'

const apiAxios = axios.create({
  baseURL: PROXY_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

export default apiAxios;