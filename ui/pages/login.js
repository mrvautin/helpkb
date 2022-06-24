import { React, useEffect, useState } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import SocialButton from '../components/socialbutton';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';
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
                                <Spinner loading={loading} />
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                    </svg> Login with Github
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
