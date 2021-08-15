import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  editItem, removeItem, setEditIndex, toggleItemCompleted,
  selectItems
} from './todoSlice';
import styles from './Todo.module.css';

export function TodoItem({ id, editing }) {
  const dispatch = useDispatch();
  const { completed, title } = useSelector(selectItems).find(
    ({ id: itemId }) => itemId === id
  ) || { completed: false, title: '' };
  const [newTitle, setNewTitle] = useState(title);

  return (
    <div className={[styles.row, styles.rowItem].join(' ')} data-completed={completed}>
      <button
        className={styles.completeButton}
        onClick={() => dispatch(toggleItemCompleted(id))}
      ></button>
      {editing
        ? <input 
          className={styles.input} value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => 
            e.key === 'Enter' 
            ? e.target.value && dispatch(editItem({ text: e.target.value, id }))
            : e.key === 'Escape' && dispatch(setEditIndex(null)) && setNewTitle(title)
          }
          onBlur={() => dispatch(setEditIndex(null)) && setNewTitle(title)}
          placeholder="What needs to be done?"
          autoFocus={true}
        />
        : <span 
          className={styles.value}
          onDoubleClick={() => dispatch(setEditIndex(id))}
        >{ title }</span>
      }
      <button
        className={styles.removeButton}
        onClick={() => dispatch(removeItem(id))}
      ></button>
    </div>
  );
}