import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { formatDate } from '../components/lib/data';
import { apiReq } from '../components/lib/config';
import SettingsContext from '../contexts/settings';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';
import Searchbar from '../components/searchbar';
import Footer from '../components/footer';
import { gaTrack } from '../components/lib/ga';

function Home() {
    const settings = useContext(SettingsContext);
    const [data, setData] = useState();

    useEffect(() => {
        gaTrack();
        const fetchData = async () => {
            // Get data
            if (settings.config.indexType === 'categories') {
                const res = await apiReq().get('/api/categories');
                setData(res.data);
            } else {
                const res = await apiReq().get('/api/search/count/10');
                setData(res.data);
            }
        };
        fetchData();
    }, [settings]);

    const showContent = () => {
        // Show our data
        if (settings.config.indexType === 'categories') {
            return (
                <div className="row mt-4">
                    <div className="col-12 col-md-10 offset-md-1">
                        <h2 className="text-center">Article categories</h2>
                        <div className="row">
                            {data.map((result, i) => (
                                <div className="col-12 col-md-4 mb-2" key={i}>
                                    <div className="card">
                                        <div className="card-body m-4 text-center">
                                            <h3 className="card-title mb-4">
                                                {result.name}
                                            </h3>
                                            <Link
                                                href={'/category/' + result.url}
                                                legacyBehavior
                                            >
                                                <a className="btn btn-primary">
                                                    See articles{' '}
                                                    <span className="badge bg-light text-dark">
                                                        {result.count}
                                                    </span>
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="row">
                <h2>Latest articles</h2>
                <ul className="list-group">
                    {data.map((result, i) => (
                        <li className="list-group-item" key={i}>
                            <div className="row">
                                <div className="col-12 col-md-8">
                                    <a href={'article/' + result.url}>
                                        {result.title}
                                    </a>
                                </div>
                                <div className="col-md-4 text-end d-none d-sm-block">
                                    <strong>Published:</strong>{' '}
                                    {formatDate(
                                        result.publishedDate,
                                        settings.config,
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Check for settings
    if (!settings.config) {
        return <Spinner loading={true} />;
    }

    // Check for data
    if (!data) {
        return <Spinner loading={true} />;
    }

    return (
        <div>
            <Head>
                <title>{settings.config.websiteName}</title>
                <meta
                    content={settings.config.websiteDescription}
                    name="description"
                ></meta>
                <meta content="website" property="og:type" />
                <meta
                    content={settings.config.websiteName}
                    property="og:title"
                />
                <meta
                    content={
                        process.env.NEXT_PUBLIC_BASE_URL +
                        '/images/logo-text.png'
                    }
                    property="og:image"
                />
                <meta
                    content={settings.config.websiteDescription}
                    property="og:description"
                />
                <meta
                    content={process.env.NEXT_PUBLIC_BASE_URL}
                    property="og:url"
                />
                <link href={process.env.NEXT_PUBLIC_BASE_URL} rel="canonical" />
            </Head>
            <Navbar admin={false} />
            <div>
                <main>
                    <div className="container px-4">
                        <div className="row">
                            <div className="col-xl-12 p-0 text-start">
                                <div className="ps-sm-5 pe-sm-5 pt-3 pb-3">
                                    <div className="container-fluid py-2">
                                        <Searchbar
                                            message={
                                                settings.config.welcomeMessage
                                            }
                                            page="homepage"
                                            placeholder={
                                                settings.config
                                                    .searchPlaceholder
                                            }
                                        />
                                        <div className="wrapper">
                                            {showContent()}
                                        </div>
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

export default Home;
