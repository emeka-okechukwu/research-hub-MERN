import { Link } from 'react-router-dom'

const AccessDenied = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  let redirectUrl = '/'

  if (
    user.email === process.env.REACT_APP_RESEARCHER_ONE_EMAIL ||
    user.email === process.env.REACT_APP_RESEARCHER_TWO_EMAIL
  ) {
    redirectUrl = '/dashboard'
  } else if (user.email === process.env.REACT_APP_ADMIN_EMAIL) {
    redirectUrl = '/admin-dashboard'
  }

  return (
    <div
      className='jumbotron'
      style={{
        textAlign: 'center',
        backgroundColor: '#923D41',
        color: 'white',
      }}
    >
      <h1>403 Error</h1>
      <p>You do not have permission to view this page</p>
      <p>
        <Link to={redirectUrl} style={{ color: 'white' }}>
          Click here to go to your home page
        </Link>
      </p>
    </div>
  )
}

export default AccessDenied
