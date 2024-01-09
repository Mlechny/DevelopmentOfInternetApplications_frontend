import { ILanguage } from '../models';

export const draft_form = null
export let languages = new Map<string, ILanguage>([
    ["a20163ce-7be5-46ec-a50f-a313476b2bd1",
        {
            uuid: "a20163ce-7be5-46ec-a50f-a313476b2bd1",
            name: "Python",
            subject: "Парадигмы языков программирования",
            image_url: "http://localhost:9000/images/a20163ce-7be5-46ec-a50f-a313476b2bd1.jpg",
            task: "Лабораторная работа 2",
            description: "..."
        }
    ],
    ["8f157a95-dad1-43e0-9372-93b51de06163", {
        uuid: "8f157a95-dad1-43e0-9372-93b51de06163",
            name: "Swift",
            subject: "IOS-спринт",
            image_url: "http://localhost:9000/images/8f157a95-dad1-43e0-9372-93b51de06163.jpg",
            task: "ДЗ",
            description: "..."
    }
    ],
    ["07d0cbdc-8e0f-4308-a7aa-11976ee6e5b2", {
        uuid: "07d0cbdc-8e0f-4308-a7aa-11976ee6e5b2",
            name: "JavaScript",
            subject: "Программирование сетевых приложений",
            image_url: "http://localhost:9000/images/07d0cbdc-8e0f-4308-a7aa-11976ee6e5b2.jpg",
            task: "Дополнительное задание",
            description: "..."
    }
    ]
])