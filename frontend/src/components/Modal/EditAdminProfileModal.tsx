import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { User } from '../../types/user'

interface Props {
  selectedUser: User | null
  onClose: () => void
}

const EditAdminProfileModal: React.FC<Props> = ({ selectedUser, onClose }) => {
  const [firstName, setFirstName] = useState<string>(
    selectedUser ? selectedUser.firstName : ''
  )
  const [lastName, setLastName] = useState<string>(
    selectedUser ? selectedUser.lastName : ''
  )
  const [invalidFirstName, setInvalidFirstName] = useState<boolean>(false)
  const [invalidLastName, setInvalidLastName] = useState<boolean>(false)
  const [updateProfileFailed, setUpdateProfileFailed] = useState<boolean>(false)

  const modalTitle = selectedUser
    ? `Update ${selectedUser.firstName}'s Profile`
    : 'Update Admin Profile'

  const handleUpdateProfile = async () => {
    try {
      const userToken = localStorage.getItem('token')
      const nameRegex = /^[a-zA-Z\s]*$/

      if (!nameRegex.test(firstName) || firstName === '') {
        setInvalidFirstName(true)
        setTimeout(() => {
          setInvalidFirstName(false)
        }, 5000)
        return
      }

      if (!nameRegex.test(lastName) || lastName === '') {
        setInvalidLastName(true)
        setTimeout(() => {
          setInvalidLastName(false)
        }, 5000)
        return
      }

      const updatedUserProfile = {
        firstName,
        lastName,
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/admin/profile/${selectedUser?._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(updatedUserProfile),
        }
      )

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated.',
          text: 'Your profile has been updated successfully.',
          customClass: {
            confirmButton: 'swal-button',
          },
        }).then(() => {
          window.location.reload()
        })
      } else {
        console.error('Failed to update profile')
        setUpdateProfileFailed(true)
        setTimeout(() => {
          setUpdateProfileFailed(false)
        }, 5000)
      }
    } catch (error) {
      console.error(error)
      setUpdateProfileFailed(true)
      setTimeout(() => {
        setUpdateProfileFailed(false)
      }, 5000)
    }
  }

  return (
    <div
      className='modal fade'
      id='editaUser'
      style={{ display: 'none' }}
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{modalTitle}</h5>
            <button
              type='button'
              className='close'
              data-dismiss='modal'
              aria-label='Close'
              onClick={onClose}
            >
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div className='modal-body'>
            <form>
              <div className='row form-group'>
                <div className='col-md-6 col-12 mb-3 mb-md-0'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='First Name *'
                    name='firstname'
                    id='firstname'
                    maxLength={20}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className='col-md-6 col-12'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Last Name *'
                    name='lastname'
                    id='lastname'
                    maxLength={20}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className='row form-group'>
                <div className='col-md-6 col-12 mb-3 mb-md-0'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='User ID'
                    name='userid'
                    id='userid'
                    value={selectedUser ? selectedUser._id : ''}
                    readOnly
                  />
                  <small>
                    user id: only visible to you &amp; the developer
                  </small>
                </div>
                <div className='col-md-6 col-12'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Email Address *'
                    name='emailaddress'
                    id='emailaddress'
                    maxLength={20}
                    value={selectedUser ? selectedUser.email : ''}
                    readOnly
                  />
                  <small>email address</small>
                </div>
              </div>

              <div className='form-group'>
                {invalidFirstName && (
                  <div
                    className='alert alert-danger fade show'
                    role='alert'
                    style={{
                      opacity: 0.5,
                      transition: 'opacity 5s ease-out',
                    }}
                  >
                    Invalid first name
                  </div>
                )}
                {invalidLastName && (
                  <div
                    className='alert alert-danger fade show'
                    role='alert'
                    style={{
                      opacity: 0.5,
                      transition: 'opacity 5s ease-out',
                    }}
                  >
                    Invalid last name
                  </div>
                )}
                {updateProfileFailed && (
                  <div
                    className='alert alert-danger fade show'
                    role='alert'
                    style={{
                      opacity: 0.5,
                      transition: 'opacity 5s ease-out',
                    }}
                  >
                    <strong>Failed to update profile!</strong> Kindly try again
                    or contact developer
                  </div>
                )}
                <button
                  type='button'
                  className='btn btn-block btn-success'
                  name='updateprofilebutton'
                  id='updateprofilebutton'
                  onClick={handleUpdateProfile}
                >
                  <span className='fa fa-check-circle'></span> Update Profile
                </button>
              </div>
            </form>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-danger'
              data-dismiss='modal'
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditAdminProfileModal
