import { useEffect, useState } from 'react';
import { Navbar, Form, Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';

import { getAllLanguages, axiosAPI } from '../api'
import { ILanguage } from '../models'

import { AppDispatch, RootState } from "../store";
import { setName } from "../store/searchSlice"
import { clearHistory, addToHistory } from "../store/historySlice"

import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';


const LanguageTable = () => {
    const searchText = useSelector((state: RootState) => state.search.name);
    const [languages, setLanguages] = useState<ILanguage[]>([])
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    const getLanguages = () =>
        getAllLanguages(searchText)
            .then(data => {
                setLanguages(data.languages)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });


    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        setLanguages([])
        getLanguages();
    }

    useEffect(() => {
        dispatch(clearHistory())
        dispatch(addToHistory({ path: location, name: "Управление языками программировния" }))
        getLanguages();
    }, [dispatch]);

    const deleteLanguage = (uuid: string) => () => {
        let accessToken = localStorage.getItem('access_token');
        axiosAPI.delete(`/languages/${uuid}`, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
            .then(() => getLanguages())
    }

    return (
        <>
            <Navbar>
                <Form className="d-flex flex-row flex-grow-1 gap-2" onSubmit={handleSearch}>
                    <Form.Control
                        name="text"
                        placeholder="Поиск"
                        className="form-control-sm flex-grow-1 shadow"
                        data-bs-theme="dark"
                        value={searchText}
                        onChange={(e) => dispatch(setName(e.target.value))}
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
            < LoadAnimation loaded={languages.length > 0}>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th className='text-center'>Изображение</th>
                            <th className='text-center'>Название</th>
                            <th className='text-center'>Предмет</th>
                            <th className=''></th>
                        </tr>
                    </thead>
                    <tbody>
                        {languages.map((language) => (
                            <tr key={language.uuid}>
                                <td style={{ width: '15%' }} className='p-0'>
                                    <CardImage url={language.image_url} />
                                </td>
                                <td className='text-center'>{language.name}</td>
                                <td className='text-center'>{language.subject}</td>
                                <td className='text-center align-middle'>
                                    <table className='table m-0'>
                                        <tr>
                                            <Link
                                                to={`/languages-edit/${language.uuid}`}
                                                className='btn btn-sm btn-outline-secondary text-decoration-none w-100' >
                                                Редактировать
                                            </Link>
                                        </tr>
                                        <tr><td className='p-1'></td></tr>
                                        <tr>
                                            <Button
                                                variant='outline-danger'
                                                size='sm'
                                                className='w-100'
                                                onClick={deleteLanguage(language.uuid)}>
                                                Удалить
                                            </Button>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </LoadAnimation >
        </>
    )
}

export default LanguageTable