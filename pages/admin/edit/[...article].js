import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import matter from 'gray-matter';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { useResizeDetector } from 'react-resize-detector';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { apiReq, notification } from '../../../components/lib/config';
import { checkUser } from '../../../components/lib/user';
import Spinner from '../../../components/spinner';
import ErrorPage from '../../../components/404';
import Navbar from '../../../components/navbar';
import Sidebar from '../../../components/sidebar';
import Markdown from '../../../components/markdown';

function Article() {
    const router = useRouter();
    const [user, setUser] = useState();
    const [article, setArticle] = useState({});
    const [articleContentRaw, setArticleContentRaw] = useState('');
    const [articleContentMarkdown, setArticleContentMarkdown] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [editorHeight, setEditorHeight] = useState(0);
    const [editorHover, setEditorHover] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showClipboardModal, setShowClipboardModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Detect resize of preview and adjust editor to match
    const onResize = useCallback((w, h) => {
        setEditorHeight(h);
    }, []);
    const { ref } = useResizeDetector({ onResize });

    // Parse markdown content
    const parseContent = content => {
        try {
            const parsedContent = matter(content);
            setArticleContentMarkdown(parsedContent.content);
        } catch (ex) {
            console.log('Cannot parse content', ex);
        }
    };

    useEffect(() => {
        let routerPath = router.asPath;
        const fetchData = async () => {
            // Check for a user
            setUser(await checkUser());

            // Get article
            routerPath = routerPath.replace('/admin/edit/', '');
            const res = await apiReq().get(`/api/article/edit/${routerPath}`);
            const article = res.data;
            setArticle(article);
            setArticleContentRaw(article.content);

            // Parse matter and markdown
            parseContent(article.content);
        };
        if (routerPath !== '/admin/edit/[...article]') {
            fetchData();
        }
    }, [router.asPath]);

    const handleDeleteModalClose = () => setShowDeleteModal(false);
    const handleClipboardModalClose = () => setShowClipboardModal(false);
    const handleDeleteModalShow = () => setShowDeleteModal(true);

    const onCopyToClipboard = () => {
        notification({
            title: 'Success',
            type: 'success',
            message: 'Image markdown copied to clipboard',
        });
        setShowClipboardModal(false);
    };

    const handleEditorChange = event => {
        setArticleContentRaw(event.target.value);
        parseContent(event.target.value);
    };

    const handleKeyDown = event => {
        const charCode = String.fromCharCode(event.which).toLowerCase();
        if ((event.ctrlKey || event.metaKey) && charCode === 's') {
            event.preventDefault();
            saveArticle();
        }
    };

    const dropped = e => {
        e.preventDefault();
        if (e.dataTransfer.files.length !== 1) {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Only single files supported. Select a single file.',
            });
            return;
        }

        setUploading(true);
        [...e.dataTransfer.files].forEach(fileUpload);
    };

    const dragover = () => {
        setEditorHover('editorHover');
    };

    const dragleave = () => {
        setEditorHover('');
    };

    const onPaste = async e => {
        const clipboardItems = e.clipboardData.items;
        const items = [].slice.call(clipboardItems).filter(function (item) {
            // Filter the image items only
            return /^image\//.test(item.type);
        });
        // If we have an image, we try upload it
        if (items.length > 0) {
            setUploading(true);
            const file = items[0].getAsFile();
            await fileUpload(file);
            return;
        }
    };

    const fileUpload = async file => {
        setEditorHover('');
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await axios.post('/api/admin/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Stop the spinner
            setUploading(false);

            // Check for error
            if (res.data.error) {
                notification({
                    title: 'Error',
                    type: 'danger',
                    message: res.data.error,
                });
                return;
            }

            // Take the response and form markdown into clipboard
            const filedata = await res.data;
            const mkdownUrl = `![alt text](${filedata.url})`;
            setImageUrl(mkdownUrl);
            setShowClipboardModal(true);
        } catch (error) {
            // Stop the spinner
            setUploading(false);

            // Show the error
            if (error.response && error.response.data) {
                notification({
                    title: 'Error',
                    type: 'danger',
                    message: error.response.data.message,
                });
                return;
            }
            return notification({
                title: 'Error',
                type: 'danger',
                message: 'Unable to upload file',
            });
        }
    };

    const deleteArticle = async () => {
        // Check if user has permission
        if (user.admin !== true) {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Access denied. Only admins can delete articles',
            });
            return;
        }

        try {
            await apiReq().delete(`/api/article/delete/${article.id}`);

            setShowDeleteModal(false);
            notification({
                title: 'Success',
                type: 'success',
                message: 'Article deleted',
            });
            window.location.href = '/admin/dashboard';
        } catch (ex) {
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Access denied.',
            });
        }
    };

    const saveArticle = async () => {
        // Call the API
        apiReq()
            .put('/api/article/save', {
                content: articleContentRaw,
                id: article.id,
            })
            .then(() => {
                notification({
                    title: 'Success',
                    type: 'success',
                    message: 'Article successfully saved',
                });
            })
            .catch(function (error) {
                if (error.response) {
                    notification({
                        title: 'Error',
                        type: 'danger',
                        message:
                            error.response.data.error || 'Error saving article',
                    });
                }
            });
    };

    // Check for a user
    if (!user) {
        return <></>;
    }

    // Check for data
    if (!article) {
        return <></>;
    }

    // Check for error
    if (article && article.error) {
        return <ErrorPage />;
    }

    return (
        <div>
            <Head>
                <title>helpkb - Edit article</title>
                <meta content="helpkb - Edit article" name="description"></meta>
                <meta content="website" property="og:type" />
                <meta content="helpkb - Edit article" property="og:title" />
                <meta
                    content="helpkb - Edit article"
                    property="og:description"
                />
            </Head>
            <Toaster />
            <Navbar admin={true} />
            <div id="layoutSidenav">
                <Sidebar />
                <div id="layoutSidenav_content">
                    <main>
                        <Spinner loading={uploading} />
                        <div className="container-fluid px-4">
                            <div className="row">
                                <div className="col-xl-12 mt-3 text-start">
                                    <div className="heading-wrap ms-2">
                                        <h1>Edit article</h1>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-12 p-0 text-start">
                                            <div className="pb-3">
                                                <div className="container-fluid py-2">
                                                    <div className="row">
                                                        <div className="col-12 col-md-4 offset-md-8 text-end mb-2 pe-0">
                                                            <div
                                                                aria-label="Basic example"
                                                                className="btn-group col-12"
                                                                role="group"
                                                            >
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={
                                                                        handleDeleteModalShow
                                                                    }
                                                                    type="button"
                                                                >
                                                                    Delete
                                                                    Article
                                                                </button>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={
                                                                        saveArticle
                                                                    }
                                                                    type="button"
                                                                >
                                                                    Save Article
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 ps-0 pe-0">
                                                            <div className="row editor-wrapper">
                                                                <div className="col-6">
                                                                    <textarea
                                                                        className={
                                                                            'form-control ' +
                                                                            editorHover
                                                                        }
                                                                        onChange={
                                                                            handleEditorChange
                                                                        }
                                                                        onDragLeave={
                                                                            dragleave
                                                                        }
                                                                        onDragOver={
                                                                            dragover
                                                                        }
                                                                        onDrop={
                                                                            dropped
                                                                        }
                                                                        onKeyDown={
                                                                            handleKeyDown
                                                                        }
                                                                        onPaste={
                                                                            onPaste
                                                                        }
                                                                        style={{
                                                                            height: editorHeight,
                                                                        }}
                                                                        value={
                                                                            articleContentRaw
                                                                        }
                                                                    ></textarea>
                                                                </div>
                                                                <div
                                                                    className="col-6 content-raw"
                                                                    ref={ref}
                                                                >
                                                                    <Markdown>
                                                                        {
                                                                            articleContentMarkdown
                                                                        }
                                                                    </Markdown>
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
                    <Modal
                        onHide={handleDeleteModalClose}
                        show={showDeleteModal}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button
                                onClick={handleDeleteModalClose}
                                variant="secondary"
                            >
                                Close
                            </Button>
                            <Button onClick={deleteArticle} variant="danger">
                                Delete article
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal
                        onHide={handleClipboardModalClose}
                        show={showClipboardModal}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Image uploaded</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <span>{imageUrl}</span>
                            <CopyToClipboard
                                onCopy={onCopyToClipboard}
                                text={imageUrl}
                            >
                                <Button variant="success">
                                    Copy to clipboard
                                </Button>
                            </CopyToClipboard>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Article;
