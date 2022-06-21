import { React, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { callApi, formatDate, capsFirst } from '../../components/lib/data';
import SettingsContext from '../../contexts/settings';
import { api } from '../../components/lib/config';
import Navbar from '../../components/navbar';
import Searchbar from '../../components/searchbar';
import Footer from '../../components/footer';
import { gaTrack } from '../../components/lib/ga';

function Home() {
    const settings = useContext(SettingsContext);
    const router = useRouter();
    const [categoryArticles, setCategoryArticles] = useState();
    const [categoryClean, setCategoryClean] = useState();
    const [categoryUrl, setCategoryUrl] = useState();

    useEffect(() => {
        gaTrack();
        const routerPath = router.asPath;
        const fetchData = async () => {
            const cat = routerPath.replace('/category/', '');
            const categoryClean = capsFirst(cat.replace('-', ' '));
            setCategoryClean(categoryClean);
            // Grab the articles for this category
            const categoryRes = await callApi(`${api()}/api/category/${cat}`, 'get', {}, {});
            setCategoryArticles(categoryRes);
            setCategoryUrl(routerPath.toLowerCase().replace(' ', '-'));
        };
        if(routerPath !== '/category/[...category]'){
            fetchData();
        }
    },[router.asPath]);

    // Check for data
    if(!categoryArticles){
        return (
            <></>
        )
    }

    const pinned = (result) => {
        if(result.pinned === true){
            return (
                <i className="primary-text bi bi-pin-fill"></i>
            )
        }
    }

    const getContent = () => {
        if(categoryArticles.length === 0){
            return (
                <div>
                    <li className="list-group-item mt-2">
                        No articles in this category
                    </li>
                </div>
            )
        }else{
            return(
                categoryArticles.map((result, i) => (
                    <li key={i} className="list-group-item">
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <a href={"/article/" + result.url}>{result.title}</a>
                            </div>
                            <div className="col-12 col-md-3 text-end">
                                
                            </div>
                            <div className="col-md-3 text-end d-none d-sm-block">
                                <div>
                                    {pinned(result)}
                                    <strong className="ps-2">Published:</strong> {formatDate(result.publishedDate, settings.config)}
                                </div>
                            </div>
                        </div>
                    </li>
                ))
            )
        }
    }

    return (
        <div>
            <Head>
                <title>Category: {categoryClean}</title>
                <meta name="description" content={"Currently showing articles within category: " + categoryClean}></meta>
                <meta property="og:type" content="website" />
                <meta property="og:title" content={"Category: " + categoryClean} />
                <meta property="og:description" content={"Currently showing articles within category: " + categoryClean} />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL + categoryUrl} />
                <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL + categoryUrl} />
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
                                            {categoryClean}
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
    )
}

export default Home
