import React, { useState, useEffect, useContext } from 'react';
import { ROUTES, AppContext } from '../App';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { saveCategory, editCategory } from '../API/api';

const CreateCategory = ({ isOpen, setIsOpen, category, setSelectedCategory, setCategories, setEdited }) => {

    const { context, setContext } = useContext(AppContext);

    const [errorMessage, setErrorMessage] = useState('');
    const [categoryName, setCategoryName] = useState('');



    const handleSubmitSave = async (event) => {
        event.preventDefault();

        if (categoryName == '') {
            setErrorMessage('O nome da categoria é de preenchimento obrigatório!');
            return;
        }

        try {
            const r = await saveCategory(categoryName);
            if (!r.ok) {
                setErrorMessage('Não foi possível guardar a categoria!');
                return;
            }
            setIsOpen(false);
            //tenho que mudar o estado da categoria, para a página das categorias voltar a ir buscá-las
            setCategories([1,2]);
            setCategoryName('');
            setErrorMessage('');
            return;

        } catch (error) {
            setErrorMessage("Não foi possível guardar a categoria, houve um erro! Erro:", error);
        }

    };

    const handleSubmitEdit = async (event) => {
        event.preventDefault();

        if (categoryName == '') {
            setErrorMessage('O nome da categoria é de preenchimento obrigatório!');
            return;
        }

        try {
            const r = await editCategory(category.categoryId, categoryName);
            if (!r.ok) {
                setErrorMessage('Não foi possível editar a categoria!');
                return;
            }
            setIsOpen(false);
            //tenho que mudar o estado da categoria, para a página das categorias voltar a ir buscá-las
            setCategories([1,2]);
            setCategoryName('');
            setSelectedCategory(null);
            setErrorMessage('');
            setEdited([1, 2]);
            return;

        } catch (error) {
            setErrorMessage("Não foi possível guardar a categoria, houve um erro! Erro:", error);
        }


    };

    useEffect(() => {
        if (category) {
            setCategoryName(category.name);
        } 

    }, [isOpen]);

    return (
        <>
            <Modal show={isOpen} onHide={() => {
                setIsOpen(false); setCategoryName('');
                setSelectedCategory(null);
                setErrorMessage('');
            }} size='lg' >
                <Modal.Header >
                    <Modal.Title>{category == null ? <h1>Criar nova Categoria</h1> : <h1>Editar Categoria</h1>}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: '20vh', overflowY: 'auto' }}>
                    <Form action="Create" method="post" encType="multipart/form-data">
                        <span style={{ color: 'red' }}>{errorMessage}</span>
                        <Form.Group className='form-group'>
                            <Form.Label>Nome da categoria:</Form.Label>
                            <Form.Control type="text" name="title" value={categoryName} onChange={(e) => { setCategoryName(e.target.value); setErrorMessage(''); }} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {category ? <Button className='primaryBtn' onClick={handleSubmitEdit}>Guardar alterações</Button> : <Button className='primaryBtn' onClick={handleSubmitSave}>Guardar</Button>}
                    <Button variant="secondary" onClick={() => {
                        setIsOpen(false); setCategoryName(''); setSelectedCategory(null);
                        setErrorMessage('');
                    }}>Voltar à lista</Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default CreateCategory;
