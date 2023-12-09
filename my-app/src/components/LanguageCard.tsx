import { FC } from 'react'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import CardImage from './CardImage';

export interface ILanguageProps {
    uuid: string
    name: string
    subject: string
    task: string
    description: string
    image_url: string
}

export const SmallRCard: FC<ILanguageProps> = ({ uuid,name,subject,image_url}) => (
    <Card className='card text-center'>
            <CardImage url={`http://${image_url}`} className='rounded object-fit-cover'/>
        <Card.Body className='flex-grow-1'>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{subject}</Card.Text>
        </Card.Body>
        <Link to={`/languages/${uuid}`} className="btn btn-primary">Подробнее</Link>
    </Card>
)

export const BigRCard: FC<ILanguageProps> = ({name,subject,task,description,image_url}) => {
    return (
        <Card className='mx-auto shadow w-50 p-3 text-center text-md-start' >
             <div className='row'>
                <div className='col-12 col-md-8 px-md-0 overflow-hidden'>
                    <CardImage url={`http://${image_url}`}/>
                </div>
                <Card.Body className='col-12 col-md-4 ps-md-0'>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Card.Title>{name}</Card.Title>
                            <Card.Text>Предмет: {subject}</Card.Text>
                            <Card.Text>Тип задания: {task}</Card.Text>
                            <Card.Text>Описание задания: {description}</Card.Text>
                        </ListGroup.Item>
                    </ListGroup>
                    </Card.Body>
            </div>
        </Card>
    );
};