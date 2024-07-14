import React, { useState, useEffect, useMemo, useContext } from 'react';
import { getCategories, getReviewsPaginated } from '../API/api';
import ReviewItem from '../components/ReviewItem';
import { ROUTES, AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import ReviewDetails from '../components/ReviewDetails';
import PaginationComponent from '../components/Pagination';
import CategoryItem from '../components/CategoryItem';
import CreateCategory from '../components/CreateCategory';
import DeleteCategory from '../components/DeleteCategory';

const CategoriesPage = () => {
    const navigate = useNavigate();
    const { context, setContext } = useContext(AppContext);
    const [r, setR] = useState([]);
    const [categories, setCategories] = useState([]);
    const [c, setC] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);



    const inic = async () => {
        try {
            //vai buscar as categorias
            const c = await getCategories();
            setCategories(c);
        } catch (error) {
            console.error('Erro ao obter as categorias:', error);
        }

    }


    useEffect(() => {

        if (context.isAdmin) {

            inic();
        }
        else {
            navigate(ROUTES.HOME);
        }
    }, [c]);


    return (
        <>

            <div>
                <div style={{ marginLeft: '15%', marginTop: '25px' }}>
                    <h2>Categorias</h2>
                    <button className="button-criar-review" style={{ marginTop: '20px' }} onClick={() => { setIsCreateOpen(true)}}>
                        Criar Nova Categoria
                    </button>
                </div>
                {categories.length > 0 ? (
                    <div className="container" style={{ marginTop: '50px' }}>
                        {categories.map((cat) => (
                            <CategoryItem key={cat.categoryId} category={cat} setSelectedCategory={setSelectedCategory} setIsEditOpen={setIsCreateOpen} setIsDeleteOpen={setIsDeleteOpen}></CategoryItem>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <p style={{ fontSize: '20px' }}>Nenhuma categoria disponível!</p>
                </div>)}

            </div>

            <CreateCategory isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} category={selectedCategory} setSelectedCategory={setSelectedCategory} setCategories={setC} ></CreateCategory>

            <DeleteCategory isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} category={selectedCategory} setCategories={setC}></DeleteCategory>
        </>
    );
};

export default CategoriesPage;
