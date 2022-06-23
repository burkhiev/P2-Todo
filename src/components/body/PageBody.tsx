import React from 'react'

import TodoTable from '../todo/TodoTable'
import table from '../../store/todo/mocks/mockTodoTable';

export default function PageBody() {
  return (
    <div className='container'>
      Body
      <TodoTable tableId={table.tableId}/>
    </div>
  )
}
