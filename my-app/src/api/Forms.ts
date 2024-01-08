import { format } from 'date-fns';

import { axiosAPI } from ".";
import { ILanguage, IForm } from "../models";

interface FormsResponse {
    forms: IForm[]
}

function formatDate(date: Date | null): string {
    if (!date) {
        return ""
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes} ${day}.${month}.${year}`;
}

export async function getForms(
    status: string,
    startDate: string | null,
    endDate: string | null
): Promise<IForm[]> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return [];
    }
    return axiosAPI
        .get<FormsResponse>('/forms/', {
            params: {
                ...(status && { status: status }),
                ...(startDate && {
                    formation_date_start: format(new Date(startDate), 'yyyy-MM-dd HH:mm:ss'),
                }),
                ...(endDate && {
                    formation_date_end: format(new Date(endDate), 'yyyy-MM-dd HH:mm:ss'),
                }),
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) =>
            response.data.forms.map((tr: IForm) => ({
                ...tr,
                creation_date: formatDate(new Date(tr.creation_date)),
                formation_date: tr.formation_date
                    ? formatDate(new Date(tr.formation_date))
                    : null,
                completion_date: tr.completion_date
                    ? formatDate(new Date(tr.completion_date))
                    : null,
            }))
        );
}

interface FormResponse {
    languages: ILanguage[]
    form: IForm
}

export async function getForm(id: string | undefined): Promise<FormResponse | null> {
    if (id === undefined) { return null; }
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return null;
    }

    return axiosAPI.get<FormResponse>(`/forms/${id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            const modifiedForm: IForm = {
                ...response.data.form,
                creation_date: formatDate(new Date(response.data.form.creation_date)),
                formation_date: response.data.form.formation_date
                    ? formatDate(new Date(response.data.form.formation_date))
                    : null,
                completion_date: response.data.form.completion_date
                    ? formatDate(new Date(response.data.form.completion_date))
                    : null,
            };

            return {
                ...response.data,
                form: modifiedForm,
            };
        })
}