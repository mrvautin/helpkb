import { React, useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import { api, apiReq, notification } from '../../components/lib/config';
import SettingsContext from '../../contexts/settings';
import { getUser } from '../../components/lib/user'; 
import Form from 'react-bootstrap/Form';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Settings() {
    const settingsContext = useContext(SettingsContext);
    const [settings, setSettings] = useState(settingsContext.config);

    useEffect(() => {
        localStorage.setItem('admin', true);
        const fetchData = async () => {
            const user = await getUser();
            if(user){
                localStorage.setItem('userEmail', user.email);
            }
        }
        fetchData();
    }, []);

    const saveSettings = async() => {
        // Validate inputs
        if (settings.email === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set an email address'
            });
            return;
        }
        if (settings.websiteName === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set a website name'
            });
            return;
        }

        const res = await apiReq().put(`${api()}/api/settings/save`, {
            websiteName: settings.websiteName,
            welcomeMessage: settings.welcomeMessage,
            searchPlaceholder: settings.searchPlaceholder,
            websiteDescription: settings.websiteDescription,
            baseUrl: settings.baseUrl,
            dateFormat: settings.dateFormat,
            showArticleDetails: settings.showArticleDetails,
            indexType: settings.indexType
        });

        if(res.status === 200){
            notification({
                title: 'Success',
                type: 'success',
                message: 'Settings updated'
            });
        }else{
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please check settings before trying again.'
            });
        }
    }

    const confirmSave = async(e) => {
        e.preventDefault()
        saveSettings();
    }

    if(!settings){
        return (
            <></>
        )
    }

    return (
        <div>
            <Head>
                <title>helpkb - Settings</title>
            </Head>
            <Navbar admin={true} />
            <Toaster/>
            <div id="layoutSidenav">
                <Sidebar />
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4">
                            <div className="row">
                                <div className="col-xl-12 mt-3 text-start">
                                    <div className="heading-wrap ps-2">
                                        <h1>Settings</h1>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-12 p-0 text-start">
                                            <div className="pb-3">
                                                <div className="container-fluid py-2">
                                                    <div className="wrapper">
                                                        <div className="form-wrap">
                                                            <div className="mb-3">
                                                                <label htmlFor="websiteName" className="form-label">Website name</label>
                                                                <input type="text" className="form-control" id="websiteName" value={settings.websiteName} onChange={(evt) => { setSettings({ ...settings, websiteName: evt.target.value}); }} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="websiteDescription" className="form-label">Website description</label>
                                                                <input type="text" className="form-control" id="websiteDescription" value={settings.websiteDescription} onChange={(evt) => { setSettings({ ...settings, websiteDescription: evt.target.value}); }} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="welcomeMessage" className="form-label">Welcome message</label>
                                                                <input type="text" className="form-control" id="welcomeMessage" value={settings.welcomeMessage} onChange={(evt) => { setSettings({ ...settings, welcomeMessage: evt.target.value}); }} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="searchPlaceholder" className="form-label">Search placeholder</label>
                                                                <input type="text" className="form-control" id="searchPlaceholder" value={settings.searchPlaceholder} onChange={(evt) => { setSettings({ ...settings, searchPlaceholder: evt.target.value}); }} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="baseUrl" className="form-label">Website Base URL</label>
                                                                <input type="text" className="form-control" id="baseUrl" value={settings.baseUrl} onChange={(evt) => { setSettings({ ...settings, baseUrl: evt.target.value}); }} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="dateFormat" className="form-label">Date format</label>
                                                                <input type="text" className="form-control" id="dateFormat" value={settings.dateFormat} onChange={(evt) => { setSettings({ ...settings, dateFormat: evt.target.value}); }} />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="indexType" className="form-label">Index display type</label>
                                                                <Form.Select aria-label="indexType" value={settings.indexType} onChange={(evt) => { setSettings({ ...settings, indexType: evt.target.value}); }}>
                                                                    <option value="recent">Recent articles</option>
                                                                    <option value="categories">Categories</option>
                                                                </Form.Select>
                                                            </div>
                                                            <div className="mb-3">
                                                                <label htmlFor="showArticleDetails" className="form-label">Show article details</label>
                                                                <Form.Select aria-label="showArticleDetails" value={settings.showArticleDetails} onChange={(evt) => { setSettings({ ...settings, showArticleDetails: parseInt(evt.target.value)}); }}>
                                                                    <option value={0}>Hide</option>
                                                                    <option value={1}>Show</option>
                                                                </Form.Select>
                                                            </div>
                                                            <div className="mb-3">
                                                                <button type="button" className="btn btn-primary" onClick={confirmSave}>Save settings</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Settings;
