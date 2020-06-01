export const BASE_URL = __DEV__
    ? 'http://localhost:3030'
    : 'https://flich.herokuapp.com';

export const URLS = {
    USERS: () => '/users',
    AUHTENTICATION: () => '/authentication',
    TASKS_BY_USER: userId => `/tasks?userId=${userId}`
}