import { React, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SettingsContext from '../contexts/settings';

function Navbar(props) {
    const settings = useContext(SettingsContext);
    const toggleSidebar = () => {
        document.body.classNameList.toggle('sb-sidenav-toggled');
    }

    if(props.admin === true){
        // Logged in
        return (
            <div>
                <nav className="sb-topnav navbar">
                    <Link href="/admin/dashboard">
                        <a className="navbar-brand">
                            <Image src="/images/logo-small.png" className="align-self-center" width={30} height={30} alt="helpkb logo" />
                            <span className="align-top ms-2">helpkb</span>
                        </a>
                    </Link>
                    <button className="btn btn-primary btn-sm d-block d-sm-none order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={toggleSidebar} href="#!">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </button>
                </nav>
            </div>
        )
    }else{
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link href="/">
                        <a className="navbar-brand">
                            <Image src="/images/logo-text.png" className="align-top pt-0" width={120} height={40} alt="helpkb logo" />
                        </a>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            {settings.menu.map((result, i) => (
                                <li key={i} className="nav-item">
                                    <Link href={result.url}>
                                        <a className="nav-link" target="_blank">{result.name}</a>
                                    </Link>   
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Navbar