import React from 'react'
import AdminHeader from '../../components/Header/AdminHeader'

const AdminDashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div>
      <AdminHeader />
      <div className='container'>
        <div className='jumbotron'>
          <h1>Welcome to Research Hub</h1>
          <label>
            You are currently logged in as <i>{user.email}</i>
          </label>
          <p>Here are a few things you can do as an admin:</p>
          <p>
            <i className='fas fa-check'></i>{' '}
            <a href='/manage-grant' style={{ color: '#923D41' }}>
              Add
            </a>{' '}
            and{' '}
            <a href='/admin-view-grants' style={{ color: '#923D41' }}>
              manage
            </a>{' '}
            grants
          </p>
          <p>
            <i className='fas fa-check'></i>{' '}
            <a href='/manage-bulletin' style={{ color: '#923D41' }}>
              Add
            </a>{' '}
            and{' '}
            <a href='/admin-view-bulletin' style={{ color: '#923D41' }}>
              manage
            </a>{' '}
            upcoming events and news
          </p>
          <p>
            <i className='fas fa-check'></i>{' '}
            <a href='/admin-all-researchers' style={{ color: '#923D41' }}>
              View
            </a>{' '}
            list of all researchers
          </p>
          <p>
            Click any buttons below to get started in your administrative role!
          </p>
        </div>

        <div className='row mb-3'>
          <div className='col-xl-3 col-sm-6 py-2'>
            <a href='/admin-view-grants'>
              <div className='card text-white bg-success h-100'>
                <div className='card-body bg-success'>
                  <div className='rotate'>
                    <i className='fa fa-hand-holding-usd fa-3x'></i>
                  </div>
                  <br />
                  <h6 className='text-uppercase'>Grant Opportunities</h6>
                </div>
              </div>
            </a>
          </div>
          <div className='col-xl-3 col-sm-6 py-2'>
            <a href='/manage-bulletin'>
              <div className='card text-white bg-secondary h-100'>
                <div
                  className='card-body'
                  style={{
                    backgroundColor: '#7B68EE',
                    color: 'white',
                  }}
                >
                  <div className='rotate'>
                    <i className='fa fa-chalkboard fa-3x'></i>
                  </div>
                  <br />
                  <h6 className='text-uppercase'>Bulletin</h6>
                </div>
              </div>
            </a>
          </div>
          <div className='col-xl-3 col-sm-6 py-2'>
            <a href='/admin-all-researchers'>
              <div className='card text-white bg-info h-100'>
                <div className='card-body bg-info'>
                  <div className='rotate'>
                    <i className='fa fa-users fa-3x'></i>
                  </div>
                  <br />
                  <h6 className='text-uppercase'>All Researchers</h6>
                </div>
              </div>
            </a>
          </div>
          <div className='col-xl-3 col-sm-6 py-2'>
            <a href='/admin-user-profile'>
              <div className='card text-white bg-warning h-100'>
                <div className='card-body'>
                  <div className='rotate'>
                    <i className='fa fa-user fa-3x'></i>
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

export default AdminDashboard
