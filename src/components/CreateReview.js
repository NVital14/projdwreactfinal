import React, { useState, useEffect, useContext } from 'react';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Select from 'react-select';

import { ROUTES, AppContext } from '../App';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { saveReview, editReview } from '../API/api';

const CreateReview = ({ isOpen, setIsOpen, categories, users, review, setReview }) => {

    const { context, setContext } = useContext(AppContext);
    const [rating, setRating] = useState(0);
    const [previewImage, setPreviewImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        image: null,
        rating: 0,
        category: -1,
        description: '',
        isShared: false,
        userIdsList: []
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setPreviewImage(URL.createObjectURL(file));
        setFormData({ ...formData, image: file });
    };

    const handleSelectChange = (selectedOptions) => {
        setFormData({
            ...formData,
            userIdsList: selectedOptions ? selectedOptions.map(option => option.value) : []
        });

    };

    const handleSubmitSave = async (event) => {
        event.preventDefault();
        const { title, image, rating, category, description, isShared, userIdsList } = formData;

        if (title == '' || rating == 0 || category == -1 || description == '') {
            setErrorMessage('O título, a avaliação, a categoria e a descrição são de preenchimento obrigatório!');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', title);
        formDataToSend.append('rating', rating);
        formDataToSend.append('categoryFK', category);
        formDataToSend.append('description', description);
        formDataToSend.append('isShared', isShared);
        userIdsList.forEach(id => formDataToSend.append('userIdsList', id));
        if (formData.image) {
            formDataToSend.append('imageReview', formData.image);
        }

        try {
            const r = await saveReview(formDataToSend);
            //tenho que mudar o estado da review, para a página das reviews voltar a ir buscá-las
            setReview({
                title: formData.title,
                image: formData.image,
                rating: formData.rating,
                category: formData.category,
                description: formData.description,
                isShared: formData.isShared,
            });
            setErrorMessage('');
            setFormData({
                title: '',
                image: null,
                rating: 0,
                category: -1,
                description: '',
                isShared: false,
                userIdsList: []
            });
            setIsOpen(false);
            setPreviewImage(null);
            setRating(0);
            return;


        } catch (error) {
            setErrorMessage("Não foi possível guardar a review, houve um erro! Erro:", error);
        }

    };

    const handleSubmitEdit = async (event) => {
        event.preventDefault();
        const { title, image, rating, category, description, isShared, userIdsList } = formData;

        if (title == '' || rating == 0 || category == -1 || description == '') {
            setErrorMessage('O título, a avaliação, a categoria e a descrição são de preenchimento obrigatório!');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', title);
        formDataToSend.append('rating', rating);
        formDataToSend.append('categoryFK', category);
        formDataToSend.append('description', description);
        formDataToSend.append('isShared', isShared);
        userIdsList.forEach(id => formDataToSend.append('userIdsList', id));
        if (formData.image != review.image) {
            formDataToSend.append('imageReview', formData.image);
        }

        try {
            const r = await editReview(review.reviewId, formDataToSend);

            setIsOpen(false);
            //tenho que mudar o estado da review, para a página das reviews voltar a ir buscá-las
            setReview({
                title: formData.title,
                image: formData.image,
                rating: formData.rating,
                category: formData.category,
                description: formData.description,
                isShared: formData.isShared,
            });
            setFormData({
                title: '',
                image: null,
                rating: 0,
                category: -1,
                description: '',
                isShared: false,
                userIdsList: []
            });
            setErrorMessage('');
            setPreviewImage(null);
            setRating(0);
            return;


        } catch (error) {
            setErrorMessage("Não foi possível guardar a review, houve um erro! Erro:", error);
        }

    };

    useEffect(() => {
        if (review) {
            setRating(review.rating);
            console.log("entrei, esta é a review:", review);
            let idsList = [];
            //vai buscar os colaboradores, ou seja, verifica quais users são colaboradores e coloca os seus ids num array
            //isto serve para na edição aparecer utilizadores no select já selecionados
            if (review.users && Array.isArray(review.users)) {
                review.users.forEach(el => {
                    if (context.user.id != el.id) {

                        idsList.push(el.id);
                    }
                });
            }
            if (review.image) {
                setPreviewImage("https://localhost:7218/api/Image/" + review.image);
            }
            setFormData({
                title: review.title,
                image: review.image,
                rating: review.rating,
                category: review.categoryFK,
                description: review.description,
                isShared: review.isShared,
                userIdsList: idsList
            });
            
            if (review.imageUrl) {
                setPreviewImage(review.imageUrl);
            }
        }
        
    }, [isOpen]);

    return (
        <>
            <Modal show={isOpen} onHide={() => {
                setIsOpen(false); setFormData({
                    title: '',
                    image: null,
                    rating: 0,
                    category: -1,
                    description: '',
                    isShared: false,
                    userIdsList: []
                });
                setErrorMessage('');
                setRating(0);
                setPreviewImage(null);
            }} size='lg' >
                <Modal.Header >
                    <Modal.Title>{review == null ? <h1>Criar nova review</h1> : <h1>Editar Review</h1>}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: '70vh', overflowY: 'auto' }}>
                    <Form action="Create" method="post" encType="multipart/form-data">
                        <span style={{ color: 'red' }}>{errorMessage}</span>
                        <Form.Group className='form-group'>
                            <Form.Label>Título</Form.Label>
                            <Form.Control type="text" name="title" value={formData.title} onChange={(e) => { setFormData({ ...formData, title: e.target.value }); setErrorMessage(''); }} />
                        </Form.Group>
                        <Form.Group className='form-group'>
                            <Form.Label>Imagem</Form.Label>
                            <Form.Control type="file" name="imageReview" accept=".png,.jpg,.jpeg" onChange={handleImageChange} />
                            {previewImage && <img src={previewImage} style={{ display: 'block', maxWidth: '30%', maxHeight: '300px', marginTop: '10px' }} alt="Preview" />}
                        </Form.Group>
                        <Form.Group className='form-group'>
                            <Typography component="legend">Avaliação</Typography>
                            <Rating
                                name="size-large"
                                value={rating}
                                size="large"
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                    setFormData({ ...formData, rating: newValue });
                                }}
                            />
                        </Form.Group>
                        <Form.Group className='form-group'>
                            <Form.Label>Categoria</Form.Label>
                            <Form.Control as="select" name="categoryFK" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                <option value="-1"> -- Escolha uma categoria --</option>
                                {categories.map((category) => (
                                    <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className='form-group'>
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control as="textarea" name="description" value={formData.description} onChange={(e) => { setFormData({ ...formData, description: e.target.value }); setErrorMessage(''); }} rows="8" />
                        </Form.Group>
                        <Form.Group className='form-group'>
                            <Form.Check type="checkbox" name="isShared" label="Partilhar Review" checked={formData.isShared} onChange={(e) => setFormData({ ...formData, isShared: e.target.checked })} />
                        </Form.Group>
                        <Form.Group className='form-group'>
                            <Form.Label>Colaboradores</Form.Label>
                            <Select
                                isMulti
                                name="userIdsList"
                                options={users.map(user => ({ value: user.id, label: user.userName }))}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={handleSelectChange}
                                placeholder="Selecione os utilizadores..."
                                noOptionsMessage={() => "Nenhum utilizador encontrado"}
                                value={users.filter(user => formData.userIdsList.includes(user.id))
                                    .map(user => ({ value: user.id, label: user.userName }))}
                            />
                            {/* <Select
                                isMulti
                                name="userIdsList"
                                options={users.map(user => ({ value: user.id, label: user.userName }))}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={handleSelectChange}
                                placeholder="Selecione os utilizadores..."
                                noOptionsMessage={() => "Nenhum utilizador encontrado"}
                                value={review && review.users ? review.users
                                    .filter(user => formData.userIdsList.includes(user.id))
                                    .map(user => ({ value: user.id, label: user.userName })) : []}
                            /> */}
                            {/* <Form.Control as="select" name="userIdsList" multiple>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>{user.userName}</option>
                                ))}
                            </Form.Control> */}
                        </Form.Group>
                        {/* <Button variant="primary" type="submit">Guardar</Button> */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {review ? <Button className='primaryBtn' onClick={handleSubmitEdit}>Guardar alterações</Button> : <Button className='primaryBtn' onClick={handleSubmitSave}>Guardar</Button>}
                    <Button variant="secondary" onClick={() => {
                        setIsOpen(false); setFormData({
                            title: '',
                            image: null,
                            rating: 0,
                            category: -1,
                            description: '',
                            isShared: false,
                            userIdsList: []
                        });
                        setErrorMessage('');
                        setRating(0);
                        setPreviewImage(null);
                    }}>Voltar à lista</Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default CreateReview;
