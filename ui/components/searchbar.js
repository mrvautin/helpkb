import { React, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { callApi } from '../components/lib/data';
import { api } from '../components/lib/config';

function Searchbar(props) {
    const router = useRouter();
    const [searchterm, setSearchterm] = useState('');
    const [searchresults, setSearchresults] = useState([]);
    const [resultsShow, setResultsShow] = useState('d-none');

    const [isAdmin, setIsAdmin] = useState();

    useEffect(() => {
    }, [router.asPath]);

    const queryAPI = async () => {
        const routerPath = router.asPath;
        // Check to ensure results href is correct
        if(routerPath.startsWith('/admin/')){
            setIsAdmin(true);
        }else{
            setIsAdmin(false);
        }
        const results = await callApi(`${api()}/api/search/${searchterm}`, 'get', {}, {});
        if(results){
            setResultsShow('');
            setSearchresults(results);
        }else{
            setResultsShow('d-none');
            setSearchresults([]);
        }
    };

    const welcomeMessage = () => {
        if(props.page === 'homepage'){
            return (
                <div className="text-center mb-4">
                    <h1>{props.message}</h1>
                </div>
            )
        }
        return;
    };

    const printResults = () => {
        if(searchresults.length > 0){
            return (
                searchresults.map((result, i) => (
                    <li key={i} className="list-group-item">
                        {getUrl(isAdmin, result)}
                    </li>
                ))
            )
        }else{
            return (
                <li className="list-group-item">No results</li>
            )
        }
    }

    const searchInputChange = (evt) => {
        // Set input value
        setSearchterm(evt.target.value);

        // If input is empty, ensure results hidden
        if(evt.target.value === ''){
            setResultsShow('d-none');
        }
    }

    return (
        <div className="row">
            <div className="searchbar-wrapper col-12 col-md-8 offset-md-2">
                {welcomeMessage()}
                <div className="input-group mt-2">
                    <input type="text" className="form-control form-control-lg" value={searchterm} onChange={searchInputChange} placeholder={props.placeholder || 'Search the knowledge base'} />
                    <button className="btn btn-outline-primary" type="button" onClick={queryAPI} id="button-addon2">Search</button>
                </div>
                <ul id="search-results" className={"list-group col-12 pe-4 " + resultsShow}>
                    {printResults()}
                </ul>
            </div>
        </div>
    )
}

// Set href depending on if admin or frontend
function getUrl(isAdmin, result){
    if(isAdmin === true){
        return <a href={"/admin/edit/" + result.id}>{result.title}</a>
    }else{
        return <a href={"/article/" + result.url}>{result.title}</a>
    }
}

export default Searchbar