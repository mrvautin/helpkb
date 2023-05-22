import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { formatDate } from '../../components/lib/data';
import { apiReq } from '../../components/lib/config';
import SettingsContext from '../../contexts/settings';
import ErrorPage from '../../components/404';
import Navbar from '../../components/navbar';
import Searchbar from '../../components/searchbar';
import Footer from '../../components/footer';
import { gaTrack } from '../../components/lib/ga';

function Home() {
    const settings = useContext(SettingsContext);
    const router = useRouter();
    const [currentUrl, setCurrentUrl] = useState();
    const [categoryError, setCategoryError] = useState();
    const [categoryArticles, setCategoryArticles] = useState();
    const [categoryName, setCategoryName] = useState();
    const [categoryUrl, setCategoryUrl] = useState();

    useEffect(() => {
        gaTrack();
        const routerPath = router.asPath;
        const fetchData = async () => {
            const catUrl = routerPath.replace('/category/', '');
            setCurrentUrl(catUrl);

            // Grab the articles for this category
            const categoryRes = await apiReq().get(`/api/category/${catUrl}`);
            const category = categoryRes.data;
            if (!categoryRes.error) {
                setCategoryName(category.category.name);
                setCategoryArticles(category.articles);
                setCategoryUrl(`/${category.category.url}`);
            } else {
                setCategoryError(true);
            }
        };
        if (routerPath !== '/category/[...category]') {
            fetchData();
        }
    }, [router.asPath]);

    if (categoryError) {
        return <ErrorPage url={`/category/${currentUrl}`} />;
    }

    // Check for data
    if (!categoryArticles) {
        return <></>;
    }

    const pinned = result => {
        if (result.pinned === true) {
            return (
                <svg
                    className="primary-text"
                    fill="currentColor"
                    height="16"
                    viewBox="0 0 16 16"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z" />
                </svg>
            );
        }
    };

    const structuredData = () => {
        const data = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [],
        };

        // Push our FAQs
        categoryArticles.map(result => {
            const question = {
                '@type': 'Question',
                name: result.title,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: result.title,
                },
            };
            data.mainEntity.push(question);
        });
        return (
            <script
                dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
                type="application/ld+json"
            />
        );
    };

    const getContent = () => {
        if (categoryArticles.length === 0) {
            return (
                <div>
                    <li className="list-group-item mt-2">
                        No articles in this category
                    </li>
                </div>
            );
        }
        return categoryArticles.map((result, i) => (
            <li className="list-group-item" key={i}>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <a href={'/article/' + result.url}>{result.title}</a>
                    </div>
                    <div className="col-12 col-md-3 text-end"></div>
                    <div className="col-md-3 text-end d-none d-sm-block">
                        <div>
                            {pinned(result)}
                            <strong className="ps-2">Published:</strong>{' '}
                            {formatDate(result.publishedDate, settings.config)}
                        </div>
                    </div>
                </div>
            </li>
        ));
    };

    return (
        <div>
            <Head>
                <title>Category: {categoryName}</title>
                <meta
                    content={
                        'Currently showing articles within category: ' +
                        categoryName
                    }
                    name="description"
                ></meta>
                <meta content="website" property="og:type" />
                <meta
                    content={'Category: ' + categoryName}
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
                    content={
                        'Currently showing articles within category: ' +
                        categoryName
                    }
                    property="og:description"
                />
                <meta
                    content={
                        process.env.NEXT_PUBLIC_BASE_URL +
                        '/category' +
                        categoryUrl
                    }
                    property="og:url"
                />
                <link
                    href={
                        process.env.NEXT_PUBLIC_BASE_URL +
                        '/category' +
                        categoryUrl
                    }
                    rel="canonical"
                />
                {structuredData()}
            </Head>
            <Navbar admin={false} />
            <div>
                <main>
                    <div className="container px-4">
                        <div className="row">
                            <div className="col-12 col-md-10 offset-md-1 p-0 text-start">
                                <div className="ps-sm-5 pe-sm-5 pt-3 pb-3">
                                    <div className="container-fluid py-2">
                                        <Searchbar page="article" />
                                        <h1 className="display-5 mt-5 fw-bold">
                                            {categoryName}
                                        </h1>
                                        <ul className="list-group">
                                            {getContent()}
                                        </ul>
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
