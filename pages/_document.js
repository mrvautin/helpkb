import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link href="/favicon.png" rel="icon" type="image/png" />
                <link href="favicon.png" rel="apple-touch-icon" />
                <link
                    crossOrigin="anonymous"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
                    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                    rel="stylesheet"
                />
            </Head>
            <body className="sb-nav-fixed">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
