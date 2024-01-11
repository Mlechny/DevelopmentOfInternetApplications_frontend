import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import { imagePlaceholder } from '../api'
import axios from 'axios';

interface CardImageProps {
    url: string;
    className?: string;
}

const CardImage = ({ url, className, ...props }: CardImageProps) => {
    const [src, setSrc] = useState(imagePlaceholder);

    useEffect(() => {
        if (!url) {
            return;
        }

        // Добавление протокола http://, если отсутствует
        const fullUrl = new URL(url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`);
        fullUrl.searchParams.set('timestamp', new Date().getTime().toString());
        const fullUrlString = fullUrl.toString();

        axios.get(fullUrlString, { responseType: 'blob' })
            .then(response => {
                if (src !== imagePlaceholder && src !== url) {
                    URL.revokeObjectURL(src);
                }
                setSrc(URL.createObjectURL(response.data));
            })
            .catch(error => {
                console.error(`Error loading image from ${fullUrl}:`, error.message);
            });

    }, [url]); // Обновление при изменении url

    const handleError = () => {
        console.error(`Error loading image: ${url}`);
    };

    return <Card.Img src={src} className={className} onError={handleError} {...props} />;
};

export default CardImage;