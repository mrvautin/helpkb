import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import Searchbar from '../../components/searchbar';
import Nodata from '../../components/nodata';
import { formatDate } from '../../components/lib/data';
import { checkUser } from '../../components/lib/user';
import { apiReq } from '../../components/lib/config';

function Dashboard() {
    const [user, setUser] = useState();
    const [articles, setArticles] = useState();
    useEffect(() => {
        const fetchData = async () => {
            // Check for a user
            setUser(await checkUser());

            // Get recent articles
            const res = await apiReq().get('/api/admin/search/count/10');
            setArticles(res.data);
        };
        fetchData();
    }, []);

    // Check for a user
    if (!user) {
        return <></>;
    }

    if (!articles) {
        return <></>;
    }

    const getContent = () => {
        if (articles.length === 0) {
            return <Nodata admin={true} type="Articles"></Nodata>;
        }
        return (
            <div className="pb-3">
                <div className="container-fluid py-2">
                    <Searchbar page="dashboard" />
                    <div className="wrapper mt-3">
                        <h2>Latest articles</h2>
                        <ul className="list-group search-results">
                            {articles.map((result, i) => (
                                <li className="list-group-item" key={i}>
                                    <div className="row">
                                        <div className="col-7">
                                            <a href={'edit/' + result.id}>
                                                {result.title}
                                            </a>
                                        </div>
                                        <div className="col-2">
                                            <strong>Views:</strong>{' '}
                                            {result.views || 0}
                                        </div>
                                        <div className="col-3 text-end">
                                            <strong>Published:</strong>{' '}
                                            {formatDate(result.publishedDate)}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Head>
                <title>helpkb - Dashboard</title>
                <meta content="" name="description"></meta>
                <link
                    href={process.env.NEXT_PUBLIC_BASE_URL + '/admin/dashboard'}
                    rel="canonical"
                />
            </Head>
            <Navbar admin={true} />
            <div id="layoutSidenav">
                <Sidebar />
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4">
                            <div className="row">
                                <div className="col-xl-12 mt-3 text-start">
                                    <div className="heading-wrap ps-2">
                                        <h1>Dashboard</h1>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-12 p-0 text-start">
                                            {getContent()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
