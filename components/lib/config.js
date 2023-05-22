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

export function clipboard(clipboardStr) {
    // Try navigator copy
    if ('clipboard' in navigator) {
        try {
            navigator.clipboard.writeText(clipboardStr);
            return true;
        } catch (ex) {
            console.log('Failed to copy to clipboard - navigator', ex);
            return false;
        }
    }

    // Fall back to execCommand
    try {
        document.execCommand('copy', true, clipboardStr);
        return true;
    } catch (ex) {
        console.log('Failed to copy API key - execCommand', ex);
        return false;
    }
}
