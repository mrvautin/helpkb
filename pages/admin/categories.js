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

function Categories() {
    const [user, setUser] = useState();
    const [categories, setCategories] = useState();
    const [newcategory, setNewCategory] = useState({
        name: '',
        url: '',
    });
    const [showmodal, setShowmodal] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            // Check for a user
            setUser(await checkUser());

            // Get categories
            getCategories();
        };
        fetchData();
    }, []);

    const handleModalClose = () => setShowmodal(false);
    const handleModalShow = () => setShowmodal(true);

    const getCategories = async () => {
        // Get categories
        const res = await apiReq().get('/api/categories');
        const categories = res.data;
        if (categories) {
            setCategories(categories);
        }
    };

    const addCategory = async () => {
        // Validate inputs
        if (newcategory.name === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set the category name',
            });
            return;
        }
        if (newcategory.url === '') {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Please set the category Url',
            });
            return;
        }

        try {
            await apiReq().put('/api/category/insert', {
                name: newcategory.name,
                url: newcategory.url,
            });

            setShowmodal(false);
            getCategories();

            // Clear inputs
            setNewCategory({
                name: '',
                url: '',
            });

            notification({
                title: 'Success',
                type: 'success',
                message: 'New category created',
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

    const deleteCategory = async id => {
        try {
            await apiReq().delete(`/api/category/delete/${id}`);
            getCategories();
            notification({
                title: 'Success',
                type: 'success',
                message: 'Category deleted',
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
        setCategories(array => {
            newOrder = arrayMoveImmutable(array, oldIndex, newIndex);
            return newOrder;
        });
        await apiReq().put('/api/category/sort', newOrder);
        notification({
            title: 'Success',
            type: 'success',
            message: 'Categories sorted',
        });
    };

    // Check for a user
    if (!user) {
        return <></>;
    }

    if (!categories) {
        return <></>;
    }

    const getContent = () => {
        if (categories.length === 0) {
            return (
                <div className="text-center">
                    <Nodata admin={true} type="Categories"></Nodata>
                    <Button onClick={handleModalShow} variant="primary mt-3">
                        Add category
                    </Button>
                </div>
            );
        }
        return (
            <div className="container-fluid px-4">
                <div className="row">
                    <div className="col-xl-12 mt-3 text-start">
                        <div className="heading-wrap ps-2">
                            <h1>Categories</h1>
                        </div>
                        <div className="row">
                            <div className="col-xl-12 p-0 text-start">
                                <div className="pb-3">
                                    <div className="container-fluid py-2">
                                        <div className="wrapper">
                                            <div className="text-muted mb-2">
                                                Note: Drag category to reorder
                                            </div>
                                            <div className="form-wrap">
                                                <SortableList
                                                    className="list"
                                                    draggedItemClassName="dragged"
                                                    onSortEnd={onSortEnd}
                                                >
                                                    {categories.map(result => (
                                                        <SortableItem
                                                            key={result.id}
                                                        >
                                                            <li className="list-group-item draggable">
                                                                <div className="row">
                                                                    <div className="col-12 col-md-4">
                                                                        <strong>
                                                                            Name:
                                                                        </strong>{' '}
                                                                        {
                                                                            result.name
                                                                        }
                                                                    </div>
                                                                    <div className="col-12 col-md-2">
                                                                        <strong className="me-2">
                                                                            Articles
                                                                            #:
                                                                        </strong>
                                                                        {
                                                                            result.count
                                                                        }
                                                                    </div>
                                                                    <div className="col-12 col-md-4">
                                                                        <strong className="me-2">
                                                                            Url:
                                                                        </strong>
                                                                        <a
                                                                            href={
                                                                                '/category/' +
                                                                                result.url
                                                                            }
                                                                            rel="noreferrer"
                                                                            target="_blank"
                                                                        >
                                                                            /category/
                                                                            {
                                                                                result.url
                                                                            }
                                                                        </a>
                                                                    </div>
                                                                    <div className="col-12 col-md-2 text-end">
                                                                        <button
                                                                            className="btn btn-sm btn-danger"
                                                                            onClick={() =>
                                                                                deleteCategory(
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
                                                    Add category
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
                <title>helpkb - Categories</title>
                <meta content="" name="description"></meta>
                <link
                    href={
                        process.env.NEXT_PUBLIC_BASE_URL + '/admin/categories'
                    }
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
                            <Modal.Title>Add category</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="categoryName"
                                >
                                    Category Name
                                </label>
                                <input
                                    className="form-control"
                                    id="categoryName"
                                    onChange={evt => {
                                        setNewCategory({
                                            ...newcategory,
                                            name: evt.target.value,
                                        });
                                    }}
                                    placeholder="Getting started"
                                    type="email"
                                    value={newcategory.name}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="categoryUrl"
                                >
                                    Category Url
                                </label>
                                <input
                                    className="form-control"
                                    id="categoryUrl"
                                    onChange={evt => {
                                        setNewCategory({
                                            ...newcategory,
                                            url: evt.target.value,
                                        });
                                    }}
                                    placeholder="getting-started"
                                    type="text"
                                    value={newcategory.url}
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
                            <Button onClick={addCategory} variant="primary">
                                Add Category
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Categories;
