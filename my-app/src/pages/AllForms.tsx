import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';
import { Navbar, Form, Button, Table, Col, InputGroup } from 'react-bootstrap';

import { getForms } from '../api/Forms';
import { IForm } from "../models";

import { AppDispatch, RootState } from "../store";
import { setStatus, setDateStart, setDateEnd } from "../store/searchSlice";
import { clearHistory, addToHistory } from "../store/historySlice";

import LoadAnimation from '../components/LoadAnimation';
import { MODERATOR } from '../components/AuthCheck'
import DateTimePicker from '../components/DatePicker';

const AllForms = () => {
    const [forms, setForms] = useState<IForm[]>([])
    const statusFilter = useSelector((state: RootState) => state.search.status);
    const startDate = useSelector((state: RootState) => state.search.formationDateStart);
    const endDate = useSelector((state: RootState) => state.search.formationDateEnd);
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;
    const [loaded, setLoaded] = useState(false)

    const getData = () => {
        setLoaded(false)
        getForms(statusFilter, startDate, endDate)
            .then((data) => {
                setForms(data)
                setLoaded(true);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoaded(true)
            })
    };

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        getData()
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Формы" }))
        getData()
    }, [dispatch]);

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row align-items-stretch flex-grow-1 gap-2" onSubmit={handleSearch}>
                    <InputGroup size='sm'>
                        <InputGroup.Text >Статус</InputGroup.Text>
                        <Form.Select
                            defaultValue={statusFilter}
                            onChange={(status) => dispatch(setStatus(status.target.value))}
                            className="shadow-sm"
                        >
                            <option value="">Любой</option>
                            <option value="сформирована">Сформирована</option>
                            <option value="завершена">Подтверждена</option>
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
                            {role == MODERATOR && <th className='text-center'>Пользователь</th>}
                            <th className='text-center'>Статус</th>
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
                                <td className='text-center'>{form.creation_date}</td>
                                <td className='text-center'>{form.formation_date}</td>
                                <td className='text-center'>{form.completion_date}</td>
                                <td className='text-center'>{form.comments}</td>
                                <td className=''>
                                    <Col className='d-flex flex-col align-items-center justify-content-center'>
                                        <Link to={`/forms/${form.uuid}`} className='text-decoration-none' >
                                            <Button
                                                variant='outline-secondary'
                                                size='sm'
                                                className='align-self-center'
                                            >
                                                Подробнее
                                            </Button>
                                        </Link>
                                    </Col>
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