import axios from 'axios'

// we need to pass the baseURL as an object
const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default API
