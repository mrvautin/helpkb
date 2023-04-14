import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
        <Head>
            <link rel="icon" type="image/png" href="/favicon.png" />
            <link rel="apple-touch-icon" href="favicon.png" />
            <link 
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
              rel="stylesheet" 
              integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" 
              crossOrigin="anonymous" 
            />
        </Head>
        <body className="sb-nav-fixed">
            <Main />
            <NextScript />
        </body>
    </Html>
  )
}