import axios from 'axios'

// we need to pass the baseURL as an object
const API = axios.create({
  baseURL: 'http://localhost:5000/api/',
  //   baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default API
