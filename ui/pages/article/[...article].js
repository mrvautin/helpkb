import { React, useEffect } from 'react';
import Head from 'next/head';
import { callApi, parseContent } from '../../components/lib/data';
import { api } from '../../components/lib/config';
import { gaTrack } from '../../components/lib/ga';
import Articledata from '../../components/articledata';
import ErrorPage from '../../components/404';
import Navbar from '../../components/navbar';
import Searchbar from '../../components/searchbar';
import Footer from '../../components/footer';
import Markdown from '../../components/markdown';

export async function getServerSideProps(context) {
    // Fetch article
    try{
        const query = context.query;
        const articleSlug = query.article[0];
        const article = await callApi(`${api()}/api/article/${articleSlug}`, 'get', {}, {});

        // If article not found
        if(article.error){
            return {
                props: {
                    article: {
                        error: 'Article not found',
                        url: `/article/${articleSlug}`
                    }
                }
            }
        }

        // Parse content
        const parsedContent = parseContent(article);
        
        // Return our data
        return {
            props: {
                article: parsedContent
            }
        }
    }catch(ex){
        console.log('Ex. Failed to fetch article data', ex);
        return {
            props: {
                article: {
                    error: 'Failed to fetch article data',
                    url: `/article/${context.article[0]}`
                }
            }
        }
    } 
}

function Home({article}) {
    useEffect(() => {
        gaTrack();
    });

    // Check for data
    if(!article){
        return (
            <></>
        )
    }

    // Check for error
    if(article && article.error){
        return (
            <ErrorPage url={article.url} />
        )
    }

    return (
        <div>
            <Head>
                <title>{article.seoTitle}</title>
                <meta name="description" content={article.description}></meta>
                <meta property="og:type" content="website" />
                <meta property="og:title" content={article.seoTitle} />
                <meta property="og:description" content={article.description} />
                <meta property="og:url" content={article.url} />
                <link rel="canonical" href={article.url} />
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
                                        <Articledata article={article}></Articledata>
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
