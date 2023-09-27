import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <>
      <nav
        className='navbar navbar-expand-md navbar-dark'
        style={{ backgroundColor: '#923D41' }}
      >
        <Link className='navbar-brand' to='/dashboard'>
          Research Hub
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#collapsibleNavbar'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='collapsibleNavbar'>
          <ul className='navbar-nav'>
            <li
              className={`nav-item dropdown ${
                isActive('/manage-research') ||
                isActive('/ongoing-research') ||
                isActive('/published-research') ||
                isActive('/collaborative-research') ||
                isActive('/invite-researcher')
              }`}
            >
              <button
                type='button'
                className='btn nav-link dropdown-toggle'
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <span>| </span>
                <i className='fas fa-tasks'></i> Research Management
              </button>
              <div
                className='dropdown-menu navbar-dark'
                style={{ backgroundColor: '#923D41' }}
              >
                <Link to='/manage-research' className='dropdown-item'>
                  <i className='fas fa-play'></i> Start a New Research
                </Link>
                <Link to='/ongoing-research' className='dropdown-item'>
                  <i className='fas fa-spinner'></i> My Ongoing Research
                </Link>
                <Link to='/published-research' className='dropdown-item'>
                  <i className='fas fa-check-double'></i> My Published Research
                </Link>
                <Link to='/collaborative-research' className='dropdown-item'>
                  <i className='fas fa-user-friends'></i> My Collaborative
                  Research
                </Link>
                <Link to='/invite-researcher' className='dropdown-item'>
                  <i className='fas fa-user-plus'></i> Invite User to Research
                </Link>
              </div>
            </li>

            <li className={`nav-item ${isActive('/view-grants')}`}>
              <Link
                className='nav-link'
                to='/view-grants'
                role='button'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <span>| </span>
                <i className='fas fa-hand-holding-usd'></i> Grants
              </Link>
            </li>

            <li
              className={`nav-item dropdown ${
                isActive('/all-ongoing-research') ||
                isActive('/all-published-research')
              }`}
            >
              <button
                type='button'
                className='btn nav-link dropdown-toggle'
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <span>| </span>
                <i className='fas fa-globe'></i> Public Research
              </button>
              <div
                className='dropdown-menu navbar-dark'
                style={{ backgroundColor: '#923D41' }}
              >
                <Link to='/all-ongoing-research' className='dropdown-item'>
                  <i className='fas fa-spinner'></i> All Ongoing Research
                </Link>
                <Link to='/all-published-research' className='dropdown-item'>
                  <i className='fas fa-book'></i> All Published Research
                </Link>
              </div>
            </li>

            <li className={`nav-item ${isActive('/view-bulletin')}`}>
              <Link
                className='nav-link'
                to='/view-bulletin'
                role='button'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <span>| </span>
                <i className='fas fa-chalkboard'></i> Bulletin
              </Link>
            </li>

            <li className={`nav-item ${isActive('/user-profile')}`}>
              <Link
                className='nav-link'
                to='/user-profile'
                role='button'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <span>| </span>
                <i className='fas fa-user'></i> Profile
              </Link>
            </li>

            <li className='nav-item'>
              <button type='button' className='nav-link' onClick={handleLogout}>
                <span>| </span>
                <i className='fas fa-sign-out-alt'></i>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <br />
    </>
  )
}

export default Header
