import { FC, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Card, Row, Navbar, ListGroup } from 'react-bootstrap';

import { getLanguage } from '../api'
import { ILanguage } from '../models';

import { AppDispatch } from "../store";
import { addToHistory } from "../store/historySlice"

import LoadAnimation from '../components/LoadAnimation';
import CardImage from '../components/CardImage';
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
                        <Breadcrumbs />
                    </Navbar>
                    <Card className='shadow-lg text-center text-md-start'>
                        <Row>
                            <div className='col-12 col-md-8 overflow-hidden'>
                                <CardImage url={language.image_url} />
                            </div>
                            <Card.Body className='col-12 col-md-4 ps-md-0'>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Card.Title>{language.name}</Card.Title>
                                        <Card.Text>Предмет: {language.subject}</Card.Text>
                                        <Card.Text>Задание: {language.task}</Card.Text>
                                        <Card.Text>Описание задания: {language.description} мм</Card.Text>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Row>
                    </Card>
                </ >
            ) : (
                <h3 className='text-center'>Такого языка программирования не существует</h3>
            )}
        </LoadAnimation>
    )
}

export default LanguageInfo