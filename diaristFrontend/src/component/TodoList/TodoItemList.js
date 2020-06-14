import React, { Component } from 'react';
import TodoItem from './TodoItem';

class TodoItemList extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.todos !== nextProps.todos;
  }
  
  render() {
    const { todos, onToggle, onRemove } = this.props;
    
    const todoList = todos.map(
      ({todoid, text, checked}) => (
        <TodoItem
          todoid={todoid}
          text={text}
          checked={checked}
          onToggle={onToggle}
          onRemove={onRemove}
          key={todoid}
        />
      )
    );

    return (
      <div>
        {todoList}    
      </div>
    );
  }
}

export default TodoItemList;