import React, { useState, useEffect, useMemo, useContext } from 'react';
import { getFavorites, getFavoriteReviewsPaginated } from '../API/api';
import ReviewItem from '../components/ReviewItem';
import { ROUTES, AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import ReviewDetails from '../components/ReviewDetails';
import PaginationComponent from '../components/Pagination';

const FavoritesPage = () => {

    const [r, setR] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [nPages, setNPages] = useState(0);


    const inic = async () => {
        try {
            const r = await getFavoriteReviewsPaginated(currentPage);
            const revs = r.reviews.map((review) => {
                return {
                    ...review,
                    isFavorite: true
                };
            });
            setReviews(revs);
            setNPages(r.totalPages);
        } catch (error) {
            console.error('Erro ao obter reviews:', error);
        }

    }

    useEffect(() => {

        inic();
    }, [currentPage, r]);


    const rows = useMemo(() => {
        const rows = [];
        if (reviews.length > 0) {
            for (let i = 0; i < reviews.length; i += 3) {
                rows.push(reviews.slice(i, i + 3));
            }
        }
        return rows
    }, [reviews])

    return (
        <>

            <div>
                <div style={{ marginLeft: '15%', marginTop: '25px' }}>
                    <h2>Favoritos</h2>
                </div>
                {reviews.length > 0 ? (
                    <div className="container" style={{ marginTop: '50px' }}>
                        {rows.map((row, rowIndex) => (
                            <div className="row" key={rowIndex}>
                                {row.map((review) => (
                                    < ReviewItem key={review.reviewId} setIsOpen={setIsOpen} review={review}
                                        // este parametro serve para no review item, mudar o estado, para que ele volte a fazer o useEffect
                                        updateReviews={setR}
                                        setSelectedReviewId={setSelectedReviewId} source="homePage"
                                        //vindo daqui o setIsEditOpen e o setReviewToEdit não vai servir para nada
                                        setIsEditOpen={setIsOpen}
                                        setReviewToEdit={setIsOpen}
                                    />

                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <p style={{ fontSize: '20px' }}>Ainda não adiconou favoritos. Comece a adicionar!</p>
                    </div>)}


                <ReviewDetails isOpen={isOpen} setIsOpen={setIsOpen} revId={selectedReviewId}></ReviewDetails>


                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
                    <PaginationComponent currentPage={currentPage} nPages={nPages} setCurrentPage={setCurrentPage}></PaginationComponent>
                </div>
            </div>
        </>
    );
};

export default FavoritesPage;
