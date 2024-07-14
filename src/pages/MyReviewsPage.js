import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getUsers, getCategories, getReviewsPaginated } from '../API/api';
import CreateReview from '../components/CreateReview';
import ReviewItem from '../components/ReviewItem';
import { ROUTES, AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import ReviewDetails from '../components/ReviewDetails';
import PaginationComponent from '../components/Pagination';
import DeleteReview from '../components/DeleteReview';

const MyReviewsPage = () => {
    const navigate = useNavigate();
    const { context, setContext } = useContext(AppContext);
    const [isNewReviewOpen, setIsNewReviewOpen] = useState(false);
    const [isEditReviewOpen, setIsEditReviewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(-1);
    const [reviewToEdit, setReviewToEdit] = useState({});
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [nPages, setNPages] = useState(0);
    const [edited, setEdited] = useState([]);


    const inic = async () => {
        try {
            //vai buscar os users
            const u = await getUsers();
            setUsers(u);

            //vai buscar as categorias
            const c = await getCategories();
            setCategories(c);
            //vai buscar as reviews do utilizador paginadas
            const r = await getReviewsPaginated(currentPage, true);
            setMyReviews(r.reviews);
            setNPages(r.totalPages);


        } catch (error) {
            console.error('Erro ao obter reviews:', error);
        }

    }

    useEffect(() => {
        if (context.isAuthenticated) {

            inic();
        }
        else {
            navigate(ROUTES.HOME);
        }

    }, [currentPage, reviewToEdit]);

    const rows = useMemo(() => {
        const rows = [];
        if (myReviews.length > 0) {
            for (let i = 0; i < myReviews.length; i += 3) {
                rows.push(myReviews.slice(i, i + 3));
            }
        }
        return rows
    }, [myReviews, setEdited])

    return (
        <>

            <div>
                <div style={{ marginLeft: '15%', marginTop: '25px' }}>
                    <h2>Reviews</h2>
                    <button className="button-criar-review" style={{ marginTop: '20px' }} onClick={() => setIsNewReviewOpen(true)}>
                        Criar Nova Review
                    </button>
                </div>
                {myReviews.length > 0 ? (
                    <div className="container" style={{ marginTop: '50px' }}>
                        {rows.map((row, rowIndex) => (
                            <div className="row" key={rowIndex}>
                                {row.map((review) => (
                                    <ReviewItem key={review.reviewId} setIsOpen={setIsDetailsOpen} review={review} updateReviews={setSelectedReviewId} setSelectedReviewId={setSelectedReviewId} source="myReviewsPage" setIsEditOpen={setIsEditReviewOpen} setReviewToEdit={setReviewToEdit} setIsDeleteOpen={setIsDeleteOpen}/>

                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <p style={{ fontSize: '20px' }}>Ainda não criou nenhuma review. Comece a criar!</p>
                </div>)}
                <CreateReview isOpen={isNewReviewOpen} setIsOpen={setIsNewReviewOpen} categories={categories} users={users}
                    //estes dois parametros não vão ser usados no criar review, quando o objetivo é criar uma nova review
                    review={null} setReview={setReviewToEdit} setEdited={ setEdited} />
                <CreateReview isOpen={isEditReviewOpen} setIsOpen={setIsEditReviewOpen} categories={categories} users={users} review={reviewToEdit} setReview={setReviewToEdit} setEdited={ setEdited} />
                
                <DeleteReview isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} review={reviewToEdit} setReview={ setReviewToEdit}> </DeleteReview>

                <ReviewDetails isOpen={isDetailsOpen} setIsOpen={setIsDetailsOpen} revId={selectedReviewId}></ReviewDetails>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
                    <PaginationComponent currentPage={currentPage} nPages={nPages} setCurrentPage={setCurrentPage}></PaginationComponent>
                </div>
            </div>
        </>
    );
};

export default MyReviewsPage;
