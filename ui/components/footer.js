/* eslint-disable @next/next/no-img-element */
import { React } from 'react';

function Footer() {
    return (
        <footer>
            <div className="text-center">
                <img src= "/images/logo-small.png" width="35" height="35" alt="helpkb logo" />
                <span className="footer-text text-muted">helpkb</span>
            </div>
        </footer>
    )
}

export default Footer