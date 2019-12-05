import React from 'react';
import { connect } from 'react-redux';
import  SortableTree from 'react-sortable-tree';
import LessonsFolder from './lessonsFolder';
import firebase from '../../firebase';
import LessonsListf from '../lesson/LessonListf';

class Lessons extends React.Component {

    state = {
        view: 'tree',
        lessons: [],
        disciplineFilter: '',
        ageFilter: '',
        lastDoc: {},
        treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }]
    }

    componentWillMount() {
        let categories = [
            { title: "Atividade", children: []},
            { title: "Exercício", children: []},
            { title: "Livro", children: []},
            { title: "Música", children: []},
            { title: "Vídeo", children: []},
            { title: "Apostila", children: []},
            { title: "Filme", children: []},
        ]

        let baseQ = firebase.firestore().collection(`lessons`).where('author_id', '==', this.props.userObject.uid ).get();
        baseQ.then(snapshot => snapshot.docs.map((doc) => {
                categories.map((cat, index) => {
                    
                    let hasDisc = categories[index].children.filter(disc => disc.title === doc.data().discipline ? true : false )

                    if (cat.title === doc.data().category && hasDisc.length === 0) {
                        categories[index].children.push({title: doc.data().discipline, children: []})
                    }
                    categories[index].children.map((disc, dindex) => {
                        if (disc.title === doc.data().discipline && categories[index].title === doc.data().category) {
                            categories[index].children[dindex].children.push({title: doc.data().title})
                        }
                    })
                })

            }))
            .then(() => {
                this.setState({
                    treeData: categories
                })
            }
        )
    }

    getDescendantCount(node) {
        let count = 0;

        if (node.hasOwnProperty('children')) {
            node.children.map(lv1 => {
                if (lv1.hasOwnProperty('children')) {
                    lv1.children.map(lv2 => {
                        if (lv2.hasOwnProperty('children')) {
                            lv2.children.map(lv3 => {
                                count++
                            })
                        } else {
                            count++
                        }
                    })
                } else {
                    count++
                }
            })
        }
        
        return count
    }

    handleDisciplineFilter(e) {
        this.setState({
            disciplineFilter: e.currentTarget.value
        });
    }

    handleAgeFilter(e) {
        this.setState({
            ageFilter: e.currentTarget.value
        });
    }

    getButtonCount(node) {
    const count = this.getDescendantCount(node);
        if (count > 0) {
            return <button className="child-counter">{count}</button>
        }
    }

    renderLessonsView(ageArray) {
        return this.state.view === 'tree' ?
                // <div className="tree-view-wrapper">
                    <LessonsFolder data={this.state.treeData}/>
                :
                <>
                    <label>Age:</label>
                    <select onChange={(e) => this.handleAgeFilter(e)} id="age-filter">
                        <option value="">Todas</option>
                        { ageArray.map((key, i) => <option value={i + 1}>{i + 1}</option>) }
                    </select>
                    <label>Disciplina:</label>
                    <select onChange={(e) => this.handleDisciplineFilter(e)} id="discipline-filter">
                        <option value="">Todas</option>
                        <option value="grammar">Gramática</option>
                        <option value="english">Inglês</option>
                    </select>
                    <LessonsListf
                        disciplineFilter={this.state.disciplineFilter}
                        ageFilter={this.state.ageFilter}
                    />
                </>
    }

    render() {
        let ageArray = Array.apply(null, Array(18));
        return (
            <div className="home-container">
                <div className="choose-view-bar">
                    <span onClick={() => this.setState({view: 'tree'})}>Árvore</span>
                    <span onClick={() => this.setState({view: 'list'})}>Lista</span>
                </div>
                <div className="lessons-container">
                    {this.renderLessonsView(ageArray)}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    user: store.authReducer.currentUser,
    userObject: store.authReducer.user,
    isLogged: store.authReducer.isLogged
  });

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Lessons)