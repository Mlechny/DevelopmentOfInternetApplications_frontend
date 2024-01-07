import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Navbar, InputGroup, Form, Button, ButtonGroup } from 'react-bootstrap';

import { axiosAPI } from "../api";
import { getForm } from '../api/Forms';
import { AppDispatch } from "../store";
import { IForm, ILanguage } from "../models";
import { addToHistory } from "../store/historySlice";
import LoadAnimation from '../components/LoadAnimation';
import { SmallCCard } from '../components/LanguageCard';
import Breadcrumbs from '../components/BreadCrumbs';


const FormInfo = () => {
    let { form_id } = useParams()
    console.log(typeof form_id, form_id);
    const [form, setForm] = useState<IForm | null>(null)
    const [content, setContent] = useState<ILanguage[] | null>([])
    const [loaded, setLoaded] = useState(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [edit, setEdit] = useState(false)
    const [comments, setComments] = useState<string>('')
    const navigate = useNavigate()

    const getData = () => {
        setLoaded(false)
        getForm(form_id)
            .then(data => {
                if (data === null) {
                    setForm(null)
                    setContent([])
                } else {
                    setForm(data.form);
                    setComments(data.form.comments ? data.form.comments : '')
                    setContent(data.languages);

                }
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoaded(true)
            });
        setLoaded(true)
    }

    const update = () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.put(`/form`,
            { notification_type: comments },
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
        getData()
        dispatch(addToHistory({ path: location, name: "Форма" }))

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

    const deleteN = () => {
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
                                    <InputGroup.Text className='t-input-group-text'>{form.status === 'отклонена' ? 'Отклонена' : 'Подтверждена'}</InputGroup.Text>
                                    <Form.Control readOnly value={form.completion_date ? form.completion_date : ''} />
                                </InputGroup>}
                                <InputGroup className='mb-1'>
                                    <InputGroup.Text className='t-input-group-text'>Комментарии</InputGroup.Text>
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
                                        <Button variant='primary' onClick={confirm}>Сформировать</Button>
                                        <Button variant='danger' onClick={deleteN}>Удалить</Button>
                                    </ButtonGroup>}
                            </Card.Body>
                        </Card>
                        {content && <Row className='row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1 mt-2'>
                            {content.map((language) => (
                                <div className='d-flex p-2 justify-content-center' key={language.uuid}>
                                    <SmallCCard  {...language}>
                                        {form.status == 'черновик' &&
                                            <Button
                                                variant='outline-danger'
                                                className='mt-0 rounded-bottom'
                                                onClick={delFromForm(language.uuid)}>
                                                Удалить
                                            </Button>}
                                    </SmallCCard>
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