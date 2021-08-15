import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addItem, removeCompletedItems,
  selectEditIndex, selectItems,
  fetchInitialItems
} from './todoSlice';
import { TodoItem } from './TodoItem';
import styles from './Todo.module.css';

export function Todo() {
  const items = useSelector(selectItems);
  const editIndex = useSelector(selectEditIndex);
  const fetchItemsStatus = useSelector((state) => state.todo.fetchItemsStatus);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(null); // 'All': null, 'Completed': true, 'Active': false

  useEffect(() => {
    if (fetchItemsStatus === 'idle') {
      dispatch(fetchInitialItems());
    }
  }, [fetchItemsStatus, dispatch]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <input 
          className={styles.input} 
          onKeyDown={(e) => e.key === 'Enter' && e.target.value && 
            ((t) => {
              dispatch(addItem(t.value));
              t.value = '';
            })(e.target)
          }
          placeholder="What needs to be done?"
        />
      </div>
      <div className={[styles.row, styles.rowInfo].join(' ')} data-filter={filter}>
        View: 
        <span className={[styles.link, styles.filterAllLink].join(' ')} onClick={() => setFilter(null)}>All</span> | 
        <span className={[styles.link, styles.filterActiveLink].join(' ')} onClick={() => setFilter(false)}>Active</span> | 
        <span className={[styles.link, styles.filterCompletedLink].join(' ')} onClick={() => setFilter(true)}>Completed</span>
      </div>
      <div className={[styles.row, styles.rowInfo].join(' ')}>
        <span>
          {items.filter(({ completed }) => completed).length} / {items.length} completed
        </span>
        <span className={styles.link} onClick={() => dispatch(removeCompletedItems())}>
          Clear completed
        </span>
      </div>
      {(filter === null 
        ? items 
        : items.filter((item) => item.completed === filter)
      ).map(({ id }, idx) => <TodoItem key={idx} id={id} editing={id === editIndex} />)}
    </div>
  );
}