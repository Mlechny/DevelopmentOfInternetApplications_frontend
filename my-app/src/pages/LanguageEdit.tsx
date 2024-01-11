import { FC, useEffect, useState, ChangeEvent, useRef } from 'react';
import { useLocation, useParams} from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Card, Row, Navbar, InputGroup, Form, Col, Button, ButtonGroup } from 'react-bootstrap';

import { axiosAPI, getLanguage } from '../api'
import { ILanguage } from '../models';

import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice"

import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';
import Breadcrumbs from '../components/BreadCrumbs';

const LanguageInfo: FC = () => {
    let { language_id } = useParams()
    const [language, setLanguage] = useState<ILanguage | undefined>(undefined)
    const [loaded, setLoaded] = useState<Boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [image, setImage] = useState<File | undefined>(undefined);
    const [edit, setEdit] = useState<boolean>(false);
    const inputFile = useRef<HTMLInputElement | null>(null);
    //const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            setLoaded(false);
            let data: ILanguage | undefined;
            let name: string;
            try {
                if (language_id == 'new') {
                    data = {
                        uuid: "",
                        name: "",
                        subject: "",
                        image_url: "",
                        task: "",
                        description: "",
                    }
                    name = 'Новый язык программирования'
                    setEdit(true)
                } else {
                    data = await getLanguage(language_id);
                    name = data ? data.name : ''
                }
                setLanguage(data);
                dispatch(addToHistory({ path: location, name: name }));
            } finally {
                setLoaded(true);
            }
        }
        setEdit(true)
        getData();
    }, [dispatch]);

    const changeString = (e: ChangeEvent<HTMLInputElement>) => {
        setLanguage(language ? { ...language, [e.target.id]: e.target.value } : undefined)
    }

    /*const deleteLanguage = () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.delete(`/languages/${language_id}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => navigate('/languages-edit'))
    }*/

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formElement = event.currentTarget;
        if (!formElement.checkValidity()) {
            return
        }
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        setEdit(false);

        const formData = new FormData();
        if (language) {
            Object.keys(language).forEach(key => {
                if ((language as any)[key]) {
                    formData.append(key, (language as any)[key])
                }
            });
        }
        if (image) {
            formData.append('image', image);
        }

        if (language_id == 'new') {
            axiosAPI.post(`/languages`, formData, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                .then((response) => getLanguage(response.data).then((data) => setLanguage(data)))
        } else {
            axiosAPI.put(`/languages/${language?.uuid}`, formData, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                .then(() => getLanguage(language_id).then((data) => setLanguage(data)))
                console.log(formData)
        }
    }

    const cancel = () => {
        setEdit(false)
        setImage(undefined)
        if (inputFile.current) {
            inputFile.current.value = ''
        }
        getLanguage(language_id)
            .then((data) => setLanguage(data))
    }

    /*const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setEdit(true);
    };*/

    return (
        <LoadAnimation loaded={loaded}>
            {language ? (
                <>
                    <Navbar>
                        <Breadcrumbs />
                    </Navbar>
                    <Card className='card shadow-lg mb-3'>
                        <Row className='m-0'>
                            <Col className='col-12 col-md-8 overflow-hidden p-0'>
                            <CardImage key={language.image_url} url={`${language.image_url}?${new Date().getTime()}`} />
                            </Col>
                            <Col className='d-flex flex-column col-12 col-md-4 p-0'>
                            <Form noValidate validated={edit} onSubmit={save}>
                                <Card.Body className='flex-grow-1'>
                                    <InputGroup hasValidation className='mb-1'>
                                            <InputGroup.Text className='c-input-group-text'>Название</InputGroup.Text>
                                            <Form.Control id='name' required type='text' value={language.name} readOnly={!edit} onChange={changeString} />
                                    </InputGroup>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='c-input-group-text'>Предмет</InputGroup.Text>
                                        <Form.Control id='subject' required type='text' value={language.subject} readOnly={!edit} onChange={changeString} />
                                    </InputGroup>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='c-input-group-text'>Задание</InputGroup.Text>
                                        <Form.Control id='task' required type='text' value={language.task} readOnly={!edit} onChange={changeString} />
                                    </InputGroup>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='c-input-group-text'>Описание</InputGroup.Text>
                                        <Form.Control id='description' required type='text' value={language.description} readOnly={!edit} onChange={changeString} />
                                    </InputGroup>
                                    <Form.Group className="mb-1">
                                            <Form.Label>Выберите изображение</Form.Label>
                                            <Form.Control
                                                disabled={!edit}
                                                type="file"
                                                accept='image/*'
                                                ref={inputFile}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setImage(e.target.files?.[0])} />
                                        </Form.Group>
                                </Card.Body>
                                {edit ? (
                                        <ButtonGroup className='w-100'>
                                            <Button type='submit' className='gradient-button1'>Сохранить</Button>
                                            {language_id != 'new' && <Button className='gradient-button' onClick={cancel}>Отменить</Button>}
                                        </ButtonGroup>
                                    ) : (
                                        <></>
                                    )}
                            </Form>
                            </Col>
                        </Row>
                    </Card>
                </ >
            ) : (
                <h3 className='text-center'>Такого языка программирования не существует</h3>
            )
            }
        </LoadAnimation >
    )
}

export default LanguageInfo