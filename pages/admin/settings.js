import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import { apiReq, notification } from '../../components/lib/config';
import SettingsContext from '../../contexts/settings';
import { checkUser } from '../../components/lib/user';
import Form from 'react-bootstrap/Form';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Settings() {
    const [user, setUser] = useState();
    const settingsContext = useContext(SettingsContext);
    const [settings, setSettings] = useState(settingsContext.config);

    useEffect(() => {
        const fetchData = async () => {
            // Check for logged in user
            setUser(await checkUser());
        };
        fetchData();
    }, []);

    const saveSettings = async () => {
        // Validate inputs
        if (settings.email === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set an email address',
            });
            return;
        }
        if (settings.websiteName === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set a website name',
            });
            return;
        }

        const res = await apiReq().put('/api/settings/save', {
            websiteName: settings.websiteName,
            welcomeMessage: settings.welcomeMessage,
            searchPlaceholder: settings.searchPlaceholder,
            websiteDescription: settings.websiteDescription,
            baseUrl: settings.baseUrl,
            dateFormat: settings.dateFormat,
            showArticleDetails: settings.showArticleDetails,
            indexType: settings.indexType,
        });

        if (res.status === 200) {
            notification({
                title: 'Success',
                type: 'success',
                message: 'Settings updated',
            });
        } else {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please check settings before trying again.',
            });
        }
    };

    const confirmSave = async e => {
        e.preventDefault();
        saveSettings();
    };

    // Check for a user
    if (!user) {
        return <></>;
    }

    if (!settings) {
        return <></>;
    }

    return (
        <div>
            <Head>
                <title>helpkb - Settings</title>
            </Head>
            <Navbar admin={true} />
            <Toaster />
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
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="websiteName"
                                                                >
                                                                    Website name
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    id="websiteName"
                                                                    onChange={evt => {
                                                                        setSettings(
                                                                            {
                                                                                ...settings,
                                                                                websiteName:
                                                                                    evt
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                        );
                                                                    }}
                                                                    type="text"
                                                                    value={
                                                                        settings.websiteName
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="websiteDescription"
                                                                >
                                                                    Website
                                                                    description
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    id="websiteDescription"
                                                                    onChange={evt => {
                                                                        setSettings(
                                                                            {
                                                                                ...settings,
                                                                                websiteDescription:
                                                                                    evt
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                        );
                                                                    }}
                                                                    type="text"
                                                                    value={
                                                                        settings.websiteDescription
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="welcomeMessage"
                                                                >
                                                                    Welcome
                                                                    message
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    id="welcomeMessage"
                                                                    onChange={evt => {
                                                                        setSettings(
                                                                            {
                                                                                ...settings,
                                                                                welcomeMessage:
                                                                                    evt
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                        );
                                                                    }}
                                                                    type="text"
                                                                    value={
                                                                        settings.welcomeMessage
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="searchPlaceholder"
                                                                >
                                                                    Search
                                                                    placeholder
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    id="searchPlaceholder"
                                                                    onChange={evt => {
                                                                        setSettings(
                                                                            {
                                                                                ...settings,
                                                                                searchPlaceholder:
                                                                                    evt
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                        );
                                                                    }}
                                                                    type="text"
                                                                    value={
                                                                        settings.searchPlaceholder
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="baseUrl"
                                                                >
                                                                    Website Base
                                                                    URL
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    id="baseUrl"
                                                                    onChange={evt => {
                                                                        setSettings(
                                                                            {
                                                                                ...settings,
                                                                                baseUrl:
                                                                                    evt
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                        );
                                                                    }}
                                                                    type="text"
                                                                    value={
                                                                        settings.baseUrl
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="dateFormat"
                                                                >
                                                                    Date format
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    id="dateFormat"
                                                                    onChange={evt => {
                                                                        setSettings(
                                                                            {
                                                                                ...settings,
                                                                                dateFormat:
                                                                                    evt
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                        );
                                                                    }}
                                                                    type="text"
                                                                    value={
                                                                        settings.dateFormat
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="mb-3">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="indexType"
                                                                >
                                                                    Index
                                                                    display type
                                                                </label>
                                                                <Form.Select
                                                                    aria-label="indexType"
                                                                    onChange={evt => {
                                                                        setSettings(
                                                                            {
                                                                                ...settings,
                                                                                indexType:
                                                                                    evt
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                        );
                                                                    }}
                                                                    value={
                                                                        settings.indexType
                                                                    }
                                                                >
                                                                    <option value="recent">
                                                                        Recent
                                                                        articles
                                                                    </option>
                                                                    <option value="categories">
                                                                        Categories
                                                                    </option>
                                                                </Form.Select>
                                                            </div>
                                                            <div className="mb-3">
                                                                <label
                                                                    className="form-label"
                                                                    htmlFor="showArticleDetails"
                                                                >
                                                                    Show article
                                                                    details
                                                                </label>
                                                                <Form.Select
                                                                    aria-label="showArticleDetails"
                                                                    onChange={evt => {
                                                                        setSettings(
                                                                            {
                                                                                ...settings,
                                                                                showArticleDetails:
                                                                                    evt
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                        );
                                                                    }}
                                                                    value={
                                                                        settings.showArticleDetails
                                                                    }
                                                                >
                                                                    <option
                                                                        value={
                                                                            false
                                                                        }
                                                                    >
                                                                        Hide
                                                                    </option>
                                                                    <option
                                                                        value={
                                                                            true
                                                                        }
                                                                    >
                                                                        Show
                                                                    </option>
                                                                </Form.Select>
                                                            </div>
                                                            <div className="mb-3">
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={
                                                                        confirmSave
                                                                    }
                                                                    type="button"
                                                                >
                                                                    Save
                                                                    settings
                                                                </button>
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
    );
}

export default Settings;
