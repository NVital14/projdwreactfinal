import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import '../App.css';
import { AppContext } from '../App';
import { addFavorite, deleteFavorite } from '../API/api';

const ReviewItem = ({ setIsOpen, review, updateReviews, setSelectedReviewId, source, setIsEditOpen, setReviewToEdit, setIsDeleteOpen }) => {
    const { context, setContext } = useContext(AppContext);
    //função para dar render das estrelas da review
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(<FontAwesomeIcon key={i} icon="star" style={{ color: 'gold' }} />);
        }
        for (let i = rating; i < 5; i++) {
            stars.push(<FontAwesomeIcon key={i + 5} icon="star" style={{ color: 'lightgrey' }} />);
        }
        return stars;
    };

    
    //SE A ESTRELA SÓ COM BORDA FOR PRESSIONADA, VAI ADICIONAR UM FAVORITO FAVORITO

     const handleNewFavorite = async() => {
        try {
            const r = await addFavorite(review.reviewId);
            if (r.ok) {
                updateReviews([1, 2]);
            }
            else {
            }
        } catch (error) {
            console.error('Erro ao obter guardar o comentário:', error);
        }
    }

    //SE A ESTRELA PREENCHIDA FOR PRESSIONADA, VAI ELIMINAR O FAVORITO
    const handleDeleteFavorite = async() => {
        try {
            const r = await deleteFavorite(review.reviewId);
            if (r.ok) {
                updateReviews([1, 2]);
            }
            else {
            }
        } catch (error) {
            console.error('Erro ao obter guardar o comentário:', error);
        }
    }

    return (

        <div className="col" style={{ marginTop: '20px' }}>
            <div className="col-sm">
                <div className="card border-light mb-3" style={{ maxWidth: '18rem', height: '440px' }} >
                    <div className="card-header"><b><center>{review.title}</center></b></div>
                    <div className="card-body" onClick={() => {
                        setIsOpen(true);
                        setSelectedReviewId(review.reviewId);
                    }}>
                        {review.image != null ?
                            <center>
                                <img src={"https://localhost:7218/api/Image/" + review.image} title={review.title} width="125px" max-height="100px" />
                            </center> : <div></div>
                        }
                        <h6 style={{ margin: '15px' }}>Avaliação: {renderStars(review.rating)}</h6>
                        <h6 style={{ margin: '15px' }}>Categoria: {review.category.name}</h6>
                        {source == "myReviewsPage" ? <h6 style={{ margin: '15px' }}>Partilhado: {review.isShared ? 'Sim' : 'Não'}</h6> : <h1></h1>}
                    </div>
                    <div className="card-footer bg-transparent border-success">
                        <center>
                            {source == "myReviewsPage" ?
                                <>
                                    <button onClick={() => { setIsEditOpen(true); setReviewToEdit(review); setIsOpen(false); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                        <FontAwesomeIcon icon={faEdit} style={{ color: 'steelblue', marginTop: '1px', marginRight: '10px' }} />
                                    </button>
                                    <button onClick={() => { setIsDeleteOpen(true); setReviewToEdit(review); setIsOpen(false); }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                        <FontAwesomeIcon icon={faTrash} style={{ color: 'red', marginTop: '1px', marginLeft: '10px' }} />
                                    </button></>
                                : <h6></h6>}
                            {/* se a source for home, se o utilizador estiver autenticado e a review for favorita, coloca uma estrela preenchida, senão não mete nada */}
                            {source == "homePage" && context.isAuthenticated && review?.isFavorite ?
                                <button onClick={() => handleDeleteFavorite()}
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                    <FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} /> </button> : <h6></h6>}
                            {/* se a source for home, se o utilizador estiver autenticado e a review não for favorita, coloca uma estrela só com bordas, senão não mete nada */}
                            {source == "homePage" && context.isAuthenticated && review?.isFavorite == false ?
                                <button onClick={() => handleNewFavorite()} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                    <FontAwesomeIcon icon={farStar} style={{ color: 'gold' }} />
                                </button> : <h6></h6>}
                        </center>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewItem;