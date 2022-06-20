import { api, apiReq } from './config';

export async function checkUser() {
    const res = await apiReq().get(`${api()}/api/session`);
    const data = res.data;
    if(data.email){
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('userEmail', data.email);
        return true;
    }
    localStorage.setItem('loggedIn', false);
    return false;
}

export async function getUser() {
    const res = await apiReq().get(`${api()}/api/session`);
    const data = res.data;
    if(data.error === 'No valid session'){
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
        return;
    }
    if(data.email){
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('userEmail', data.email);
        return data;
    }
    return;
}

export async function logout() {
    // Remove localstorage
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userEmail');
    
    // Set admin to false for navbar
    localStorage.setItem('admin', false);

    // Call API
    await apiReq().get(`${api()}/api/logout`);

    // Redirect
    window.location.href = '/login';
}
