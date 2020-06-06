import { Platform } from "react-native";

export const BASE_URL = __DEV__
    ? (Platform.OS == 'ios' ? 'http://localhost:3030' : 'http://10.0.2.2:3030/')
    : 'https://flich.herokuapp.com';

export const URLS = {
    USERS: () => '/users',
    AUHTENTICATION: () => '/authentication',
    TASKS_BY_USER: userId => `/tasks?userId=${userId}`
}