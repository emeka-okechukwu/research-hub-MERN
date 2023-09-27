import React from 'react'
import Header from '../../components/Header/Header'

const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div>
      <Header />
      <div className='container'>
        <div className='jumbotron'>
          <h1>Welcome to Research Hub</h1>
          <label>
            You are currently logged in as <i>{user.email}</i>
          </label>
          <p>Here are a few things to expect:</p>
          <p>
            <i className='fas fa-check'></i>{' '}
            <a href='/manage-research' style={{ color: '#923D41' }}>
              Step-by-step guide
            </a>{' '}
            from forming your research hypothesis to publishing your research
          </p>
          <p>
            <i className='fas fa-check'></i>{' '}
            <a href='/view-grants' style={{ color: '#923D41' }}>
              View
            </a>{' '}
            and apply to a list of vetted grants
          </p>
          <p>
            <i className='fas fa-check'></i> Stay updated on upcoming events and
            read the latest news on our{' '}
            <a href='/view-bulletin' style={{ color: '#923D41' }}>
              bulletin
            </a>
          </p>
          <p>and much more...</p>
          <p>
            Click{' '}
            <a href='/manage-research' style={{ color: '#923D41' }}>
              'Get Started'
            </a>{' '}
            below to begin your journey to becoming an expert researcher!
          </p>
        </div>

        <div className='row mb-3'>
          <div className='col-xl-3 col-sm-6 py-2'>
            <a href='/manage-research'>
              <div className='card text-white bg-secondary h-100'>
                <div className='card-body bg-secondary'>
                  <div className='rotate'>
                    <i className='fas fa-play fa-3x'></i>
                  </div>
                  <br />
                  <h6 className='text-uppercase'>Get Started</h6>
                </div>
              </div>
            </a>
          </div>
          <div className='col-xl-3 col-sm-6 py-2'>
            <a href='/view-bulletin'>
              <div className='card text-white bg-secondary h-100'>
                <div
                  className='card-body'
                  style={{
                    backgroundColor: '#7B68EE',
                    color: 'white',
                  }}
                >
                  <div className='rotate'>
                    <i className='fas fa-chalkboard fa-3x'></i>
                  </div>
                  <br />
                  <h6 className='text-uppercase'>Bulletin</h6>
                </div>
              </div>
            </a>
          </div>
          <div className='col-xl-3 col-sm-6 py-2'>
            <a href='/view-grants'>
              <div className='card text-white bg-success h-100'>
                <div className='card-body bg-success'>
                  <div className='rotate'>
                    <i className='fas fa-hand-holding-usd fa-3x'></i>
                  </div>
                  <br />
                  <h6 className='text-uppercase'>Grant Opportunities</h6>
                </div>
              </div>
            </a>
          </div>
          <div className='col-xl-3 col-sm-6 py-2'>
            <a href='/user-profile'>
              <div className='card text-white bg-warning h-100'>
                <div className='card-body'>
                  <div className='rotate'>
                    <i className='fas fa-user fa-3x'></i>
                  </div>
                  <br />
                  <h6 className='text-uppercase'>Update Profile</h6>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
