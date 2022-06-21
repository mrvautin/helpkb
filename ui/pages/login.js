import { React, useEffect, useState } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import SocialButton from '../components/socialbutton';
import ClipLoader from 'react-spinners/ClipLoader';
import Navbar from '../components/navbar';
import { api, apiReq, notification } from '../components/lib/config';
import { checkUser } from '../components/lib/user'; 
import { gaTrack } from '../components/lib/ga';

function Login() {
    let [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({});
    
    useEffect(() => {
        const fetchData = async () => {
            // Check for a user
            const user = await checkUser(true);
            if(user){
                window.location.href = '/admin/dashboard';
            }
        }
        fetchData();

        // Set our settings from .env
        setSettings({
            githubClientid: process.env.NEXT_PUBLIC_GITHUB_CLIENTID,
            baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
            apiUrl: process.env.NEXT_PUBLIC_BASE_API_URL
        });
        gaTrack();
    }, []);

    // Check for props to be set
    if(!settings.baseUrl){
        return (
            <></>
        )
    }

    return (
        <div>
            <Head>
                <title>helpkb - Login</title>
                <meta name="description" content="helpkb - Login"></meta>
                <meta property="og:type" content="website" />
                <meta property="og:title" content="helpkb - Login" />
                <meta property="og:description" content="helpkb - Login" />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL + "/login"} />
                <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL + "/login"} />
            </Head>
            <Navbar admin={false} />
            <Toaster/>
            <div id="layoutSidenav">
                <main>
                    <div className="container-fluid px-4">
                        <div className="row login-wrapper align-items-center">
                            <div className="mt-0 text-center">
                                <h1 className={loading ? 'd-none' : 'h3 mb-3 fw-normal'}>Please sign in</h1>
                                <ClipLoader color="#000000" loading={loading} size={150} />
                                <SocialButton
                                    className={loading ? 'd-none' : 'btn btn-dark'}
                                    provider="github"
                                    autoCleanUri={true}
                                    scope="read:user"
                                    appId={settings.githubClientid}
                                    gatekeeper={settings.apiUrl + "/api/auth/github"}
                                    redirect={settings.baseUrl + "/login"}
                                    onLoginSuccess={(response) => { setLoading(!loading); handleLogin(response); }}
                                    onLoginFailure={handleLogin}
                                >
                                    <i className="bi bi-github me-2"></i> Login with Github
                                </SocialButton>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

const handleLogin = async (response) => {
    const res = await apiReq().post(`${api()}/api/auth/github`, {
        token: response._token.accessToken
    });

    // Parse data
    const data = res.data;

    // If logged in, redirect to dashboard
    if(data.email){
        window.location.href = '/admin/dashboard';
    }else{
        console.log('Access denied');
        notification({
            title: 'Error',
            type: 'danger',
            message: 'Access denied. Please contact administrator.'
        });
    }
}

export default Login;
