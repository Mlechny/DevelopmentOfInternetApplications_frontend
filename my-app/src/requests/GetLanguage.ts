import { languages } from './MockData';
import { ILanguageProps } from '../components/LanguageCard';

const api = '/api/languages/'

export async function getLanguage(languageId?: string): Promise<ILanguageProps | undefined> {
    if (languageId === undefined) {
        return undefined
    }
    let url = api + languageId
    return fetch(url)
        .then(response => {
            if (response.status >= 500 || response.headers.get("Server") == "GitHub.com") {
                return languages.get(languageId)
            }
            return response.json() as Promise<ILanguageProps | undefined>
        })
        .catch(_ => {
            return languages.get(languageId)
        })
}