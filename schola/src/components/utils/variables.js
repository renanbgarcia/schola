export const categories = [
    { title: "Atividade", children: []},
    { title: "Exercício", children: []},
    { title: "Livro", children: []},
    { title: "Música", children: []},
    { title: "Vídeo", children: []},
    { title: "Apostila", children: []},
    { title: "Filme", children: []},
]

export const getMaterias = () => {
    return [
        { lessonCount: 0, title: "Matemática", name: "math", children: []},
        { lessonCount: 0, title: "História", name: "history", children: []},
        { lessonCount: 0, title: "Gramática", name: "grammar", children: []},
        { lessonCount: 0, title: "Artes", name: "art", children: []},
        { lessonCount: 0, title: "Inglês", name: "english", children: []},
        { lessonCount: 0, title: "Biologia", name: "biology", children: []},
    ]
}