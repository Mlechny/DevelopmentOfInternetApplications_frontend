import { FC, useEffect, useState, ChangeEvent } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Card, Row, Navbar, FloatingLabel, InputGroup, Form, Col, Button, ButtonGroup } from 'react-bootstrap';

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
    const [edit, setEdit] = useState<Boolean>(false)

    useEffect(() => {
        setLoaded(false);
        getLanguage(language_id)
            .then(data => {
                setLanguage(data);
                dispatch(addToHistory({ path: location, name: data ? data.name : "неизвестно" }));
                setLoaded(true);
            })
            .catch(() => setLoaded(true));
    }, [dispatch]);

    const changeString = (e: ChangeEvent<HTMLInputElement>) => {
        setLanguage(language ? { ...language, [e.target.id]: e.target.value } : undefined)
    }

    const save = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        setEdit(false);
        axiosAPI.put(`/languages/${language?.uuid}`, language, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getLanguage(language_id).then((data) => setLanguage(data)))
    }

    const cancel = () => {
        setEdit(false)
        getLanguage(language_id)
            .then((data) => setLanguage(data))
    }

    return (
        <LoadAnimation loaded={loaded}>
            {language ? (
                <>
                    <Navbar>
                        <Breadcrumbs />
                    </Navbar>
                    <Card className='shadow-lg mb-3'>
                        <Row className='m-0'>
                            <Col className='col-12 col-md-8 overflow-hidden p-0'>
                                <CardImage url={language.image_url} />
                            </Col>
                            <Col className='d-flex flex-column col-12 col-md-4 p-0'>
                                <Card.Body className='flex-grow-1'>
                                    <FloatingLabel
                                        label="Тип"
                                        className="mb-3">
                                        <Form.Control
                                            id='name'
                                            value={language.name}
                                            as="textarea"
                                            className='h-25'
                                            readOnly={!edit}
                                            onChange={changeString} />
                                    </FloatingLabel>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='c-input-group-text'>Предмет</InputGroup.Text>
                                        <Form.Control id='subject' value={language.subject} readOnly={!edit} onChange={changeString} />
                                    </InputGroup>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='c-input-group-text'>Задание</InputGroup.Text>
                                        <Form.Control id='task' value={language.task} readOnly={!edit} onChange={changeString} />
                                    </InputGroup>
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='c-input-group-text'>Описание задания</InputGroup.Text>
                                        <Form.Control id='description' value={language.description} readOnly={!edit} onChange={changeString} />
                                    </InputGroup>
                                </Card.Body>
                                {edit ? (
                                    <ButtonGroup className='w-100'>
                                        <Button variant='success' onClick={save}>Сохранить</Button>
                                        <Button variant='danger' onClick={cancel}>Отменить</Button>
                                    </ButtonGroup>
                                ) : (
                                    <Button
                                        className='w-100 '
                                        onClick={() => setEdit(true)}>
                                        Изменить
                                    </Button>
                                )}
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