import Axios from 'axios';

export default Axios.create({
  baseURL: '/admin/',
  timeout: 1500,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});
