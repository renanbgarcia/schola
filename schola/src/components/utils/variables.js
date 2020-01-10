export const noImagePlaceHolderUrl = "http://4.bp.blogspot.com/-7vZF8swhwNs/U9-regTYTbI/AAAAAAAAAEs/PTca5aWvIFQ/s1600/pattern.jpg";

export const categories = [
    { title: "Atividade", type: "category", name: "activity", children: []},
    { title: "Exercício", type: "category", name: "exercise", children: []},
    { title: "Livro", type: "category", name: "book", children: []},
    { title: "Música", type: "category", name: "music", children: []},
    { title: "Vídeo", type: "category", name: "video", children: []},
    { title: "Apostila", type: "category", name: "booklet", children: []},
    { title: "Filme", type: "category", name: "movie", children: []},
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