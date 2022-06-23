import React from 'react'
import { Link } from 'react-router-dom'

import { homepage } from '../../Routes';

export default function PageHeader() {
  return (
    <header>
      <nav className='navbar navbar-light bg-dark'>
        <div className='container-fluid'>
          <Link to={homepage} className='navbar-brand text-white'>Todo App</Link>
        </div>
      </nav>
    </header>
  )
}
