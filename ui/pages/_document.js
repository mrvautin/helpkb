import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
        <Head>
            <link rel="icon" type="image/png" href="/favicon.png" />
            <link rel="apple-touch-icon" href="favicon.png" />
        </Head>
        <body className="sb-nav-fixed">
            <Main />
            <NextScript />
        </body>
    </Html>
  )
}