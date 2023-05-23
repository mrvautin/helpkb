import { useEffect, useState } from 'react';
import Head from 'next/head';
import matter from 'gray-matter';
import dedent from 'dedent';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Toaster } from 'react-hot-toast';
import { useResizeDetector } from 'react-resize-detector';
import { apiReq, notification } from '../../components/lib/config';
import { checkUser } from '../../components/lib/user';
import Spinner from '../../components/spinner';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import Markdown from '../../components/markdown';

function New() {
    const [user, setUser] = useState();
    const [articleContentRaw, setArticleContentRaw] = useState('');
    const [articleContentMarkdown, setArticleContentMarkdown] = useState('');
    const [editorHeight, setEditorHeight] = useState(100);
    const [editorHover, setEditorHover] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const [showClipboardModal, setShowClipboardModal] = useState(false);

    // Detect resize of preview and adjust editor to match
    const { ref } = useResizeDetector({
        onResize: (w, h) => {
            // on resize logic
            setEditorHeight(h);
        },
    });

    // Parse markdown content
    const parseContent = content => {
        try {
            const parsedContent = matter(content);
            setArticleContentMarkdown(parsedContent.content);
        } catch (ex) {
            console.log('Error parsing Markdown content', ex);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            // Check for a user
            const user = await checkUser();
            setUser(user);

            // Set our default article
            const defaultArticle = dedent(`
            ---
            title: Hello world
            seoTitle: hello world - An optional SEO title different to the article
            url: hello-world
            description: Hello world SEO description
            published: true
            category: General
            pinned: false
            date: ${new Date().toISOString()}
            authorName: ${user.name}
            authorEmail: ${user.email}
            ---
                
            # Hello world
            `);

            setArticleContentRaw(defaultArticle);
            parseContent(defaultArticle);
        };
        fetchData();
    }, []);

    const handleEditorChange = event => {
        setArticleContentRaw(event.target.value);
        parseContent(event.target.value);
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

    const handleClipboardModalClose = () => setShowClipboardModal(false);

    const onCopyToClipboard = () => {
        notification({
            title: 'Success',
            type: 'success',
            message: 'Image markdown copied to clipboard',
        });
        setShowClipboardModal(false);
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

            // Stop spinner
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

    const insertArticle = async () => {
        // Call the API
        apiReq()
            .put('/api/article/insert', {
                content: articleContentRaw,
            })
            .then(res => {
                notification({
                    title: 'Success',
                    type: 'success',
                    message: 'Article successfully saved',
                });
                window.location.href = `/admin/edit/${res.data.articleId}`;
            })
            .catch(function (error) {
                if (error.response) {
                    notification({
                        title: 'Error',
                        type: 'danger',
                        message: error.response.data.error,
                    });
                }
            });
    };

    // Check for a user
    if (!user) {
        return <></>;
    }

    return (
        <div>
            <Head>
                <title>helpkb - Create article</title>
                <meta
                    content="helpkb - Create article"
                    name="description"
                ></meta>
                <meta content="website" property="og:type" />
                <meta content="helpkb - Create article" property="og:title" />
                <meta
                    content="helpkb - Create article"
                    property="og:description"
                />
            </Head>
            <Navbar admin={true} />
            <Toaster />
            <div id="layoutSidenav">
                <Sidebar />
                <div id="layoutSidenav_content">
                    <main>
                        <Spinner loading={uploading} />
                        <div className="container-fluid px-4">
                            <div className="row">
                                <div className="col-xl-12 mt-3 text-start">
                                    <div className="heading-wrap ps-2">
                                        <h1>Create article</h1>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-12 p-0 text-start">
                                            <div className="pb-3">
                                                <div className="container-fluid py-2">
                                                    <div className="row">
                                                        <div className="col-12 pe-0 text-end">
                                                            <button
                                                                className="btn btn-primary mb-2"
                                                                onClick={
                                                                    insertArticle
                                                                }
                                                                type="button"
                                                            >
                                                                Create article
                                                            </button>
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

export default New;
