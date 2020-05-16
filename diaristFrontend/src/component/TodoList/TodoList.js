import React, { Component } from 'react';
import TodoItemList from './TodoItemList';
import './TodoList.css';
import {notificationError, notificationSuccess} from '../../util/Notification';
import {uploadTodoList, deleteTodoListByTodoid, loadTodoList, checkedTodoList, unCheckedTodoList} from '../../controller/APIController';
class ToDoList extends Component {

  constructor(props){
    super(props)

    this.state = {
      inputValue: '',
      todos: []
    }
    this.uploadTodoList = this.uploadTodoList.bind(this);
    this.deleteTodoListByTodoid= this.deleteTodoListByTodoid.bind(this);
    this.loadTodoList = this.loadTodoList.bind(this);
    this.checkedTodoList = this.checkedTodoList.bind(this);
}

componentDidMount(){
  this.loadTodoList();
}

loadTodoList(){
  loadTodoList(this.props.username)
      .then(res => {
          this.setState({
            todos : res
          });
      })
      .catch(error => {
          console.log(error);
      });
}

uploadTodoList = () => {
  try{
    uploadTodoList(this.props.username, this.state.inputValue)
          .then(res =>{
            notificationSuccess("할일을 등록 하였습니다.") 
                const { todos } = this.state;
                this.setState({
                  inputValue: '',
                  todos: todos.concat(res)
                });
          }).catch(error => {
            notificationError("할일을 등록하는중 문제가 발생하였습니다..")                                        
      });

  } catch(error) {
    notificationError(error.message || '다시 시도해주세요..')
  }
}

checkedTodoList = (todoid, checked) => {
  if(checked === 0){
    try{
      checkedTodoList(todoid)
            .then(res =>{
                  notificationSuccess("할일을 완료 하였습니다.")                                          
                  const { todos } = this.state;
                  const index = todos.findIndex(todo => todo.todoid === todoid);
                  const nextTodos = [...todos];
                  nextTodos[index] = res
                  this.setState({
                    inputValue: '',
                    todos: nextTodos
                  });
            }).catch(error => {
              notificationError("작업을 수행하던 중 문제가 발생하였습니다..")                                                                                
        });
  
    } catch(error) {
        notificationError(error.message || '다시 시도해주세요..')
    }
  }
  else
  try{
    unCheckedTodoList(todoid)
          .then(res =>{
                notificationSuccess("작업을 취소합니다.")                                          
                const { todos } = this.state;
                const index = todos.findIndex(todo => todo.todoid === todoid);
                const nextTodos = [...todos];
                nextTodos[index] = res
                this.setState({
                  inputValue: '',
                  todos: nextTodos
                });
          }).catch(error => {
            notificationError("작업을 취소하던 중 문제가 발생하였습니다..")                                                                                
                                         
      });

  } catch(error) {
    notificationError(error.message || '다시 시도해주세요..')
  }
}

deleteTodoListByTodoid = (todoid) => {
  try{
    deleteTodoListByTodoid(parseInt(todoid, 10))
          .then(res => {
            const { todos } = this.state;
              this.setState({
                todoid : null,
                todos: todos.filter(todo => todo.todoid !== todoid)
              });
              notificationSuccess("목록이 정상적으로 삭제 되었습니다.")                                          
          }).catch(error => {
            notificationError("작업을 취소하던 중 문제가 발생하였습니다..")                                                                                
          });
  } catch(error) {
    notificationError(error.message || '다시 시도해주세요..')
  }
}

  handleChange = (e) => {
    this.setState({
      inputValue: e.target.value
    });
  }

  handleKeyPress = (e) => {
    if(e.key === 'Enter') {
      this.uploadTodoList();
    }
  }

  render() {
    const { inputValue: input, todos } = this.state;
    const {
      handleChange,
      uploadTodoList,
      handleKeyPress,
      deleteTodoListByTodoid,
      checkedTodoList
    } = this;

    return (
    <main className="todo-list-template">
        <div className="title">
          할 일
        </div>
        <section className="form-wrapper">
        <div className="form">
            <input value={input} onChange={handleChange} onKeyPress={handleKeyPress}/>
            <div className="create-button" onClick={uploadTodoList}>
            추가
            </div>
        </div>
        </section>
        <section className="todos-wrapper">
          <TodoItemList todos={todos} onToggle={checkedTodoList} onRemove={deleteTodoListByTodoid}/>
        </section>
      </main>
    );
  }
}

export default ToDoList;