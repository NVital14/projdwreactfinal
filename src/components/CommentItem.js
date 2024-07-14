import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const CommentItem = ({comment, userName}) => {


    return (
        <div className="card mb-4" style={{margin:'15px'}}>
            <div className="card-body">
                <p>{comment}</p>
                <div className="d-flex justify-content-between">
                    <div className="d-flex flex-row align-items-center">
                        <p className="small mb-0 ms-2">{userName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentItem;

