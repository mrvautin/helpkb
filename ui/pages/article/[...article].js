import { React, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import matter from 'gray-matter';
import { stripHtml } from 'string-strip-html';
import { callApi } from '../../components/lib/data';
import { api } from '../../components/lib/config';
import Articledata from '../../components/articledata';
import ErrorPage from '../../components/404';
import Navbar from '../../components/navbar';
import Searchbar from '../../components/searchbar';
import Footer from '../../components/footer';
import { gaTrack } from '../../components/lib/ga';
import Markdown from '../../components/markdown';

function Home() {
    const router = useRouter();
    const [article, setArticle] = useState();
    const [articleContentMatter, setArticleContentMatter] = useState('');
    const [articleContentMarkdown, setArticleContentMarkdown] = useState('');
    const [urlPath, setUrlPath] = useState();

    const parseContent = (article) => {
        try{
            // Parse our content
            const parsedContent = matter(article.content);
            setArticleContentMarkdown(parsedContent.content);

            // Set category
            if(!parsedContent.data.category){
                parsedContent.data.category = article.category || 'General';
            }

            // SEO stuff
            parsedContent.data.url = `${process.env.NEXT_PUBLIC_BASE_URL}/article/${parsedContent.data.url}`;
            // If description not set, grab from our content
            if(!parsedContent.data.description){
                parsedContent.data.description = stripHtml(contentHtml).result.substring(0, 255).replace(/(\r\n|\n|\r)/gm, '');
            }

            // Set the data
            setArticleContentMatter(parsedContent.data);
        }catch(ex){};
    }

    useEffect(() => {
        localStorage.setItem('admin', false);
        gaTrack();
        const routerPath = router.asPath;
        setUrlPath(routerPath);
        const fetchData = async () => {
            // Grab the article
            const article = await callApi(`${api()}/api${routerPath}`, 'get', {}, {});
            setArticle(article);

            // Parse matter and markdown
            parseContent(article);
        };
        if(routerPath !== '/article/[...article]'){
            fetchData();
        }
    },[router.asPath]);

    // Check for data
    if(!article){
        return (
            <></>
        )
    }

    // Check for error
    if(article && article.error){
        return (
            <ErrorPage url={urlPath} />
        )
    }

    return (
        <div>
            <Head>
                <title>{articleContentMatter.title}</title>
                <meta name="description" content={articleContentMatter.description}></meta>
                <meta property="og:type" content="website" />
                <meta property="og:title" content={articleContentMatter.title} />
                <meta property="og:description" content={articleContentMatter.description} />
                <meta property="og:url" content={articleContentMatter.url} />
                <link rel="canonical" href={articleContentMatter.url} />
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
                                        <Markdown>{articleContentMarkdown}</Markdown>
                                        <Articledata article={articleContentMatter}></Articledata>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Home
