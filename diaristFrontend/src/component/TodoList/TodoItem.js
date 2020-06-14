import React, { Component } from 'react';
import './TodoItem.css';

class TodoItem extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.checked !== nextProps.checked;
  }

  render() {
    const { text, checked, todoid, onToggle, onRemove } = this.props;
    return (
      <div className="todo-item" onClick={() => onToggle(todoid, checked)}>
        <div className="remove" onClick={(e) => {
          e.stopPropagation();
          onRemove(todoid)
        }
        }>&times;</div>
        <div className={`todo-text ${checked && 'checked'}`}>
          <div>{text}</div>
        </div>
        { checked === 1 ? checked && (<div className="check-mark">&#x2713;</div>) : null }
      </div>
    );
  }
}

export default TodoItem;