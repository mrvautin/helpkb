import Head from 'next/head';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function ErrorPage(props) {
    return (
        <div>
            <Head>
                <title>helpkb - 404 not found</title>
                <meta
                    content="helpkb - 404 not found"
                    name="description"
                ></meta>
                <meta content="website" property="og:type" />
                <meta content="helpkb - 404 not found" property="og:title" />
                <meta
                    content="helpkb - 404 not found"
                    property="og:description"
                />
                <meta
                    content={process.env.NEXT_PUBLIC_BASE_URL + props.url}
                    property="og:url"
                />
                <link
                    href={process.env.NEXT_PUBLIC_BASE_URL + props.url}
                    rel="canonical"
                />
            </Head>
            <Navbar />
            <div>
                <main>
                    <div className="container-fluid px-4">
                        <div className="row">
                            <div className="col-xl-12 p-0 text-start">
                                <div className="p-sm-5 mb-4">
                                    <div className="container-fluid text-center py-5">
                                        <h1 className="display-5 fw-bold">
                                            404 Not found
                                        </h1>
                                        <p>
                                            Please check the URL and try again
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ErrorPage;
