import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import Nodata from '../../components/nodata';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';
import { apiReq, notification } from '../../components/lib/config';
import { checkUser } from '../../components/lib/user';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Menu() {
    const [user, setUser] = useState();
    const [menus, setMenus] = useState();
    const [newmenu, setNewMenu] = useState({
        name: '',
        url: '',
    });
    const [showmodal, setShowmodal] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            // Check for a user
            setUser(await checkUser());

            // Get the Menu
            getMenu();
        };
        fetchData();
    }, []);

    const handleModalClose = () => setShowmodal(false);
    const handleModalShow = () => setShowmodal(true);

    const getMenu = async () => {
        // Get menus
        const res = await apiReq().get('/api/menu');
        const menus = res.data;
        if (menus) {
            setMenus(menus);
        }
    };

    const addMenu = async () => {
        // Validate inputs
        if (newmenu.name === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set the menu name',
            });
            return;
        }
        if (newmenu.url === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set the menu Url',
            });
            return;
        }

        try {
            await apiReq().put('/api/menu/insert', {
                name: newmenu.name,
                url: newmenu.url,
            });

            setShowmodal(false);
            getMenu();

            // Clear inputs
            setNewMenu({
                name: '',
                url: '',
            });

            notification({
                title: 'Success',
                type: 'success',
                message: 'New menu item created',
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

    const deleteMenu = async id => {
        try {
            await apiReq().delete(`/api/menu/delete/${id}`);
            getMenu();
            notification({
                title: 'Success',
                type: 'success',
                message: 'Menu item deleted',
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

    const onSortEnd = async (oldIndex, newIndex) => {
        let newOrder = [];
        setMenus(array => {
            newOrder = arrayMoveImmutable(array, oldIndex, newIndex);
            return newOrder;
        });
        await apiReq().put('/api/menu/sort', newOrder);
        notification({
            title: 'Success',
            type: 'success',
            message: 'Menu sorted',
        });
    };

    // Check for a user
    if (!user) {
        return <></>;
    }

    if (!menus) {
        return <></>;
    }

    const getContent = () => {
        if (menus.length === 0) {
            return (
                <div className="text-center">
                    <Nodata admin={true} type="Menu items"></Nodata>
                    <Button onClick={handleModalShow} variant="primary mt-3">
                        Add Menu
                    </Button>
                </div>
            );
        }
        return (
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
                                            <div className="text-muted mb-2">
                                                Note: Drag menu item to reorder
                                            </div>
                                            <div className="form-wrap">
                                                <SortableList
                                                    className="list"
                                                    draggedItemClassName="dragged"
                                                    onSortEnd={onSortEnd}
                                                >
                                                    {menus.map(result => (
                                                        <SortableItem
                                                            key={result.id}
                                                        >
                                                            <li className="list-group-item draggable">
                                                                <div className="row">
                                                                    <div className="col-12 col-md-5">
                                                                        <strong>
                                                                            Name:
                                                                        </strong>{' '}
                                                                        {
                                                                            result.name
                                                                        }
                                                                    </div>
                                                                    <div className="col-12 col-md-5">
                                                                        <strong className="me-2">
                                                                            Url:
                                                                        </strong>
                                                                        <a
                                                                            href={
                                                                                result.url
                                                                            }
                                                                            rel="noreferrer"
                                                                            target="_blank"
                                                                        >
                                                                            {
                                                                                result.url
                                                                            }
                                                                        </a>
                                                                    </div>
                                                                    <div className="col-12 col-md-2 text-end">
                                                                        <button
                                                                            className="btn btn-sm btn-danger"
                                                                            onClick={() =>
                                                                                deleteMenu(
                                                                                    result.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </SortableItem>
                                                    ))}
                                                </SortableList>
                                                <Button
                                                    onClick={handleModalShow}
                                                    variant="primary mt-3"
                                                >
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
        );
    };

    return (
        <div>
            <Head>
                <title>helpkb - Menus items</title>
                <meta content="" name="description"></meta>
                <link
                    href={process.env.NEXT_PUBLIC_BASE_URL + '/admin/menu'}
                    rel="canonical"
                />
            </Head>
            <Navbar admin={true} />
            <Toaster />
            <div id="layoutSidenav">
                <Sidebar />
                <div id="layoutSidenav_content">
                    <main>{getContent()}</main>
                    <Modal onHide={handleModalClose} show={showmodal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add menu</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="menuName"
                                >
                                    Menu Name
                                </label>
                                <input
                                    className="form-control"
                                    id="menuName"
                                    onChange={evt => {
                                        setNewMenu({
                                            ...newmenu,
                                            name: evt.target.value,
                                        });
                                    }}
                                    placeholder="Getting started"
                                    type="text"
                                    value={newmenu.name}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="menuUrl">
                                    Menu Url
                                </label>
                                <input
                                    className="form-control"
                                    id="menuUrl"
                                    onChange={evt => {
                                        setNewMenu({
                                            ...newmenu,
                                            url: evt.target.value,
                                        });
                                    }}
                                    placeholder="getting-started"
                                    type="text"
                                    value={newmenu.url}
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
                            <Button onClick={addMenu} variant="primary">
                                Add Menu
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Menu;
