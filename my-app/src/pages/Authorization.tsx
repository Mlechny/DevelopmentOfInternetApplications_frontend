import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Container} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { axiosAPI } from '../api'
import { AppDispatch } from "../store";
import { setLogin as setLoginRedux, setRole } from "../store/userSlice";

interface JwtPayload {
    iss: string;
    exp: number;
    role: number;
    login: string;
}

function parseJwt(token: string): JwtPayload {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

interface AuthResp {
    access_token: string;
    token_type: string;
}

const Authorization: FC = () => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();

    const authorize = async (login: string, password: string): Promise<void> => {
        const response = await axiosAPI.post<AuthResp>('/user/login', { login, password });
        const payload = parseJwt(response.data.access_token);
        let expires_at = new Date(payload.exp * 1000);
        localStorage.setItem('expires_at', expires_at.toISOString());
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('role', payload.role.toString());
        localStorage.setItem('login', payload.login);
        dispatch(setLoginRedux(login));
        dispatch(setRole(payload.role));
    }

    const handleRegistration = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        authorize(login, password)
        .then(() => navigate('/'))
    };

   return (
        <Container fluid="sm" className='d-flex flex-column flex-grow-1 align-items-center justify-content-center'>
            <Form onSubmit={handleRegistration} className='d-flex flex-column align-items-center'>
            <h2 className='mt-4 mb-4'>Вход</h2>

            <Form.Group controlId="login" className='row mb-3 align-items-center'>
                <Form.Label className='col-sm-3 col-form-label'>Логин:</Form.Label>
                <div className='col-sm-9'>
                <Form.Control
                    type="text"
                    placeholder="Введите ваш логин"
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
                    placeholder="Введите ваш пароль"
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
                    Авторизоваться
                </Button>

                <div className="w-100 text-center mt-3">
                <Link to={'/registration'} className="nav-link">Перейти к окну регистрации</Link>
                </div>
            </Form>
        </Container>
    );
};

export default Authorization