import toast from 'react-hot-toast';
import axios from 'axios';
axios.defaults.withCredentials = true;

export function apiReq() {
    return axios;
}

export function notification(data) {
    const notificationObj = {
        duration: 4000,
        position: 'top-right',
    };
    if (data.type === 'success') {
        toast.success(data.message, notificationObj);
    }
    if (data.type === 'danger') {
        toast.error(data.message, notificationObj);
    }
}
