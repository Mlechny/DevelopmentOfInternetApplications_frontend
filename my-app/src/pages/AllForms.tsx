import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import { Navbar, Form, Button, Table, InputGroup } from 'react-bootstrap';

import { getForms } from '../api/Forms';
import { IForm } from "../models";

import { AppDispatch, RootState } from "../store";
import {setUser, setStatus, setDateStart, setDateEnd } from "../store/searchSlice";
import { clearHistory, addToHistory } from "../store/historySlice";

import LoadAnimation from '../components/LoadAnimation';
import { MODERATOR } from '../components/AuthCheck'
import DateTimePicker from '../components/DatePicker';
import { format } from 'date-fns';

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
        setLoaded(false)
        getForms(userFilter, statusFilter, startDate, endDate)
        .then((data) => {
            setLoaded(true);
            setForms(data)
        })
    };

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Формы" }))
        getData()
        const intervalId = setInterval(() => {
            getData();
        }, 2000);
        return () => clearInterval(intervalId);
    }, [dispatch, userFilter, statusFilter, startDate, endDate]);

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row align-items-stretch flex-grow-1 gap-2" onSubmit={handleSearch}>
                {role == MODERATOR && <InputGroup size='sm' className='shadow-sm'>
                        <InputGroup.Text>Пользователь</InputGroup.Text>
                        <Form.Control value={userFilter} onChange={(e) => dispatch(setUser(e.target.value))} />
                    </InputGroup>}
                    <InputGroup size='sm' className='shadow-sm'>
                        <InputGroup.Text >Статус</InputGroup.Text>
                        <Form.Select
                            defaultValue={statusFilter}
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
                        onChange={(date: Date) => dispatch(setDateStart(date ? format(date, 'yyyy-MM-dd HH:mm:ss') : null))}
                    />
                    <DateTimePicker
                        selected={endDate ? new Date(endDate) : null}
                        onChange={(date: Date) => dispatch(setDateEnd(date ? format(date, 'yyyy-MM-dd HH:mm:ss') : null))}
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
                            {role == MODERATOR && <th className='text-center'>Пользователь</th>}
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
                                <td className='p-1 text-center align-middle'>
                                    <Link to={`/forms/${form.uuid}`} className='text-decoration-none' >
                                        <Button
                                            variant='outline-secondary'
                                            size='sm'
                                            className='align-self-center'
                                        >
                                            Подробнее
                                        </Button>
                                    </Link>
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