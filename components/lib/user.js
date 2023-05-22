import { apiReq } from '../../components/lib/config';

export async function checkUser(loginPage) {
    const res = await apiReq().get('/api/session');
    const session = res.data;
    if (session.error === 'No valid session') {
        // If login page, dont redirect
        if (loginPage === true) {
            return;
        }
        window.location.href = '/api/auth/signin';
        return;
    }
    if (session.user && session.user.email) {
        return session.user;
    }
    return;
}

export async function logout() {
    // Call API
    await apiReq().get('/api/auth/signout');

    // Redirect
    window.location.href = '/api/auth/signin';
}
