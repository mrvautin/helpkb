import Head from 'next/head';
import Script from 'next/script';
import { SettingsProvider } from '../contexts/settings';
import '../styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NextNProgress from 'nextjs-progressbar';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
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
        async 
        src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.1.3/js/bootstrap.bundle.min.js" 
        integrity="sha512-pax4MlgXjHEPfCwcJLQhigY7+N8rt6bVvWLFyUMuxShv170X53TRzGPmPkZmGBhk+jikR8WBM4yl7A9WMHHqvg==" 
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      ></Script>
    </>
  )
}

export default MyApp
