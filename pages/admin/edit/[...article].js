import { React, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import matter from 'gray-matter';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { useResizeDetector } from 'react-resize-detector';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { api, apiReq, notification, clipboard } from '../../../components/lib/config';
import { checkUser } from '../../../components/lib/user'; 
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
    const [editorHeight, setEditorHeight] = useState(0);
    const [editorHover, setEditorHover] = useState('');
    const [showmodal, setShowmodal] = useState(false);

    // Detect resize of preview and adjust editor to match
    const onResize = useCallback((w, h) => {
        setEditorHeight(h);
    }, []);
    const { ref } = useResizeDetector({ onResize });

    // Parse markdown content
    const parseContent = (content) => {
        try{
            const parsedContent = matter(content);
            setArticleContentMarkdown(parsedContent.content);
        }catch(ex){};
    }

    useEffect(() => {    
        let routerPath = router.asPath;
        const fetchData = async () => {
            // Check for a user
            setUser(await checkUser());

            // Get article
            routerPath = routerPath.replace('/admin/edit/', '');
            const res = await apiReq().get(`${api()}/api/article/edit/${routerPath}`);
            const article = res.data;
            setArticle(article);
            setArticleContentRaw(article.content);

            // Parse matter and markdown
            parseContent(article.content);
        };
        if(routerPath !== '/admin/edit/[...article]'){
            fetchData();
        }
    },[router.asPath]);

    const handleModalClose = () => setShowmodal(false);
    const handleModalShow = () => setShowmodal(true);

    const handleEditorChange = (event) => {
        setArticleContentRaw(event.target.value);
        parseContent(event.target.value);
    };

    const handleKeyDown = (event) => {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if ((event.ctrlKey || event.metaKey) && charCode === 's') {
            event.preventDefault();
            saveArticle();
        }
    }

    const dropped = (e) => {
        e.preventDefault();
        if(e.dataTransfer.files.length !== 1){
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Only single files supported. Select a single file.'
            });
            return;
        }

        ([...e.dataTransfer.files]).forEach(fileUpload);
    }

    const dragover = () => {
        setEditorHover('editorHover');
    }

    const dragleave = () => {
        setEditorHover('');
    }

    const fileUpload = async(file) => {
        setEditorHover('');
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(`${api()}/api/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });

        // Take the response and form markdown into clipboard
        const filedata = await res.data;
        const mkdownUrl = `![alt text](${filedata.url})`;
        if(clipboard(mkdownUrl)){
            notification({
                title: 'Success',
                type: 'success',
                message: 'Image markdown copied to clipboard'
            });
        }else{
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Error copying markdown to clipboard'
            });
        }
    }

    const deleteArticle = async () => {
        // Check if user has permission
        if(user.admin !== true){
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Access denied. Only admins can delete articles'
            });
            return;
        }

        try {
            await apiReq().delete(`${api()}/api/article/delete/${article.id}`);

            setShowmodal(false);
            notification({
                title: 'Success',
                type: 'success',
                message: 'Article deleted'
            });
            window.location.href = '/admin/dashboard'
        }catch(ex){
            notification({
                title: 'Error',
                type: 'danger',
                message: 'Access denied.'
            });
        }
    };

    const saveArticle = async () => {
        // Call the API
        apiReq().put(`${api()}/api/article/save`, {
            content: articleContentRaw,
            id: article.id
        })
        .then((res) => {
            notification({
                title: 'Success',
                type: 'success',
                message: 'Article successfully saved'
            });
        })
        .catch(function (error) {
            if(error.response) {
                notification({
                    title: 'Error',
                    type: 'danger',
                    message: error.response.data.error || 'Error saving article'
                });
            }
        });
    };

    // Check for a user
    if(!user){
        return (
            <></>
        )
    }

    // Check for data
    if(!article){
        return (
            <></>
        )
    }

    // Check for error
    if(article && article.error){
        return (
            <ErrorPage />
        )
    }

    return (
        <div>
            <Head>
                <title>helpkb - Edit article</title>
                <meta name="description" content="helpkb - Edit article"></meta>
                <meta property="og:type" content="website" />
                <meta property="og:title" content="helpkb - Edit article" />
                <meta property="og:description" content="helpkb - Edit article" />
            </Head>
            <Toaster/>
            <Navbar admin={true} />
            <div id="layoutSidenav">
                <Sidebar />
                <div id="layoutSidenav_content">
                    <main>
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
                                                            <div className="btn-group col-12" role="group" aria-label="Basic example">
                                                                <button className="btn btn-danger" type="button" onClick={handleModalShow}>Delete Article</button>
                                                                <button className="btn btn-primary" type="button" onClick={saveArticle}>Save Article</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 ps-0 pe-0">
                                                            <div className="row editor-wrapper">
                                                                <div className="col-6">
                                                                    <textarea className={"form-control " + editorHover} style={{height: editorHeight}} onDrop={dropped} onDragOver={dragover} onDragLeave={dragleave} onKeyDown={handleKeyDown} value={articleContentRaw} onChange={handleEditorChange}></textarea>
                                                                </div>
                                                                <div ref={ref} className="col-6 content-raw">
                                                                    <Markdown>{articleContentMarkdown}</Markdown>
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
                            <Button variant="danger" onClick={deleteArticle}>
                                Delete article
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default Article
