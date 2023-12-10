import { languages, draft_notification } from './MockData';
import { ILanguageProps } from '../components/LanguageCard';

export type Response = {
    draft_notification: string | null;
    languages: ILanguageProps[];
}

export async function getAllLanguages(filter?: string): Promise<Response> {
    let url = '/api/languages'
    if (filter !== undefined) {
        url += `?name=${filter}`
    }
    return fetch(url)
        .then(response => {
            if (response.status >= 500) {
                return fromMock(filter)
            }
            return response.json() as Promise<Response>
        })
        .catch(_ => {
            return fromMock(filter)
        })
}

function fromMock(filter?: string): Response {
    let filteredLanguages = Array.from(languages.values())
    if (filter !== undefined) {
        let name = filter.toLowerCase()
        filteredLanguages = filteredLanguages.filter(
            (language) => language.name.toLowerCase().includes(name)
        )
    }
    return { draft_notification, languages: filteredLanguages }
}