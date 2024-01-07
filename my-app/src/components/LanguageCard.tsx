import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom';
import {Card, ButtonGroup} from 'react-bootstrap';
import CardImage from './CardImage';
import { ILanguage } from '../models'

interface LanguageCardProps extends ILanguage {
    children: ReactNode;
}

const LanguageCard: FC<LanguageCardProps> = ({ children, uuid, name, subject, image_url}) => (
    <Card className='w-100 mx-auto px-0 shadow-lg text-center' key={uuid}>
        <div className="ratio ratio-16x9 overflow-hidden">
            <CardImage url={image_url} className='rounded object-fit-cover' />
        </div>
        <Card.Body className='flex-grow-1'>
            <Card.Title>{name}</Card.Title>
            <Card.Text>Предмет: {subject}</Card.Text>
        </Card.Body>
        <ButtonGroup vertical>
            <Link to={`/languages/${uuid}`} className="btn btn-outline-primary">Подробнее</Link>
            <>{children}</>
        </ButtonGroup>
    </Card>
)

export default LanguageCard;