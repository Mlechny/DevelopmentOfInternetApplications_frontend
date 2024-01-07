import { FC, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { BigCCard } from '../components/LanguageCard';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import LoadAnimation from '../components/LoadAnimation';
import { getLanguage } from '../api'
import { ILanguage } from '../models';
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { addToHistory } from "../store/historySlice"
import Breadcrumbs from '../components/BreadCrumbs';

const LanguageInfo: FC = () => {
    let { language_id } = useParams()
    const [language, setLanguage] = useState<ILanguage | undefined>(undefined)
    const [loaded, setLoaded] = useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation().pathname;

    console.log()

    useEffect(() => {
        getLanguage(language_id)
            .then(data => {
                setLanguage(data);
                dispatch(addToHistory({ path: location, name: data ? data.name : "неизвестно" }));
                setLoaded(true);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        }, [dispatch]);

        return (
            <LoadAnimation loaded={loaded}>
                {language ? (
                    <>
                        <Navbar>
                            <Nav>
                                <Breadcrumbs />
                            </Nav>
                        </Navbar>
                        <BigCCard {...language} />
                    </>
                ) : (
                    <h3 className='text-center'>Такого языка программирования не существует</h3>
                )}
            </LoadAnimation>
        )
}

export default LanguageInfo 