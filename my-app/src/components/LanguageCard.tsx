import { FC } from 'react'
import { Link } from 'react-router-dom';
import { Card, Row, ListGroup } from 'react-bootstrap';
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
  <Card className='w-100 mx-auto px-0 shadow-lg text-center'>
  <div className="ratio ratio-16x9 overflow-hidden">
      <CardImage url={`http://${image_url}`} className='rounded object-fit-cover'/>
  </div>
  <Card.Body className='flex-grow-1'>
      <Card.Title>{name}</Card.Title>
      <Card.Text>{subject}</Card.Text>
  </Card.Body>
  <Link to={`/languages/${uuid}`} className="btn gradient-button1">Подробнее</Link>
  </Card>
)

export const BigRCard: FC<ILanguageProps> = ({ name, subject, task, description, image_url }) => {
    return (
      <Card className='shadow-lg text-center text-md-start'>
                <Row>
                    <div className='col-12 col-md-8 overflow-hidden'>
                        <CardImage url={`http://${image_url}`} />
                    </div>
                    <Card.Body className='col-10 col-md-4 ps-md-0'>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="card">
                                <Card.Title className="bold-title">{name}</Card.Title>
                                <Card.Text className="lower-and-larger-text">Предмет: {subject}</Card.Text>
                                <Card.Text>Задание: {task}</Card.Text>
                                <Card.Text>Описание задания: {description}</Card.Text>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Row>
            </Card>
    );
  };