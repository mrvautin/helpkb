import Head from 'next/head';
import Script from 'next/script';
import { SettingsProvider } from '../contexts/settings';
import { SessionProvider } from 'next-auth/react';
import '../styles/index.css';
import NextNProgress from 'nextjs-progressbar';

function App({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <>
            <Head>
                <meta
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                    name="viewport"
                />
            </Head>
            <NextNProgress color="#0d6efd" height={5} />
            <SessionProvider session={session}>
                <SettingsProvider>
                    <Component {...pageProps} />
                </SettingsProvider>
            </SessionProvider>
            <Script
                crossorigin="anonymous"
                integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF"
                referrerPolicy="no-referrer"
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js"
                strategy="lazyOnload"
            />
        </>
    );
}

export default App;
