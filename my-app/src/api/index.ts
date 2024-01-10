import { languages, draft_form } from './MockData';
import { ILanguage } from '../models';
import axios, { AxiosRequestConfig } from 'axios';

const ip = 'localhost'
const port = '3000'
export const imagePlaceholder = `${import.meta.env.BASE_URL}placeholder.jpg`

export const axiosAPI = axios.create({ baseURL: `http://${ip}:${port}/api/`, timeout: 2000 });
//export const axiosImage = axios.create({ baseURL: `http://${ip}:${port}/images/`, timeout: 10000 });

export type Response = {
    draft_form: string | null;
    languages: ILanguage[];
}

export async function getAllLanguages(filter?: string): Promise<Response> {
    let url = 'languages/';
    if (filter !== undefined) {
        url += `?name=${filter}`;
    }
    const headers: AxiosRequestConfig['headers'] = {};
    let accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return axiosAPI.get<Response>(url, { headers })
        .then(response => response.data)
        .catch(_ => fromMock(filter))
}

function fromMock(filter?: string): Response {
    let filteredLanguages = Array.from(languages.values())
    if (filter !== undefined) {
        let name = filter.toLowerCase()
        filteredLanguages = filteredLanguages.filter(
            (language) => language.name.toLowerCase().includes(name)
        )
    }
    return { draft_form, languages: filteredLanguages }
}

export async function getLanguage(languageId?: string): Promise<ILanguage | undefined> {
    if (languageId === undefined) {
        return undefined
    }
    let url = 'languages/' + languageId
    return axiosAPI.get<ILanguage>(url)
        .then(response => response.data)
        .catch(_ => languages.get(languageId))
}