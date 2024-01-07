export interface ILanguage {
    uuid: string
    name: string
    subject: string,
    image_url: string,
    task: string,
    description: string,
}

export interface IForm {
    uuid: string
    status: string
    creation_date: string
    formation_date: string | null
    completion_date: string | null
    moderator: string | null
    student: string
    comments: string | null
    autotest: string | null
}