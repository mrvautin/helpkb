import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { parseContent } from '../../components/lib/data';
import { apiReq } from '../../components/lib/config';
import { gaTrack } from '../../components/lib/ga';
import Articledata from '../../components/articledata';
import ErrorPage from '../../components/404';
import Navbar from '../../components/navbar';
import Searchbar from '../../components/searchbar';
import Footer from '../../components/footer';
import Markdown from '../../components/markdown';

function Home() {
    const router = useRouter();
    const [article, setArticle] = useState();

    useEffect(() => {
        gaTrack();
        const routerPath = router.asPath;
        const fetchData = async () => {
            const articleUrl = routerPath.replace('/article/', '');

            // Grab the article
            const articleRes = await apiReq().get(`/api/article/${articleUrl}`);

            // Parse content
            const parsedContent = parseContent(articleRes.data);
            setArticle(parsedContent);
        };

        fetchData();
    }, [router.asPath]);

    // Check for data
    if (!article) {
        return <></>;
    }

    // Check for error
    if (article && article.error) {
        return <ErrorPage url={article.url} />;
    }

    return (
        <div>
            <Head>
                <title>{article.seoTitle}</title>
                <meta content={article.description} name="description"></meta>
                <meta content="website" property="og:type" />
                <meta content={article.seoTitle} property="og:title" />
                <meta
                    content={
                        process.env.NEXT_PUBLIC_BASE_URL +
                        '/images/logo-text.png'
                    }
                    property="og:image"
                />
                <meta content={article.description} property="og:description" />
                <meta content={article.url} property="og:url" />
                <link href={article.url} rel="canonical" />
            </Head>
            <Navbar admin={false} />
            <div id="layoutSidenav">
                <main>
                    <div className="container px-4">
                        <div className="row">
                            <div className="col-12 col-md-10 offset-md-1 p-0 text-start">
                                <div className="ps-sm-5 pe-sm-5 pt-3 pb-3">
                                    <div className="container-fluid py-2">
                                        <Searchbar page="article" />
                                        <h1 className="display-5 mt-5 fw-bold">
                                            {article.title}
                                        </h1>
                                        <Markdown>{article.content}</Markdown>
                                        <Articledata
                                            article={article}
                                        ></Articledata>
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
