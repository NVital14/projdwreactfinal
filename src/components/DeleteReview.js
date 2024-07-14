import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';  // Importação do react-bootstrap
import { deleteReview } from '../API/api';

const DeleteReview = ({ isOpen, setIsOpen, review, setReview }) => {
    const [errorMensage, setErrorMensage] = useState('');


    const handleConfirmDelete = async () => {
        try {
            const r = await deleteReview(review.reviewId);
            if (!r) {
                setErrorMensage("Houve um erro ao tentar eliminar a review. Tente novamente.");
                return;
            }
            setErrorMensage('');
            setIsOpen(false);
            //mudar o state da selectedReview, para o useEffect voltar a ser feito e ir buscar outra vez as review
            setReview({});

        } catch (error) {
            console.error('Erro ao eliminar a review:', error);
        }
    };


    return (
        <div>
            {/* Modal de confirmação */}
            <Modal show={isOpen} onHide={() => { setIsOpen(false); setErrorMensage(''); }}>
                <Modal.Header>
                    <Modal.Title>Eliminar Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span style={{ color: 'red' }}>{errorMensage}</span>
                    Tem certeza que deseja eliminar a review <strong>{review.title}</strong> ?
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

export default DeleteReview;
