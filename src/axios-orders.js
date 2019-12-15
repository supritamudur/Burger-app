import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-c63d3.firebaseio.com'
});

export default instance;