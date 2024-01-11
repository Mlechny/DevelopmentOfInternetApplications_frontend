import { useEffect, useState } from 'react';
import { SmallCCard } from '../components/LanguageCard';
import LoadAnimation from '../components/LoadAnimation';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from 'react-router-dom';

import { getAllLanguages, axiosAPI } from '../api'
import { AppDispatch, RootState } from "../store";
import { setName } from "../store/searchSlice"
import { clearHistory, addToHistory } from "../store/historySlice"
import { ILanguage } from '../models'

const AllLanguages = () => {
    const searchText = useSelector((state: RootState) => state.search.name);
    const [languages, setLanguages] = useState<ILanguage[]>([])
    const [draft, setDraft] = useState<string | null>(null)
    const role = useSelector((state: RootState) => state.user.role);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    const getLanguages = () =>
            getAllLanguages(searchText)
                .then(data => {
                    setLanguages(data.languages)
                    setDraft(data.draft_form)
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });

                const handleSearch = (event: React.FormEvent<any>) => {
                    event.preventDefault();
                    getLanguages();
                }
            
                useEffect(() => {
                    dispatch(clearHistory())
                    dispatch(addToHistory({ path: location, name: "Языки программирования" }))
                    getLanguages();
                }, [dispatch]);   
                
                const addToForm = (id: string) => () => {
                    let accessToken = localStorage.getItem('access_token');
                    if (!accessToken) {
                        return
                    }
            
                    axiosAPI.post(`/languages/${id}/add_to_form`, null, { headers: { 'Authorization': `Bearer ${accessToken}`, } })
                        .then(() => {
                            getLanguages();
                        })
                        .catch((error) => {
                            console.error("Error fetching data:", error);
                        });
                }
    return (
        <>
             <Navbar>
                <Form className="d-flex flex-row flex-grow-1 gap-2" onSubmit={handleSearch}>
                    <Form.Control
                        name="text"
                        placeholder="Поиск"
                        className="form-control-sm flex-grow-1 custom-search-input"
                        value={searchText}
                        onChange={(e) => dispatch(setName(e.target.value))}
                    />
                    <Button
                        size="sm"
                        type="submit"
                        className="shadow-lg">
                        Поиск
                    </Button>
                </Form>
            </Navbar>
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
            <LoadAnimation loaded={languages.length > 0}>
                    {languages.map((language) => (
                    <div className='d-flex py-1 p-2 justify-content-center' key={language.uuid}>
                        <SmallCCard  {...language}>
                                {role != 0 &&
                                    <Button
                                        className='gradient-button'
                                        onClick={addToForm(language.uuid)}>
                                        Добавить в корзину
                                    </Button>
                                }
                            </SmallCCard>
                    </div>
                ))}
                </LoadAnimation>
        </div>
        {!!role && <Link to={`/forms/${draft}`}>
                <Button
                    style={{ position: 'fixed', bottom: '16px', left: '16px', zIndex: '1000'}}
                    className="custom-link-btn rounded-pill"
                    disabled={!draft}>
                    Корзина
                </Button>
            </Link>}
        </>
    )
}

export default AllLanguages