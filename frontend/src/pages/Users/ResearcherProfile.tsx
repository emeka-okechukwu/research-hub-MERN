import React, { useEffect, useState } from 'react'
import defaultUser from '../../assets/face-icon-user.png'
import Header from '../../components/Header/Header'
import EditProfileModal from '../../components/Modal/EditProfileModal'
import { User } from '../../types/user'
import './UserProfile.css'

const ResearcherProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/researcher/profile/${
          JSON.parse(localStorage.getItem('user') || '{}').id
        }`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      setUser(data.user)
    }
    fetchUser()
  }, [])

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Header />
      <div className='container mt-1'>
        <h2 style={{ color: '#923D41' }}>
          <span className='fa fa-user'></span> Profile Info
        </h2>
        <div className='row'>
          <div
            className='col-sm-12 border rounded table-responsive-sm'
            style={{ backgroundColor: '#DCDCDC' }}
          >
            <br />
            <table className='table table-sm table-borderless table-responsive'>
              <tbody className='user-profile-tbody'>
                <tr>
                  <td rowSpan={6}>
                    <img
                      src={user.photoUrl || defaultUser}
                      alt='User profile'
                      style={{
                        width: '200px',
                        borderRadius: '50%',
                      }}
                    />
                  </td>
                  <td className='text-nowrap'>
                    <span className='fas fa-user'></span>
                    <strong> First Name: </strong>
                  </td>
                  <td className='text-nowrap'>
                    <i> {user.firstName} </i>
                  </td>
                  <td className='text-nowrap'>
                    <span className='fas fa-user'></span>
                    <strong> Last Name: </strong>
                  </td>
                  <td className='text-nowrap'>
                    <i> {user.lastName} </i>
                  </td>
                </tr>
                <tr>
                  <td className='text-nowrap'>
                    <span className='fas fa-address-card'></span>
                    <strong> ID: </strong>
                  </td>
                  <td className='text-nowrap'>
                    <i>{user._id}</i>
                  </td>
                  <td className='text-nowrap'>
                    <span className='fas fa-child'></span>
                    <strong> Gender: </strong>
                  </td>
                  <td className='text-nowrap'>
                    <i> {user.gender} </i>
                  </td>
                </tr>
                <tr>
                  <td className='text-nowrap'>
                    <span className='fas fa-envelope'></span>
                    <strong> Email: </strong>
                  </td>
                  <td className='text-nowrap'>
                    <i> {user.email} </i>
                  </td>
                  <td className='text-nowrap'>
                    <span className='fas fa-mobile-alt'></span>
                    <strong> Mobile: </strong>
                  </td>
                  <td className='text-nowrap'>
                    <i> {user.phoneNumber} </i>
                  </td>
                </tr>
                <tr>
                  <td className='text-nowrap'>
                    <span className='fas fa-building'></span>
                    <strong> Department: </strong>
                  </td>
                  <td className='text-nowrap'>
                    <i> {user.department} </i>
                  </td>
                  <td className='text-nowrap'>
                    <span className='fas fa-users-cog'></span>
                    <strong> Rank: </strong>
                  </td>
                  <td className='text-nowrap'>
                    <i> {user.rank} </i>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <span className='fas fa-heart'></span>
              <strong> Interest Areas: </strong>
              <i> {user.interestAreas} </i> <br />
              <br />
            </div>
          </div>
        </div>
        <div className='text-center'>
          <br />
          <button
            className='btn btn-secondary mb-3 mb-md-0'
            data-toggle='modal'
            data-target='#editaUser'
            onClick={() => handleUserClick(user)}
          >
            <span className='fas fa-upload'></span> Edit Profile
          </button>
          &nbsp;
          <button
            className='btn btn-secondary mb-3 mb-md-0'
            onClick={() => alert('Feature Not Yet Available')}
          >
            <span className='fas fa-camera'></span> Change Profile Picture
          </button>
        </div>
        {selectedUser && (
          <EditProfileModal
            selectedUser={selectedUser}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  )
}

export default ResearcherProfile
