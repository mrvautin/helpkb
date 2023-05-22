import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../../components/navbar';
import Sidebar from '../../../components/sidebar';
import ErrorPage from '../../../components/404';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { apiReq, notification } from '../../../components/lib/config';
import { checkUser } from '../../../components/lib/user';
import {
    checkDeletePermissions,
    checkUpdatePermissions,
} from '../../../components/lib/auth';
import 'react-confirm-alert/src/react-confirm-alert.css';

function User() {
    const router = useRouter();
    const [user, setUser] = useState();
    const [userError, setUserError] = useState(false);
    const [userBefore, setUserBefore] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [showmodal, setShowmodal] = useState(false);
    useEffect(() => {
        let routerPath = router.asPath;
        const fetchData = async () => {
            // Check for a user
            setCurrentUser(await checkUser());

            // Get users
            routerPath = routerPath.replace('/admin/user/', '');
            const res = await apiReq().get(`/api/user/${routerPath}`);
            const user = res.data;
            if (user) {
                setUserBefore(user);
                setUser(user);
            } else {
                setUserError(true);
            }
        };
        if (routerPath !== '/admin/user/[...user]') {
            fetchData();
        }
    }, [router.asPath]);

    const handleModalClose = () => setShowmodal(false);
    const handleModalShow = () => setShowmodal(true);

    const saveUser = async e => {
        e.preventDefault();
        // Validate inputs
        if (user.email === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set the users email address',
            });
            return;
        }
        if (user.name === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set the users name',
            });
            return;
        }

        // Check if user has permission
        const permissions = checkUpdatePermissions(
            currentUser,
            userBefore,
            user,
        );
        if (!permissions.allowed) {
            notification({
                title: 'Error',
                type: 'danger',
                message: permissions.message,
            });
            return;
        }

        // Save user
        try {
            await apiReq().put('/api/user/save', {
                id: user.id,
                name: user.name,
                email: user.email,
                enabled: user.enabled,
                admin: user.admin,
            });
            notification({
                title: 'Success',
                type: 'success',
                message: 'User updated',
            });
        } catch (ex) {
            notification({
                title: 'Error',
                type: 'danger',
                message: ex.response.data.error,
            });
        }
    };

    const deleteUser = async () => {
        // Check if user has permission
        const permissions = checkDeletePermissions(currentUser, userBefore);
        if (!permissions.allowed) {
            notification({
                title: 'Error',
                type: 'danger',
                message: permissions.message,
            });
            return;
        }

        try {
            await apiReq().delete(`/api/user/delete/${user.id}`);

            setShowmodal(false);
            notification({
                title: 'Success',
                type: 'success',
                message: 'User deleted',
            });
            window.location.href = '/admin/users';
        } catch (ex) {
            notification({
                title: 'Error',
                type: 'danger',
                message: ex.response.data.error,
            });
        }
    };

    // Cant get user to edit
    if (userError) {
        return <ErrorPage />;
    }

    // Check for a user
    if (!currentUser) {
        return <></>;
    }

    if (!user) {
        return <></>;
    }

    return (
        <div>
            <Head>
                <title>helpkb - User</title>
                <meta content="" name="description"></meta>
                <link href="https://helpkb.org/admin/users" rel="canonical" />
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
                                        <h1>User</h1>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-12 p-0 text-start">
                                            <div className="pb-3">
                                                <div className="container-fluid py-2">
                                                    <div className="wrapper">
                                                        <div className="form-wrap">
                                                            <div className="row">
                                                                <div className="mb-3">
                                                                    <label
                                                                        className="form-label"
                                                                        htmlFor="usersName"
                                                                    >
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        id="usersName"
                                                                        onChange={evt => {
                                                                            setUser(
                                                                                {
                                                                                    ...user,
                                                                                    name: evt
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            );
                                                                        }}
                                                                        type="email"
                                                                        value={
                                                                            user.name
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label
                                                                        className="form-label"
                                                                        htmlFor="emailAddress"
                                                                    >
                                                                        Email
                                                                        address
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        id="emailAddress"
                                                                        onChange={evt => {
                                                                            setUser(
                                                                                {
                                                                                    ...user,
                                                                                    email: evt
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            );
                                                                        }}
                                                                        type="text"
                                                                        value={
                                                                            user.email
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label
                                                                        className="form-label"
                                                                        htmlFor="Account type"
                                                                    >
                                                                        Account
                                                                        type
                                                                    </label>
                                                                    <Form.Select
                                                                        aria-label="Account type"
                                                                        onChange={evt => {
                                                                            setUser(
                                                                                {
                                                                                    ...user,
                                                                                    admin: evt
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            );
                                                                        }}
                                                                        value={
                                                                            user.admin
                                                                        }
                                                                    >
                                                                        <option
                                                                            value={
                                                                                false
                                                                            }
                                                                        >
                                                                            Regular
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                true
                                                                            }
                                                                        >
                                                                            Admin
                                                                        </option>
                                                                    </Form.Select>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label
                                                                        className="form-label"
                                                                        htmlFor="Account status"
                                                                    >
                                                                        Account
                                                                        status
                                                                    </label>
                                                                    <Form.Select
                                                                        aria-label="Account status"
                                                                        onChange={evt => {
                                                                            setUser(
                                                                                {
                                                                                    ...user,
                                                                                    enabled:
                                                                                        evt
                                                                                            .target
                                                                                            .value,
                                                                                },
                                                                            );
                                                                        }}
                                                                        value={
                                                                            user.enabled
                                                                        }
                                                                    >
                                                                        <option
                                                                            value={
                                                                                false
                                                                            }
                                                                        >
                                                                            Disabled
                                                                        </option>
                                                                        <option
                                                                            value={
                                                                                true
                                                                            }
                                                                        >
                                                                            Enabled
                                                                        </option>
                                                                    </Form.Select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <div className="mb-3">
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        onClick={
                                                                            saveUser
                                                                        }
                                                                        type="button"
                                                                    >
                                                                        Save
                                                                        changes
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="col-6 text-end">
                                                                <div className="mb-3">
                                                                    <Button
                                                                        onClick={
                                                                            handleModalShow
                                                                        }
                                                                        variant="danger"
                                                                    >
                                                                        Delete
                                                                        user
                                                                    </Button>
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
                        </div>
                    </main>
                    <Modal onHide={handleModalClose} show={showmodal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button
                                onClick={handleModalClose}
                                variant="secondary"
                            >
                                Close
                            </Button>
                            <Button onClick={deleteUser} variant="danger">
                                Delete User
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default User;
