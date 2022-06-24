import React, { useState } from 'react';

export default function TodoCreator() {
  const [todoTitle, setTodoTitle] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTodoTitle(e.target.value);
  }

  return (
    <form className='m-2'>
      <div>
        <textarea
          className='form-control'
          value={todoTitle}
          onChange={onChange}
          placeholder='Введите заголовок для карточки'>
        </textarea>
      </div>
    </form>
  )
}
