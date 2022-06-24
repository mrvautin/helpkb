import { React } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const spinnerStyle = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

function Spinner(props) {
    if(!props.loading || props.loading === true){
        return (
            <div className="container px-4">
                <div className="row">
                    <div className="col-xl-12 p-0 text-center" style={spinnerStyle}>
                        <ClipLoader className="align-middle" color="#000000" loading={true} size={150} />
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

export default Spinner