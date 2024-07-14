import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const CategoryItem = ({ category, setSelectedCategory, setIsEditOpen, setIsDeleteOpen }) => {


    return (
        <div className="card shadow-sm rounded" style={{margin:'10px'}}>
            <div className="card-body d-flex align-items-center justify-content-between">
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <div className="mr-md-5">
                        <h4 className="mb-1">Id:</h4>
                        <h5 className="mb-0">{category.categoryId}</h5>
                    </div>
                    <div>
                        <h4 className="mb-1">Nome:</h4>
                        <h5 className="mb-0">{category.name}</h5>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <button onClick={() => { setSelectedCategory(category); setIsEditOpen(true); }} className="btn btn-link p-0">
                        <FontAwesomeIcon icon={faEdit} style={{ color: 'steelblue', marginRight: '10px', fontSize: '1.5em'}} />
                    </button>
                    <button onClick={() => { setSelectedCategory(category); setIsDeleteOpen(true); }} className="btn btn-link p-0">
                        <FontAwesomeIcon icon={faTrash} style={{ color: 'red', marginLeft: '10px', marginRight:'10px', fontSize: '1.5em'}} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CategoryItem;

