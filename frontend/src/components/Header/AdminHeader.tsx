import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Header.css'

function AdminHeader() {
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
        <Link className='navbar-brand' to='/admin-dashboard'>
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
                isActive('/admin-view-grants') || isActive('/manage-grant')
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
                <i className='fas fa-hand-holding-usd'></i> Grant
              </button>
              <div
                className='dropdown-menu navbar-dark'
                style={{ backgroundColor: '#923D41' }}
              >
                <Link to='/admin-view-grants' className='dropdown-item'>
                  <i className='fas fa-hand-holding-usd'></i> View Grants
                </Link>
                <Link to='/manage-grant' className='dropdown-item'>
                  <i className='fas fa-circle-plus'></i> Add Grant
                </Link>
              </div>
            </li>

            <li
              className={`nav-item dropdown ${
                isActive('/admin-view-bulletin') || isActive('/manage-bulletin')
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
                <i className='fas fa-chalkboard'></i> Bulletin
              </button>
              <div
                className='dropdown-menu navbar-dark'
                style={{ backgroundColor: '#923D41' }}
              >
                <Link to='/admin-view-bulletin' className='dropdown-item'>
                  <i className='fas fa-chalkboard'></i> View Bulletin
                </Link>
                <Link to='/manage-bulletin' className='dropdown-item'>
                  <i className='fas fa-circle-plus'></i> Add to Bulletin
                </Link>
              </div>
            </li>

            <li className={`nav-item ${isActive('/admin-all-researchers')}`}>
              <Link
                className='nav-link'
                to='/admin-all-researchers'
                role='button'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <span>| </span>
                <i className='fas fa-users'></i> All Researchers
              </Link>
            </li>

            <li className={`nav-item ${isActive('/admin-user-profile')}`}>
              <Link
                className='nav-link'
                to='/admin-user-profile'
                role='button'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <span>| </span>
                <i className='fas fa-user'></i> Profile
              </Link>
            </li>

            <li className='nav-item'>
              <button
                type='button'
                className='btn nav-link'
                onClick={handleLogout}
              >
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

export default AdminHeader
