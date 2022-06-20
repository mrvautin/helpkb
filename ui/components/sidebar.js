import { React, useEffect, useState } from 'react';
import Link from 'next/link';
import { logout } from './lib/user';

function Sidebar() {
    const [email, setEmail] = useState();
    const [width, setWidth] = useState(0);
    useEffect(() => {
        setEmail(localStorage.getItem('userEmail'));
        // Set default width
        setWidth(window.innerWidth);

        // Listeners for browser resize
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const toggleSidebar = () => {
        // Only toggle when on mobile
        if(width <= 768){
            document.body.classList.toggle('sb-sidenav-toggled');
        }
    }

    // Handle browser size change
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }

    if(!email){
        return (
            <></>
        )
    }
    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav sb-sidenav-light">
                <div className="sb-sidenav-menu mt-3">
                    <div className="nav">
                        <Link href="/admin/dashboard">
                            <a className="nav-link" onClick={toggleSidebar}>
                                <div className="sb-nav-link-icon"><i className="bi bi-graph-up"></i></div>
                                Dashboard    
                            </a>
                        </Link>
                        <Link href="/admin/new">
                            <a className="nav-link" onClick={toggleSidebar}>
                                <div className="sb-nav-link-icon"><i className="bi bi-table"></i></div>
                                Create article
                            </a>
                        </Link>
                        <Link href="/admin/categories">
                            <a className="nav-link" onClick={toggleSidebar}>
                                <div className="sb-nav-link-icon"><i className="bi bi-border-all"></i></div>
                                Categories 
                            </a>
                        </Link>
                        <Link href="/admin/users">
                            <a className="nav-link" onClick={toggleSidebar}>
                                <div className="sb-nav-link-icon"><i className="bi bi-person-circle"></i></div>
                                Users 
                            </a>
                        </Link>
                        <Link href="/admin/menu">
                            <a className="nav-link" onClick={toggleSidebar}>
                                <div className="sb-nav-link-icon"><i className="bi bi-menu-button-wide-fill"></i></div>
                                Menu 
                            </a>
                        </Link>
                        <Link href="/admin/settings">
                            <a className="nav-link" onClick={toggleSidebar}>
                                <div className="sb-nav-link-icon"><i className="bi bi-gear"></i></div>
                                Settings 
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="sb-sidenav-footer text-start">
                    <div className="small text-center mt-4 mb-2">
                        {email}
                    </div>
                    <div className="d-grid gap-2">
                        <button className="nav-link btn btn-primary" onClick={logout}>Logout</button>
                    </div>
                </div>
            </nav>
        </div>
    )
};

export default Sidebar;