import { React, useEffect, useState } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import Nodata from '../../components/nodata';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';
import { api, apiReq, notification } from '../../components/lib/config';
import { checkUser } from '../../components/lib/user'; 
import 'react-confirm-alert/src/react-confirm-alert.css';

function Menu() {
    const [user, setUser] = useState();
    const [menus, setMenus] = useState();
    const [newmenu, setNewMenu] = useState({
        name: '',
        url: ''
    });
    const [showmodal, setShowmodal] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            // Check for a user
            setUser(await checkUser());

            // Get the Menu
            getMenu();
        }
        fetchData();
    }, []);

    const handleModalClose = () => setShowmodal(false);
    const handleModalShow = () => setShowmodal(true);

    const getMenu = async () => {
        // Get menus
        const res = await apiReq().get(`${api()}/api/menu`);
        const menus = res.data;
        if(menus) {
            setMenus(menus);
        }
    }

    const addMenu = async() => {
        // Validate inputs
        if (newmenu.name === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set the menu name'
            });
            return;
        }
        if (newmenu.url === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set the menu Url'
            });
            return;
        }

        try{
            await apiReq().put(`${api()}/api/menu/insert`, {
                name: newmenu.name,
                url: newmenu.url
            });

            setShowmodal(false);
            getMenu();
            
            // Clear inputs
            setNewMenu({
                name: '',
                url: ''
            });

            notification({
                title: 'Success',
                type: 'success',
                message: 'New menu item created'
            });
        }catch(ex){
            notification({
                title: 'Error',
                type: 'danger',
                message: ex.response.data.error || 'Please check inputs before trying again.'
            });
        }
    }

    const deleteMenu = async(id) => {
        try{
            await apiReq().delete(`${api()}/api/menu/delete/${id}`);
            getMenu();
            notification({
                title: 'Success',
                type: 'success',
                message: 'Menu item deleted'
            });
        }catch(ex){
            notification({
                title: 'Error',
                type: 'danger',
                message: ex.response.data.error || 'Please check inputs before trying again.'
            });
        }
    }
    
    const onSortEnd = async(oldIndex, newIndex) => {
        const newOrder = [];
        setMenus((array) => {
            newOrder = arrayMoveImmutable(array, oldIndex, newIndex);
            return newOrder;
        });
        await apiReq().put(`${api()}/api/menu/sort`, newOrder);
        notification({
            title: 'Success',
            type: 'success',
            message: 'Menu sorted'
        });
    }

    // Check for a user
    if(!user){
        return (
            <></>
        )
    }
   
    if(!menus){
        return (
            <></>
        )
    }

    const getContent = () => {
        if(menus.length === 0){
            return (
                <div className="text-center">
                    <Nodata admin={true} type="Menu items"></Nodata>
                    <Button variant="primary mt-3" onClick={handleModalShow}>
                        Add Menu
                    </Button>
                </div>
            )
        }else{
            return(
                <div className="container-fluid px-4">
                    <div className="row">
                        <div className="col-xl-12 mt-3 text-start">
                            <div className="heading-wrap ps-2">
                                <h1>Menu items</h1>
                            </div>
                            <div className="row">
                                <div className="col-xl-12 p-0 text-start">
                                    <div className="pb-3">
                                        <div className="container-fluid py-2">
                                            <div className="wrapper">
                                                <div className="text-muted mb-2">Note: Drag menu item to reorder</div>
                                                <div className="form-wrap">
                                                    <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="dragged">
                                                    {menus.map((result, i) => (
                                                        <SortableItem key={result.id}>
                                                        <li className="list-group-item draggable">
                                                            <div className="row">
                                                                <div className="col-12 col-md-5">
                                                                    <strong>Name:</strong> {result.name}
                                                                </div>
                                                                <div className="col-12 col-md-5">
                                                                    <strong className="me-2">Url:</strong>
                                                                    <a target="_blank" rel="noreferrer" href={result.url}>{result.url}</a>
                                                                </div>
                                                                <div className="col-12 col-md-2 text-end">
                                                                    <button className="btn btn-sm btn-danger" onClick={()=>deleteMenu(result.id)}>Delete</button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        </SortableItem>
                                                    ))}
                                                    </SortableList>
                                                    <Button variant="primary mt-3" onClick={handleModalShow}>
                                                        Add menu item
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
            )
        }
    }

    return (
        <div>
            <Head>
                <title>helpkb - Menus items</title>
                <meta name="description" content=""></meta>
                <link rel="canonical" href="https://helpkb.org/admin/menu" />
            </Head>
            <Navbar admin={true} />
            <Toaster/>
            <div id="layoutSidenav">
                <Sidebar />
                <div id="layoutSidenav_content">
                    <main>
                        {getContent()}
                    </main>
                    <Modal show={showmodal} onHide={handleModalClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add menu</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-3">
                                <label htmlFor="menuName" className="form-label">Menu Name</label>
                                <input type="text" className="form-control" id="menuName" value={newmenu.name} placeholder="Getting started" onChange={(evt) => { setNewMenu({ ...newmenu, name: evt.target.value}); }} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="menuUrl" className="form-label">Menu Url</label>
                                <input type="text" className="form-control" id="menuUrl" value={newmenu.url} placeholder="getting-started" onChange={(evt) => { setNewMenu({ ...newmenu, url: evt.target.value}); }} />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleModalClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={addMenu}>
                                Add Menu
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default Menu;
