import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import Nodata from '../../components/nodata';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { apiReq, notification } from '../../components/lib/config';
import { checkUser } from '../../components/lib/user';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Users() {
    const [user, setUser] = useState();
    const [users, setUsers] = useState();
    const [newuser, setNewUser] = useState({
        name: '',
        email: '',
    });
    const [showmodal, setShowmodal] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            // Check for a user
            setUser(await checkUser());

            // Get current users
            getUsers();
        };
        fetchData();
    }, []);

    const handleModalClose = () => setShowmodal(false);
    const handleModalShow = () => setShowmodal(true);

    const getUsers = async () => {
        // Get users
        const res = await apiReq().get('/api/users');
        const users = res.data;
        if (users) {
            setUsers(users);
        }
    };

    const userType = user => {
        if (user.admin === true) {
            return 'admin';
        }
        return 'regular';
    };
    const userOwner = user => {
        if (user.owner === true) {
            return 'true';
        }
        return 'false';
    };

    const addUser = async () => {
        // Validate inputs
        if (newuser.email === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set the users email address',
            });
            return;
        }
        if (newuser.name === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set the users name',
            });
            return;
        }

        try {
            await apiReq().put('/api/user/insert', {
                name: newuser.name,
                email: newuser.email,
            });

            setShowmodal(false);
            getUsers();
            notification({
                title: 'Success',
                type: 'success',
                message: 'New user created',
            });
        } catch (ex) {
            notification({
                title: 'Error',
                type: 'danger',
                message:
                    ex.response.data.error ||
                    'Please check inputs before trying again.',
            });
        }
    };

    // Check for a user
    if (!user) {
        return <></>;
    }

    if (!users) {
        return <></>;
    }

    const getContent = () => {
        if (users.length === 0) {
            return (
                <div>
                    <Nodata admin={true} type="Users"></Nodata>
                    <Button onClick={handleModalShow} variant="primary mt-3">
                        Add user
                    </Button>
                </div>
            );
        }
        return (
            <div className="container-fluid px-4">
                <div className="row">
                    <div className="col-xl-12 mt-3 text-start">
                        <div className="heading-wrap ps-2">
                            <h1>Users</h1>
                        </div>
                        <div className="row">
                            <div className="col-xl-12 p-0 text-start">
                                <div className="pb-3">
                                    <div className="container-fluid py-2">
                                        <div className="wrapper">
                                            <div className="form-wrap">
                                                {users.map((result, i) => (
                                                    <li
                                                        className="list-group-item"
                                                        key={i}
                                                    >
                                                        <div className="row">
                                                            <div className="col-12 col-md-3">
                                                                <a
                                                                    href={
                                                                        'user/' +
                                                                        result.id
                                                                    }
                                                                >
                                                                    {
                                                                        result.email
                                                                    }
                                                                </a>
                                                            </div>
                                                            <div className="col-12 col-md-3">
                                                                <strong>
                                                                    Type:
                                                                </strong>{' '}
                                                                {userType(
                                                                    result,
                                                                )}
                                                            </div>
                                                            <div className="col-12 col-md-3">
                                                                <strong>
                                                                    Owner:
                                                                </strong>{' '}
                                                                {userOwner(
                                                                    result,
                                                                )}
                                                            </div>
                                                            <div className="col-12 col-md-3">
                                                                <strong>
                                                                    Name:
                                                                </strong>{' '}
                                                                {result.name}
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                                <Button
                                                    onClick={handleModalShow}
                                                    variant="primary mt-3"
                                                >
                                                    Add user
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
        );
    };

    return (
        <div>
            <Head>
                <title>helpkb - Users</title>
                <meta content="" name="description"></meta>
                <link href="https://helpkb.org/admin/users" rel="canonical" />
            </Head>
            <Navbar admin={true} />
            <Toaster />
            <div id="layoutSidenav">
                <Sidebar />
                <div id="layoutSidenav_content">
                    <main>{getContent()}</main>
                    <Modal onHide={handleModalClose} show={showmodal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add user</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="usersName"
                                >
                                    Users Name
                                </label>
                                <input
                                    className="form-control"
                                    id="usersName"
                                    onChange={evt => {
                                        setNewUser({
                                            ...newuser,
                                            name: evt.target.value,
                                        });
                                    }}
                                    type="email"
                                    value={newuser.name}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="emailAddress"
                                >
                                    Email address
                                </label>
                                <input
                                    className="form-control"
                                    id="emailAddress"
                                    onChange={evt => {
                                        setNewUser({
                                            ...newuser,
                                            email: evt.target.value,
                                        });
                                    }}
                                    type="text"
                                    value={newuser.email}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                onClick={handleModalClose}
                                variant="secondary"
                            >
                                Close
                            </Button>
                            <Button onClick={addUser} variant="primary">
                                Add User
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Users;
