import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap'; // Importando componentes do react-bootstrap
import { createAccount } from '../API/api';

const RegisterPage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [okMessage, setOkMessage] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        userName: '',
        password: '',
        confirmPassword: ''
    });

    // função que faz o submit do formulário
    const handleSubmit = async (event) => {
        event.preventDefault(); // evita que a página recarregue
        //limpar as mensagens
        setErrorMessage('');
        setOkMessage('');
    
        //confirma se todos os campos foram preenchidos
        if (!formData.email || !formData.userName || !formData.password || !formData.confirmPassword) {
            setErrorMessage('Por favor, preencha todos os campos.');
            return;
        }

        //confirma se as passwords são iguais
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }
    
        try {
            const response = await createAccount(formData.email, formData.userName, formData.password);
    
            if (response.ok) {
                setOkMessage("A conta foi criada com sucesso!");
                setFormData({
                    email: '',
                    userName: '',
                    password: '',
                    confirmPassword: ''
                });
            } else {
                setErrorMessage("Houve um problema e a conta não foi criada! Tente novamente...");
            }
        } catch (error) {
            console.error("Erro ao criar a conta", error);
            setErrorMessage("Houve um erro ao criar a conta. Por favor, tente novamente mais tarde.");
        }
    };
    // função para atualizar o estado conforme os campos vão sendo atualizados
    const handleChange = (event) => {
        setErrorMessage('');
        setOkMessage('');
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
    };


    return (
        <>
            <div style={{ width: '35%', marginLeft: '15%' }}>
                <h1>My Favorite Things</h1>
                <div className="row">
                    <div className="col-md-8">
                        <section>
                            <Form id="account" onSubmit={handleSubmit}>
                                <h4>Crie uma conta</h4>
                                <hr />

                                <span style={{ color: 'red' }}>{errorMessage}</span>
                                <span style={{ color: 'green' }}>{okMessage}</span>
    
                                <div className="text-danger" role="alert"></div>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Control type="email" placeholder="Email" style={{ height: '60px' }} value={formData.email}
                                        onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="userName">
                                    <Form.Control type="name" placeholder="Nome de Utilizador" style={{ height: '60px' }} value={formData.userName}
                                        onChange={handleChange} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Control type="password" placeholder="Palavra-passe" style={{ height: '60px' }} value={formData.password}
                                        onChange={handleChange} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="confirmPassword">
                                    <Form.Control type="password" placeholder="Cofirme a palavra-passe" style={{ height: '60px' }} value={formData.confirmPassword}
                                        onChange={handleChange} />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="primaryBtn">
                                    Criar Conta
                                </Button>
                            </Form>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
