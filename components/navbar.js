import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SettingsContext from '../contexts/settings';

function Navbar(props) {
    const settings = useContext(SettingsContext);
    const toggleSidebar = () => {
        document.body.classNameList.toggle('sb-sidenav-toggled');
    };

    if (props.admin === true) {
        // Logged in
        return (
            <div>
                <nav className="sb-topnav navbar">
                    <Link href="/admin/dashboard" legacyBehavior>
                        <a className="navbar-brand">
                            <Image
                                alt="helpkb logo"
                                className="align-top pt-0"
                                height={40}
                                src="/images/logo-text.png"
                                width={104}
                            />
                        </a>
                    </Link>
                    <button
                        className="btn btn-primary btn-sm d-block d-sm-none order-1 order-lg-0 me-4 me-lg-0"
                        href="#!"
                        id="sidebarToggle"
                        onClick={toggleSidebar}
                    >
                        <svg
                            fill="currentColor"
                            height="16"
                            viewBox="0 0 16 16"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                                fillRule="evenodd"
                            />
                        </svg>
                    </button>
                </nav>
            </div>
        );
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link href="/" legacyBehavior>
                    <a className="navbar-brand">
                        <Image
                            alt="helpkb logo"
                            className="align-top pt-0"
                            height={40}
                            src="/images/logo-text.png"
                            width={104}
                        />
                    </a>
                </Link>
                <button
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    className="navbar-toggler"
                    data-bs-target="#navbarNav"
                    data-bs-toggle="collapse"
                    type="button"
                >
                    <svg
                        fill="currentColor"
                        height="16"
                        viewBox="0 0 16 16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                            fillRule="evenodd"
                        />
                    </svg>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {settings.menu.map((result, i) => (
                            <li className="nav-item" key={i}>
                                <Link href={result.url} legacyBehavior>
                                    <a className="nav-link" target="_blank">
                                        {result.name}
                                    </a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
