import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiReq } from '../components/lib/config';

function Searchbar(props) {
    const router = useRouter();
    const [searchterm, setSearchterm] = useState('');
    const [searchresults, setSearchresults] = useState([]);
    const [resultsShow, setResultsShow] = useState('d-none');

    const [isAdmin, setIsAdmin] = useState();

    const queryAPI = async () => {
        const routerPath = router.asPath;
        // Check to ensure results href is correct
        if (routerPath.startsWith('/admin/')) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
        const results = await apiReq().get(`/api/search/${searchterm}`);
        if (results.data) {
            setResultsShow('');
            setSearchresults(results.data);
        } else {
            setResultsShow('d-none');
            setSearchresults([]);
        }
    };

    const welcomeMessage = () => {
        if (props.page === 'homepage') {
            return (
                <div className="text-center mb-4">
                    <h1>{props.message}</h1>
                </div>
            );
        }
        return;
    };

    const printResults = () => {
        if (searchresults.length > 0) {
            return searchresults.map((result, i) => (
                <li className="list-group-item" key={i}>
                    {getUrl(isAdmin, result)}
                </li>
            ));
        }
        return <li className="list-group-item">No results</li>;
    };

    const searchInputChange = evt => {
        // Set input value
        setSearchterm(evt.target.value);

        // If input is empty, ensure results hidden
        if (evt.target.value === '') {
            setResultsShow('d-none');
        }
    };

    return (
        <div className="row">
            <div className="searchbar-wrapper col-12 col-md-8 offset-md-2">
                {welcomeMessage()}
                <div className="input-group mt-2">
                    <input
                        className="form-control form-control-lg"
                        onChange={searchInputChange}
                        placeholder={
                            props.placeholder || 'Search the knowledge base'
                        }
                        type="text"
                        value={searchterm}
                    />
                    <button
                        className="btn btn-outline-primary"
                        id="button-addon2"
                        onClick={queryAPI}
                        type="button"
                    >
                        Search
                    </button>
                </div>
                <ul
                    className={'list-group col-12 pe-4 ' + resultsShow}
                    id="search-results"
                >
                    {printResults()}
                </ul>
            </div>
        </div>
    );
}

// Set href depending on if admin or frontend
function getUrl(isAdmin, result) {
    if (isAdmin === true) {
        return <a href={'/admin/edit/' + result.id}>{result.title}</a>;
    }
    return <a href={'/article/' + result.url}>{result.title}</a>;
}

export default Searchbar;
