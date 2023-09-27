import { Link } from 'react-router-dom'

const NotFound = () => {
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
      <h1>404 Error</h1>
      <p>The page you are looking for does not exist</p>
      <p>
        <Link to={redirectUrl} style={{ color: 'white' }}>
          Click here to go to your home page
        </Link>
      </p>
    </div>
  )
}

export default NotFound
