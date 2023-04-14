import Head from 'next/head';
import Script from 'next/script';
import { SettingsProvider } from '../contexts/settings';
import '../styles/index.css';
import NextNProgress from 'nextjs-progressbar';

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <NextNProgress 
        color="#0d6efd"
        height={5}
      />
      <SettingsProvider>
        <Component {...pageProps} />
      </SettingsProvider>
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" 
        integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" 
        crossorigin="anonymous"
        referrerPolicy="no-referrer"
        strategy="lazyOnload"
      />
    </>
  )
}

export default App
