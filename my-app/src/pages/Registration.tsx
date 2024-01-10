import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Container} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { axiosAPI } from '../api'
import { AxiosError } from 'axios';

const Registration: FC = () => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate()

    const handleRegistration = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axiosAPI.post('/user/sign_up', { login, password })
        .then(() => {
            navigate('/authorization')
        })
        .catch((error: AxiosError) => {
            console.error('Error:', error.message);
        })
    };

    return (
        <Container fluid="sm" className='d-flex flex-column flex-grow-1 align-items-center justify-content-center'>
            <Form onSubmit={handleRegistration} className='d-flex flex-column align-items-center'>
            <h2 className='mt-4 mb-4'>Регистрация</h2>

            <Form.Group controlId="login" className='row mb-3 align-items-center'>
                <Form.Label className='col-sm-3 col-form-label'>Логин:</Form.Label>
                <div className='col-sm-9'>
                <Form.Control
                    type="text"
                    placeholder="Укажите ваш логин"
                    value={login}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
                />
                </div>
            </Form.Group>

            <Form.Group controlId="password" className='row mb-3 align-items-center'>
                <Form.Label className='col-sm-3 col-form-label'>Пароль:</Form.Label>
                <div className='col-sm-9'>
                <Form.Control
                    type="password"
                    placeholder="Укажите ваш пароль"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                </div>
            </Form.Group>

                <Button
                    type="submit"
                    className='gradient-button1 mt-3 w-100'
                    disabled={!login || !password}
                >
                    Зарегистрироваться
                </Button>

                <div className="w-100 text-center mt-3">
                <Link to={'/authorization'} className="nav-link">Перейти к окну авторизации</Link>
                </div>
            </Form>
        </Container>
    );
};

export default Registration