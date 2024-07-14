import React, { useEffect, useState, useContext, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { AppContext } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommentItem from './CommentItem';
import '../App.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveComment, getReview } from '../API/api';

const ReviewDetails = ({ isOpen, setIsOpen, revId }) => {
    const { context, setContext } = useContext(AppContext);
    const [comment, setComment] = useState('');
    const [newComment, setNewComment] = useState(false);
    const [review, setReview] = useState({});
    const reviewRef = useRef();

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



    // função para carregar a imagem e convertê-la num URL de base64
    const loadImageAsBase64 = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = url;
        });
    };

    const generatePDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        let yOffset = 10;

        // adicionar o título ao PDF
        pdf.setFontSize(22);
        pdf.text(review.title, 10, yOffset);
        yOffset += 10;

        // garantir que a imagem é carregada corretamente
        if (review?.image) {
            const imgData = await loadImageAsBase64(`https://localhost:7218/api/Image/${review.image}`);
            pdf.addImage(imgData, 'PNG', 10, yOffset, 150, 100); // Ajustar a altura da imagem para 100
            yOffset += 110; // Ajustar de acordo com a altura da imagem
        }

        // adicionar a avaliação ao PDF
        pdf.setFontSize(16);
        pdf.text('Avaliação:', 10, yOffset);
        yOffset += 10;
        const rating = review.rating ? `${review.rating} estrelas` : 'Sem avaliação';
        pdf.setFontSize(12);
        pdf.text(rating, 10, yOffset);
        yOffset += 10;

        // adicionar a categoria ao PDF
        if (review?.category?.name) {
            pdf.setFontSize(16);
            pdf.text('Categoria:', 10, yOffset);
            yOffset += 10;
            pdf.setFontSize(12);
            pdf.text(review.category.name, 10, yOffset);
            yOffset += 10;
        }

        // adicionar a descrição ao PDF
        pdf.setFontSize(16);
        pdf.text('Descrição:', 10, yOffset);
        yOffset += 10;
        pdf.setFontSize(12);
        pdf.text(review.description, 10, yOffset, { maxWidth: 180 });

        pdf.save('review.pdf');
    };

    const handleSubmitComment = async () => {
        try {
            const r = await saveComment(review.reviewId, comment);
            setComment('');
            newComment ? setNewComment(false) : setNewComment(true);
        } catch (error) {
            console.error('Erro ao obter guardar o comentário:', error);
        }
    }

    //em vez de mandar a review da HomePage, vou buscá-la aqui, para os comentários estarem sempre atualizados
    const inic = async (revId) => {
        try {
            const r = await getReview(revId);
            setReview(r);
        } catch (error) {
            console.error('Erro ao obter reviews:', error);
        }
    }

    useEffect(() => {
        if (revId != -1) {
            inic(revId);
        }
    }, [newComment, revId]);


    return (
        <Modal show={isOpen} onHide={() => { setIsOpen(false); setComment(''); }} className="custom-modal">
            <Modal.Header>
                <Modal.Title className='title'> {review?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '70vh', maxHeight: '1000px', overflowY: 'auto' }}>
                <Row style={{ height: '100%' }} >
                    <Col md={8} style={{ height: '100%' }} ref={reviewRef}>
                        <center>
                            {review?.image && (
                                <img src={"https://localhost:7218/api/Image/" + review?.image}
                                    alt={review?.title} style={{
                                        maxHeight: '200px', maxWidth: '150px'
                                    }} />
                            )}
                            <h4 style={{ margin: '15px' }}>Avaliação</h4>
                            <h6>{renderStars(review?.rating)}</h6>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <h4 style={{ marginTop: '10px' }}>Categoria: </h4>
                                <h5 style={{ marginTop: '13px', marginLeft: '4px' }}>{review?.category?.name}</h5>
                            </div>
                        </center>
                        <h4>Descrição</h4>
                        <div className='description-box'>{review?.description}</div>
                    </Col>
                    <Col md={4} style={{ height: '100%' }}>
                        <div style={{ height: '100%', border: '2px inset', MozBorderRadius: '20px', WebkitBorderRadius: '20px' }}>
                            <h4 style={{ width: '90%', height: '10%', textAlign: 'center', margin: '10px' }}>Comentários</h4>
                            <div style={{ height: '75%', overflowY: 'auto' }}>
                                {review?.comments && review?.comments.map((comment, index) => (
                                    <CommentItem key={index} userName={comment.utilizador.userName} comment={comment.comment} />
                                ))}
                            </div>

                            <div style={{ height: '15%', marginBottom: '4px' }}>
                                <div className="input-group mb-3">
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        placeholder="Comentário"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        disabled={!context.isAuthenticated}
                                        style={{ resize: 'none', overflow: 'hidden', marginRight: '4px', overflowY: 'auto', height: '60px' }}
                                    ></textarea>
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary" style={{ height: '60px' }} type="button" disabled={!context.isAuthenticated} onClick={handleSubmitComment} >
                                            <FontAwesomeIcon icon="paper-plane" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={generatePDF}>
                    Exportar para pdf
                </Button>
                <Button variant="secondary" onClick={() => { setIsOpen(false); setComment(''); }}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ReviewDetails;
