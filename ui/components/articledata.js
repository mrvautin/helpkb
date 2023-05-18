import { React, useContext } from 'react';
import SettingsContext from '../contexts/settings';
import Link from 'next/link';
import { formatDate, capsFirst } from '../components/lib/data';

function Articledata(props) {
    const settings = useContext(SettingsContext);

    if(Object.keys(props.article).length === 0){
        return (
            <></>
        )
    }

    if(!settings.config){
        return (
            <></>
        )
    }

    if(settings.config.showArticleDetails === true){
        return (
            <div className="mt-5">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Article details:</h4>
                        <div className="row">
                            <div className="col-md-6 text-start text-lg-start">
                                <strong>Category: </strong>
                                <Link legacyBehavior href={"/category/" + props.article.category.toLowerCase()}>
                                    <a>{capsFirst(props.article.category)}</a>
                                </Link>
                            </div>
                            <div className="col-md-6 text-start text-lg-start">
                                <strong>Author:</strong> {props.article.authorName}
                            </div>
                            <div className="col-md-6 text-start text-lg-start">
                                <strong>Published:</strong> {formatDate(props.article.date, settings)}
                            </div>
                            <div className="col-md-6 text-start text-lg-start">
                                <strong>Author Email:</strong> {props.article.authorEmail}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }else{
        return (
            <></>
        )
    }
}

export default Articledata