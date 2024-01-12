import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import { Navbar, Form, Button, Table, InputGroup, ButtonGroup } from 'react-bootstrap';

import { getForms } from '../api/Forms';
import { IForm } from "../models";
import { axiosAPI } from '../api';

import { AppDispatch, RootState } from "../store";
import {setUser, setStatus, setDateStart, setDateEnd } from "../store/searchSlice";
import { clearHistory, addToHistory } from "../store/historySlice";

import LoadAnimation from '../components/LoadAnimation';
import { MODERATOR } from '../components/AuthCheck'
import DateTimePicker from '../components/DatePicker';

const AllForms = () => {
    const [forms, setForms] = useState<IForm[]>([])
    const statusFilter = useSelector((state: RootState) => state.search.status);
    const userFilter = useSelector((state: RootState) => state.search.user);
    const startDate = useSelector((state: RootState) => state.search.formationDateStart);
    const endDate = useSelector((state: RootState) => state.search.formationDateEnd);
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [loaded, setLoaded] = useState(false)

    const getData = () => {
        getForms(userFilter, statusFilter, startDate, endDate)
        .then((data) => {
            setLoaded(true);
            setForms(data)
            console.log(data)
        })
    };

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
    }

    useEffect(() => {
        console.log('effect')
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Формы" }))
        getData()
        const intervalId = setInterval(() => {
            getData();
        }, 2000);
        return () => clearInterval(intervalId);
    }, [dispatch, userFilter, statusFilter, startDate, endDate]);

    const moderator_confirm = (id: string, confirm: boolean) => () => {
        const accessToken = localStorage.getItem('access_token');
        axiosAPI.put(`/forms/${id}/moderator_confirm`,
            { confirm: confirm },
            { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => setForms(prevForms => [...prevForms]))
    }

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row align-items-stretch flex-grow-1 gap-2" onSubmit={handleSearch}>
                {role == MODERATOR && <InputGroup size='sm' className='shadow-sm'>
                        <InputGroup.Text>Пользователь</InputGroup.Text>
                        <Form.Control value={userFilter} className="form-control-sm flex-grow-1 custom-search-input" onChange={(e) => dispatch(setUser(e.target.value))} />
                    </InputGroup>}
                    <InputGroup size='sm' className='shadow-sm'>
                        <InputGroup.Text >Статус</InputGroup.Text>
                        <Form.Select
                            defaultValue={statusFilter}
                            className="form-control-sm flex-grow-1 custom-search-input"
                            onChange={(status) => dispatch(setStatus(status.target.value))}                       
                        >
                            <option value="">Любой</option>
                            <option value="сформирована">Сформирована</option>
                            <option value="завершена">Завершена</option>
                            <option value="отклонена">Отклонена</option>
                        </Form.Select>
                    </InputGroup>
                    <DateTimePicker
                        selected={startDate ? new Date(startDate) : null}
                        onChange={(date: Date) => dispatch(setDateStart(date ? date.toISOString() : null))}
                    />
                    <DateTimePicker
                        selected={endDate ? new Date(endDate) : null}
                        onChange={(date: Date) => dispatch(setDateEnd(date ? date.toISOString() : null))}
                    />
                    <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        className="shadow-lg">
                        Поиск
                    </Button>
                </Form>
            </Navbar>
            < LoadAnimation loaded={loaded}>
                <Table bordered hover>
                    <thead>
                        <tr>
                            {role == MODERATOR && <th className='text-center'>Создатель</th>}
                            <th className='text-center'>Статус</th>
                            <th className='text-center'>Автотест</th>
                            <th className='text-center'>Дата создания</th>
                            <th className='text-center'>Дата формирования</th>
                            <th className='text-center'>Дата завершения</th>
                            <th className='text-center'>Комментарии</th>
                            <th className='text-center'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {forms.map((form) => (
                            <tr key={form.uuid}>
                                {role == MODERATOR && <td className='text-center'>{form.student}</td>}
                                <td className='text-center'>{form.status}</td>
                                <td className='text-center'>{form.autotest}</td>
                                <td className='text-center'>{form.creation_date}</td>
                                <td className='text-center'>{form.formation_date}</td>
                                <td className='text-center'>{form.completion_date}</td>
                                <td className='text-center'>{form.comments}</td>
                                <td className='p-0 text-center align-middle'>
                                    <Table className='m-0'>
                                        <tbody>
                                            <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <Link to={`/forms/${form.uuid}`}
                                                        className='gradient-button1 text-decoration-none w-100' >
                                                        Подробнее
                                                    </Link>
                                                </td>
                                            </tr>
                                            {form.status == 'сформирована' && role == MODERATOR && <tr>
                                                <td className='py-1 border-0' style={{ background: 'transparent' }}>
                                                    <ButtonGroup className='btn'>
                                                        <Button  size='sm' onClick={moderator_confirm(form.uuid, true)}>Подтвердить</Button>
                                                        <Button  size='sm' onClick={moderator_confirm(form.uuid, false)}>Отменить</Button>
                                                    </ButtonGroup>
                                                </td>
                                            </tr>}
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </LoadAnimation >
        </>
    )
}

export default AllForms