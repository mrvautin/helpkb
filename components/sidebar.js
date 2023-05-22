import { useContext, useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import SettingsContext from '../contexts/settings';

function Sidebar() {
    const settings = useContext(SettingsContext);
    const [width, setWidth] = useState(0);
    useEffect(() => {
        // Set default width
        setWidth(window.innerWidth);

        // Listeners for browser resize
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    const toggleSidebar = () => {
        // Only toggle when on mobile
        if (width <= 768) {
            document.body.classList.toggle('sb-sidenav-toggled');
        }
    };

    // Handle browser size change
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    };

    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav sb-sidenav-light">
                <div className="sb-sidenav-menu mt-3">
                    <div className="nav">
                        <Link href="/admin/dashboard" legacyBehavior>
                            <a className="nav-link" onClick={toggleSidebar}>
                                <div className="sb-nav-link-icon">
                                    <svg
                                        fill="currentColor"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        width="16"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"
                                            fillRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                Dashboard
                            </a>
                        </Link>
                        <Link href="/admin/new" legacyBehavior>
                            <a className="nav-link" onClick={toggleSidebar}>
                                <div className="sb-nav-link-icon">
                                    <svg
                                        fill="currentColor"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        width="16"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
                                    </svg>
                                </div>
                                Create article
                            </a>
                        </Link>
                        <Link href="/admin/categories" legacyBehavior>
                            <a className="nav-link" onClick={toggleSidebar}>
                                <div className="sb-nav-link-icon">
                                    <svg
                                        fill="currentColor"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        width="16"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M0 0h16v16H0V0zm1 1v6.5h6.5V1H1zm7.5 0v6.5H15V1H8.5zM15 8.5H8.5V15H15V8.5zM7.5 15V8.5H1V15h6.5z" />
                                    </svg>
                                </div>
                                Categories
                            </a>
                        </Link>
                        <Link href="/admin/users" legacyBehavior>
                            <a className="nav-link" onClick={toggleSidebar}>
                                <div className="sb-nav-link-icon">
                                    <svg
                                        fill="currentColor"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        width="16"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                        <path
                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                                            fillRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                Users
                            </a>
                        </Link>
                        <Link href="/admin/menu" legacyBehavior>
                            <a className="nav-link" onClick={toggleSidebar}>
                                <div className="sb-nav-link-icon">
                                    <svg
                                        fill="currentColor"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        width="16"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v2A1.5 1.5 0 0 0 1.5 5h13A1.5 1.5 0 0 0 16 3.5v-2A1.5 1.5 0 0 0 14.5 0h-13zm1 2h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zm9.927.427A.25.25 0 0 1 12.604 2h.792a.25.25 0 0 1 .177.427l-.396.396a.25.25 0 0 1-.354 0l-.396-.396zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2H1zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2h14zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                </div>
                                Menu
                            </a>
                        </Link>
                        <Link href="/admin/settings" legacyBehavior>
                            <a className="nav-link" onClick={toggleSidebar}>
                                <div className="sb-nav-link-icon">
                                    <svg
                                        fill="currentColor"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        width="16"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                                    </svg>
                                </div>
                                Settings
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="sb-sidenav-footer text-start">
                    <div className="small text-center mt-4 mb-2">
                        {settings.config.userEmail}
                    </div>
                    <div className="d-grid gap-2">
                        <button
                            className="nav-link btn btn-primary"
                            onClick={() => signOut()}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Sidebar;
