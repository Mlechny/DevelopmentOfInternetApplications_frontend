import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom';
import {Card, ButtonGroup} from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import CardImage from './CardImage';
import { ILanguage } from '../models'


// const setPlaceholder = (event: any) => {
//     event.target.src = '/placeholder3.jpg';
// };

interface CardProps extends ILanguage {
    children: ReactNode;
}

export const SmallCCard: FC<CardProps> = ({ children, uuid, name, subject, image_url}) => (
    <Card className='w-100 mx-auto px-0 shadow-lg text-center' key={uuid}>
        <div className="ratio ratio-16x9 overflow-hidden">
            <CardImage url={image_url} className='rounded object-fit-cover' />
        </div>
        <Card.Body className='flex-grow-1'>
            <Card.Title>{name}</Card.Title>
            <Card.Text>Предмет: {subject}</Card.Text>
        </Card.Body>
        <ButtonGroup vertical>
            <Link to={`/languages/${uuid}`} className="btn gradient-button1">Подробнее</Link>
            <>{children}</>
        </ButtonGroup>
    </Card>
)

export const BigCCard: FC<ILanguage> = ({ name, subject, task, description, image_url}) => (
    <Card className='shadow-lg text-center text-md-start'>
        <div className='row'>
            <div className='col-12 col-md-8 overflow-hidden'>
                {/* <Card.Img src={`http://${image_url}`} onError={setPlaceholder}/> */}
                <CardImage url={image_url} />
            </div>
            <Card.Body className='col-12 col-md-4 ps-md-0'>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Card.Title>{name}</Card.Title>
                        <Card.Text>Предмет: {subject}</Card.Text>
                        <Card.Text>Задние: {task} мм</Card.Text>
                        <Card.Text>Описание задания: {description} мм</Card.Text>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </div>
    </Card>
);