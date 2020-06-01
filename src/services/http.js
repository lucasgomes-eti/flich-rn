import Axios from 'axios'
import { BASE_URL } from '../resources/urls'

export const http = Axios.create({
    baseURL: BASE_URL,
});