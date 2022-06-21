import { api, apiReq } from './config';

export async function checkUser(loginPage) {
    const res = await apiReq().get(`${api()}/api/session`);
    const data = res.data;
    if(data.error === 'No valid session'){
        // If login page, dont redirect
        if(loginPage === true){
            return;
        }
        window.location.href = '/login';
        return;
    }
    if(data.email){
        return data;
    }
    return;
}

export async function logout() {
    // Call API
    await apiReq().get(`${api()}/api/logout`);

    // Redirect
    window.location.href = '/login';
}
