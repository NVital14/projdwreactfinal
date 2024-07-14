import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';  // Importação do react-bootstrap
import { deleteCategory } from '../API/api';

const DeleteCategory = ({ isOpen, setIsOpen, category, setCategories }) => {
    const [errorMensage, setErrorMensage] = useState('');


    const handleConfirmDelete = async () => {
        try {
            const r = await deleteCategory(category.categoryId);
            if (!r.ok) {
                setErrorMensage("Houve um erro ao tentar eliminar a review. Tente novamente.");
                return;
            }
            setErrorMensage('');
            setIsOpen(false);
            //mudar o state de uma variável, que é o setC, para voltar a fazer o useEffect
            setCategories([1,2]);

        } catch (error) {
            console.error('Erro ao eliminar a review:', error);
        }
    };


    return (
        <div>
            {/* Modal de confirmação */}
            <Modal show={isOpen} onHide={() => { setIsOpen(false); setErrorMensage(''); }}>
                <Modal.Header>
                    <Modal.Title>Eliminar categoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span style={{ color: 'red' }}>{errorMensage}</span>
                    Tem certeza que deseja eliminar a categoria <strong>{category?.name}</strong> ?     
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setIsOpen(false); setErrorMensage(''); }}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={()=>handleConfirmDelete()}>
                        Sim
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DeleteCategory;
