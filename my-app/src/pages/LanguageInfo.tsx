import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BigRCard, ILanguageProps } from '../components/LanguageCard';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import LoadAnimation from '../components/LoadAnimation';
import { getLanguage } from '../requests/GetLanguage'


const LanguageInfo: FC = () => {
    let { language_id } = useParams()
    const [language, setLanguage] = useState<ILanguageProps>()
    const [loaded, setLoaded] = useState<boolean>(false)

    useEffect(() => {
        getLanguage(language_id)
            .then(data => {
                setLanguage(data)
                setLoaded(true)
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <>
        <Navbar>
                <Nav>
                <Link to="/languages" className="nav-link p-0">
                    Языки программирования
                </Link>
                <Nav.Item className='mx-1'>{">"}</Nav.Item>
                <Nav.Item className="nav-link p-0">
                    {`${language ? language.name : 'неизвестно'}`}
                </Nav.Item>
                </Nav>
            </Navbar>
            {loaded ? (
                 language ? (
                    <BigRCard {...language} />
                 ) : (
                     <h3 className='text-center'>Такого языка программирования не существует</h3>
                 )
             ) : (
                <LoadAnimation />
            )
            }
        </>
    )
}

export { LanguageInfo }