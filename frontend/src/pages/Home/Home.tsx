import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()

  const handleLogin = async (
    email: string,
    password: string,
    userType: string,
    userFirstName: string,
    userLastName: string
  ) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userType}/login`,
        {
          email,
          password,
          firstName: userFirstName,
          lastName: userLastName,
        }
      )
      const token = response.data.token
      const user = jwt_decode(token)
      let redirectUrl = ''
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      if (userType === 'researcher') {
        redirectUrl = '/dashboard'
      } else if (userType === 'admin') {
        redirectUrl = '/admin-dashboard'
      }
      Swal.fire({
        icon: 'success',
        title: 'Login successful!',
        text: `Redirecting to ${userFirstName}'s Dashboard.`,
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate(redirectUrl)
      })
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Login failed!',
        text: 'An error occurred during login.',
        showConfirmButton: true,
      })
    }
  }

  const handleDatabaseReset = async () => {
    try {
      const willReset = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action will clear the database and create a new one. It cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, reset the database',
        cancelButtonText: 'Cancel',
        customClass: {
          confirmButton: 'swal-button',
        },
      })

      if (willReset.isConfirmed) {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/reset`,
          {
            method: 'DELETE',
          }
        )

        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Database Reset Successful',
            text: 'The database has been cleared and recreated. You can now use the application.',
            customClass: {
              confirmButton: 'swal-button',
            },
          })
        } else {
          await Swal.fire({
            title: 'Failed to Reset Database',
            text: 'Please try again later.',
            icon: 'error',
            customClass: {
              confirmButton: 'swal-button',
            },
          })
        }
      } else {
        await Swal.fire({
          title: 'Your database was not resetted!',
          icon: 'info',
          customClass: {
            confirmButton: 'swal-button',
          },
        })
      }
    } catch (error) {
      console.error(error)
      await Swal.fire({
        title: 'Failed to Reset Database',
        text: 'An error occurred while attempting to reset the database. Please try again later.',
        icon: 'error',
        customClass: {
          confirmButton: 'swal-button',
        },
      })
    }
  }

  return (
    <div>
      <div
        className='jumbotron text-center'
        style={{ backgroundColor: '#923D41', color: 'white' }}
      >
        <h1>Research Hub</h1>
      </div>

      <div className='container mt-5'>{/* Just to create space */}</div>

      <div className='container text-center pt-4'>
        <div className='row'>
          <div className='col-sm-3'>
            <h1>
              <i className='fas fa-hands-helping'></i>
            </h1>
            <h3>Support</h3>
            <p>
              We guide you through the research process, from forming your
              research hypothesis to submitting your final publication.
            </p>
          </div>

          <div className='col-sm-3 border-left'>
            <h1>
              <i className='fas fa-users'></i>
            </h1>
            <h3>Collaborate</h3>
            <p>
              Work in teams on your research studies, bringing in diverse
              knowledge and critical thinking crucial to solving challenges.
            </p>
          </div>

          <div className='col-sm-3 border-left'>
            <h1>
              <i className='fas fa-hand-holding-usd'></i>
            </h1>
            <h3>Grants</h3>
            <p>
              Access a comprehensive list of vetted grant organizations that can
              provide funding for your research studies and initiatives.
            </p>
          </div>

          <div className='col-sm-3 border-left'>
            <h1>
              <i className='fas fa-newspaper'></i>
            </h1>
            <h3>Events &amp; News</h3>
            <p>
              Stay continuously informed about upcoming events and stay
              up-to-date with the latest news in your specific area of study.
            </p>
          </div>
        </div>
      </div>

      <div className='container mt-5'>{/* Just to create space */}</div>

      <div className='container text-center'>
        <h3>Select Dashboard</h3>
        <p className='mb-4'>
          Choose a dashboard below to be instantly logged in without entering
          credentials.
        </p>
        <div className='row mb-3'>
          <div className='col'>
            <button
              className='home-btn user-button'
              onClick={() =>
                handleLogin(
                  `${process.env.REACT_APP_RESEARCHER_ONE_EMAIL}`,
                  `${process.env.REACT_APP_RESEARCHER_ONE_PASSWORD}`,
                  'researcher',
                  `${process.env.REACT_APP_RESEARCHER_ONE_FIRST_NAME}`,
                  `${process.env.REACT_APP_RESEARCHER_ONE_LAST_NAME}`
                )
              }
            >
              Researcher 1
            </button>
            <button
              className='home-btn user-button'
              onClick={() =>
                handleLogin(
                  `${process.env.REACT_APP_RESEARCHER_TWO_EMAIL}`,
                  `${process.env.REACT_APP_RESEARCHER_TWO_PASSWORD}`,
                  'researcher',
                  `${process.env.REACT_APP_RESEARCHER_TWO_FIRST_NAME}`,
                  `${process.env.REACT_APP_RESEARCHER_TWO_LAST_NAME}`
                )
              }
            >
              Researcher 2
            </button>
            <button
              className='home-btn admin-button'
              onClick={() =>
                handleLogin(
                  `${process.env.REACT_APP_ADMIN_EMAIL}`,
                  `${process.env.REACT_APP_ADMIN_PASSWORD}`,
                  'admin',
                  `${process.env.REACT_APP_ADMIN_FIRST_NAME}`,
                  `${process.env.REACT_APP_ADMIN_LAST_NAME}`
                )
              }
            >
              Admin User
            </button>
          </div>
        </div>
        <button
          className='btn btn-warning btn-sm mb-3'
          onClick={handleDatabaseReset}
        >
          Reset Database
        </button>
      </div>
    </div>
  )
}

export default Home
