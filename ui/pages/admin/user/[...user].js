import { React, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../../components/navbar';
import Sidebar from '../../../components/sidebar';
import ErrorPage from '../../../components/404';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { api, apiReq, notification } from '../../../components/lib/config';
import { getUser} from '../../../components/lib/user'; 
import { checkUpdatePermissions, checkDeletePermissions } from '../../../../api/lib/auth'; 
import 'react-confirm-alert/src/react-confirm-alert.css';

function User() {
    const router = useRouter();
    const [user, setUser] = useState();
    const [userError, setUserError] = useState(false);
    const [userBefore, setUserBefore] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [showmodal, setShowmodal] = useState(false);
    useEffect(() => {
        localStorage.setItem('admin', true);
        let routerPath = router.asPath;
        const fetchData = async () => {
            // Check for a user
            const userSession = await getUser();
            if(userSession){
                setCurrentUser(userSession);
                localStorage.setItem('userEmail', userSession.email);
            }
            // Get users
            routerPath = routerPath.replace('/admin/user/', '');
            const res = await apiReq().get(`${api()}/api/user/${routerPath}`);
            const user = res.data;
            if(user) {
                setUserBefore(user);
                setUser(user);
            }else{
                setUserError(true);
            }
        }
        if(routerPath !== '/admin/user/[...user]'){
            fetchData();
        }
    }, [router.asPath]);

    const handleModalClose = () => setShowmodal(false);
    const handleModalShow = () => setShowmodal(true);

    const saveUser = async(e) => {
        e.preventDefault();
        // Validate inputs
        if (user.email === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set the users email address'
            });
            return;
        }
        if (user.name === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set the users name'
            });
            return;
        }

        // Check if user has permission
        const permissions = checkUpdatePermissions(currentUser, userBefore, user);
        if(!permissions.allowed){
            notification({
                title: 'Error',
                type: 'danger',
                message: permissions.message
            });
            return;
        }

        // Save user
        try{
            await apiReq().put(`${api()}/api/user/save`, {
                id: user.id,
                name: user.name,
                email: user.email,
                enabled: user.enabled,
                admin: user.admin
            });
            notification({
                title: 'Success',
                type: 'success',
                message: 'User updated'
            });
        }catch(ex){
            notification({
                title: 'Error',
                type: 'danger',
                message: ex.response.data.error
            });
        }
    }

    const deleteUser = async() => {
        // Check if user has permission
        const permissions = checkDeletePermissions(currentUser, userBefore);
        if(!permissions.allowed){
            notification({
                title: 'Error',
                type: 'danger',
                message: permissions.message
            });
            return;
        }

        try{
            await apiReq().delete(`${api()}/api/user/delete/${user.id}`);
    
            setShowmodal(false);
            notification({
                title: 'Success',
                type: 'success',
                message: 'User deleted'
            });
            window.location.href = '/admin/users'
        }catch(ex){
            notification({
                title: 'Error',
                type: 'danger',
                message: ex.response.data.error
            });
        }
    }

    if(userError){
        return (
            <ErrorPage />
        )
    }

    if(!user){
        return (
            <></>
        )
    }
    
    return (
        <div>
            <Head>
                <title>helpkb - User</title>
                <meta name="description" content=""></meta>
                <link rel="canonical" href="https://helpkb.org/admin/users" />
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
                                                                    <label htmlFor="usersName" className="form-label">Name</label>
                                                                    <input type="email" className="form-control" id="usersName" value={user.name} onChange={(evt) => { setUser({ ...user, name: evt.target.value}); }} />
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label htmlFor="emailAddress" className="form-label">Email address</label>
                                                                    <input type="text" className="form-control" id="emailAddress" value={user.email} onChange={(evt) => { setUser({ ...user, email: evt.target.value}); }} />
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label htmlFor="Account type" className="form-label">Account type</label>
                                                                    <Form.Select aria-label="Account type" value={user.admin} onChange={(evt) => { setUser({ ...user, admin: parseInt(evt.target.value)}); }}>
                                                                        <option value={0}>Regular</option>
                                                                        <option value={1}>Admin</option>
                                                                    </Form.Select>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label htmlFor="Account status" className="form-label">Account status</label>
                                                                    <Form.Select aria-label="Account status" value={user.enabled} onChange={(evt) => { setUser({ ...user, enabled: parseInt(evt.target.value)}); }}>
                                                                        <option value={0}>Disabled</option>
                                                                        <option value={1}>Enabled</option>
                                                                    </Form.Select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <div className="mb-3">
                                                                    <button type="button" className="btn btn-primary" onClick={saveUser}>Save changes</button>
                                                                </div>
                                                            </div>
                                                            <div className="col-6 text-end">
                                                                <div className="mb-3">
                                                                    <Button variant="danger" onClick={handleModalShow}>
                                                                        Delete user
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
                    <Modal show={showmodal} onHide={handleModalClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleModalClose}>
                                Close
                            </Button>
                            <Button variant="danger" onClick={deleteUser}>
                                Delete User
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default User;
