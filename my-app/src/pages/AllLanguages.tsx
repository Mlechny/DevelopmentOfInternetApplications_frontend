import { useEffect, useState, FC } from 'react';
import { SmallRCard, ILanguageProps } from '../components/LanguageCard';
import LoadAnimation from '../components/LoadAnimation';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { getAllLanguages } from '../requests/GetAllLanguages'

interface ISearchProps {
    setLanguages: React.Dispatch<React.SetStateAction<ILanguageProps[]>>
}

const Search: FC<ISearchProps> = ({ setLanguages }) => {
    const [searchText, setSearchText] = useState<string>('');

    const handleSearch = (event: React.FormEvent<any>) => {
        event.preventDefault();
        getAllLanguages(searchText)
            .then(data => {
                console.log(data)
                setLanguages(data.languages)
            })
    }
    return (
        <Navbar>
            <Form className="d-flex flex-row flex grow-1 gap-2" onSubmit={handleSearch}>
                <Form.Control
                    type="text"
                    placeholder="Поиск"
                    className="form-control-sm flex-grow-1 shadow shadow-sm"
                    data-bs-theme="primary"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                 <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    className="shadow">
                    Поиск
                </Button>
            </Form>
        </Navbar>)
}

const AllLanguages = () => {
        const [loaded, setLoaded] = useState<boolean>(false)
        const [languages, setLanguages] = useState<ILanguageProps[]>([]);
        const [_, setDraftNotification] = useState<string | null>(null);
    
        useEffect(() => {
            getAllLanguages()
                .then(data => {
                    console.log(data)
                    setDraftNotification(data.draft_notification)
                    setLanguages(data.languages)
                    setLoaded(true)
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }, []);    return (
        <>
            <Search  setLanguages={setLanguages} />
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 px-1'>
            {loaded ? (
                    languages.map((language) => (
                    <div className='d-flex py-1 p-2 justify-content-center' key={language.uuid}>
                        <SmallRCard {...language} />
                    </div>
                ))
                ) : (
                    <LoadAnimation />
                )}   
        </div>
        </>
    )
}

export { AllLanguages }