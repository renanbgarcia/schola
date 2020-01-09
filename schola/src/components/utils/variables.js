export const noImagePlaceHolderUrl = "http://4.bp.blogspot.com/-7vZF8swhwNs/U9-regTYTbI/AAAAAAAAAEs/PTca5aWvIFQ/s1600/pattern.jpg";

export const categories = [
    { title: "Atividade", type: "category", children: []},
    { title: "Exercício", type: "category", children: []},
    { title: "Livro", type: "category", children: []},
    { title: "Música", type: "category", children: []},
    { title: "Vídeo", type: "category", children: []},
    { title: "Apostila", type: "category", children: []},
    { title: "Filme", type: "category", children: []},
]

export const getMaterias = () => {
    return [
        { lessonCount: 0, type: "discipline", title: "Matemática", name: "math", children: []},
        { lessonCount: 0, type: "discipline", title: "História", name: "history", children: []},
        { lessonCount: 0, type: "discipline", title: "Gramática", name: "grammar", children: []},
        { lessonCount: 0, type: "discipline", title: "Artes", name: "art", children: []},
        { lessonCount: 0, type: "discipline", title: "Inglês", name: "english", children: []},
        { lessonCount: 0, type: "discipline", title: "Biologia", name: "biology", children: []},
    ]
}