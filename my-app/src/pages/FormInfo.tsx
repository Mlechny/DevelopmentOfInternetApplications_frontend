import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Navbar, InputGroup, Form, Button, ButtonGroup } from 'react-bootstrap';

import { axiosAPI } from "../api";
import { getForm } from '../api/Forms';
import { IForm, ILanguage } from "../models";

import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice";

import LoadAnimation from '../components/LoadAnimation';
import LanguageCard from '../components/LanguageCard';
import Breadcrumbs from '../components/BreadCrumbs';

const FormInfo = () => {
    let { form_id } = useParams()
    const [form, setForm] = useState<IForm | null>(null)
    const [composition, setComposition] = useState<ILanguage[] | null>([])
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [edit, setEdit] = useState(false)
    const [comments, setComments] = useState<string>('')
    const navigate = useNavigate()

    const getData = () => {
        getForm(form_id)
            .then(data => {
                if (data === null) {
                    setForm(null)
                    setComposition([])
                } else {
                    setForm(data.form);
                    setComments(data.form.comments ? data.form.comments : '')
                    setComposition(data.languages);

                }
            })
    }

    const update = () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put(`/forms`,
            { comments: comments },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(() => getData())
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        setEdit(false);
    }

    useEffect(() => {
        dispatch(addToHistory({ path: location, name: "Форма" }))
        getData()
        setLoaded(true)
    }, [dispatch]);

    const delFromForm = (id: string) => () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete(`/forms/delete_language/${id}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getData())
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const confirm = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put('/forms/user_confirm', null, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(_ => {
                getData()
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const deleteF = () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.delete('/forms', { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(_ => {
                navigate('/languages')
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    return (
        <LoadAnimation loaded={loaded}>
            {form ? (
                <>
                    <Navbar>
                            <Breadcrumbs />
                    </Navbar>
                    <Col className='p-3 pt-1'>
                        <Card className='shadow text center text-md-start'>
                            <Card.Body>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Статус</InputGroup.Text>
                                    <Form.Control readOnly value={form.status} />
                                </InputGroup>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Создана</InputGroup.Text>
                                    <Form.Control readOnly value={form.creation_date} />
                                </InputGroup>
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Сформирована</InputGroup.Text>
                                    <Form.Control readOnly value={form.formation_date ? form.formation_date : ''} />
                                </InputGroup>
                                {(form.status == 'отклонена' || form.status == 'завершена') && <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>{form.status === 'отклонена' ? 'Отклонена' : 'Завершена'}</InputGroup.Text>
                                    <Form.Control readOnly value={form.completion_date ? form.completion_date : ''} />
                                </InputGroup>}
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Коммментарии</InputGroup.Text>
                                    <Form.Control
                                        readOnly={!edit}
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                    />
                                    {!edit && form.status === 'черновик' && <Button onClick={() => setEdit(true)}>Изменить</Button>}
                                    {edit && <Button variant='success' onClick={update}>Сохранить</Button>}
                                    {edit && <Button
                                        variant='danger'
                                        onClick={() => {
                                            setComments(form.comments ? form.comments : '');
                                            setEdit(false)
                                        }}>
                                        Отменить
                                    </Button>}
                                </InputGroup>
                                {form.status != 'черновик' &&
                                    <InputGroup className='mb-1'>
                                        <InputGroup.Text className='t-input-group-text'>Автотест</InputGroup.Text>
                                        <Form.Control readOnly value={form.autotest ? form.autotest : ''} />
                                    </InputGroup>}
                                {form.status == 'черновик' &&
                                    <ButtonGroup className='flex-grow-1 w-100'>
                                        <Button variant='success' onClick={confirm}>Сформировать</Button>
                                        <Button variant='danger' onClick={deleteF}>Удалить</Button>
                                    </ButtonGroup>}
                            </Card.Body>
                        </Card>
                        {composition && <Row className='row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1 mt-2'>
                            {composition.map((language) => (
                                <div className='d-flex p-2 justify-content-center' key={language.uuid}>
                                    <LanguageCard  {...language}>
                                        {form.status == 'черновик' &&
                                            <Button
                                                variant='outline-danger'
                                                className='mt-0 rounded-bottom'
                                                onClick={delFromForm(language.uuid)}>
                                                Удалить
                                            </Button>}
                                    </LanguageCard>
                                </div>
                            ))}
                        </Row>}
                    </Col>
                </>
            ) : (
                <h4 className='text-center'>Такой формы не существует</h4>
            )}
        </LoadAnimation>
    )
}

export default FormInfo