import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link href="/favicon.png" rel="icon" type="image/png" />
                <link href="favicon.png" rel="apple-touch-icon" />
            </Head>
            <body className="sb-nav-fixed">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
