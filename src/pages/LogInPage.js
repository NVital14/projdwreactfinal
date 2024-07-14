import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap'; // Importando componentes do react-bootstrap
import { ROUTES, AppContext } from '../App';
import { signIn } from '../API/api';
import { useNavigate } from 'react-router-dom';


const LogInPage = () => {
    const navigate = useNavigate();
    const { context, setContext } = useContext(AppContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const handleSubmit = async (event) => {
        event.preventDefault(); // evita que a página recarregue
        //limpar as mensagens
        setErrorMessage('');
    
        //confirma se todos os campos foram preenchidos
        if (!formData.email || !formData.password ) {
            setErrorMessage('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await signIn(formData.email,formData.password);
    
            if (response.ok) {
                 setContext((prevState) => ({ ...prevState, isAuthenticated: true }))
                navigate(ROUTES.HOME);
            } else {
                setErrorMessage("Os dados de acessos estão incorretos. Volte a tentar!");
            }
        } catch (error) {
            console.error("Erro ao entrar na conta", error);
            setErrorMessage("Houve um erro entar na conta. Por favor, tente novamente mais tarde.");
        }
    };

        // função para atualizar o estado conforme os campos vão sendo atualizados
        const handleChange = (event) => {
            setErrorMessage('');
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
                                <h4>Entre na sua conta</h4>
                                <hr />
                                <span style={{ color: 'red' }}>{errorMessage}</span>
                                <div className="text-danger" role="alert"></div>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Control type="email" placeholder="Email" style={{ height: '60px' }} value={formData.email} onChange={handleChange} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Control type="password" placeholder="Palavra-passe" style={{ height: '60px' }} value={formData.password} onChange={handleChange} />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="primaryBtn">
                                    Entrar
                                </Button>
                            </Form>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LogInPage;
