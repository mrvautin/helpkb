import { React } from 'react';
import Link from 'next/link';

function Nodata(props) {    
    if(props.admin){
        return (
            <div className="col-xl-12 mt-3 text-start">
                <div className="row">
                    <div className="col-xl-12 p-0 text-start">
                        <div className="pb-3">
                            <div className="container-fluid py-2">
                                <div className="wrapper text-center mt-5">
                                    <h2>No {props.type}</h2>
                                    <h4 className="text-muted">
                                        Create some {props.type} now!
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="row">
            <div className="col-xl-12 p-0 text-start">
                <div className="ps-sm-5 pe-sm-5 pt-3 pb-3">
                    <div className="container-fluid py-2">
                        <div className="wrapper text-center mt-5">
                            <h2>No {props.type}</h2>
                            <h4 className="text-muted">
                                <Link href="/login">Login</Link> and create some {props.type}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Nodata