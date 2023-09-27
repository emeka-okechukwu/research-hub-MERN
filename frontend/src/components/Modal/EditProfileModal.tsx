import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { User } from '../../types/user'

interface Props {
  selectedUser: User | null
  onClose: () => void
}

const EditProfileModal: React.FC<Props> = ({ selectedUser, onClose }) => {
  const [firstName, setFirstName] = useState<string>(
    selectedUser ? selectedUser.firstName : ''
  )
  const [lastName, setLastName] = useState<string>(
    selectedUser ? selectedUser.lastName : ''
  )
  const [gender, setGender] = useState<string>(
    selectedUser ? selectedUser.gender : ''
  )
  const [phoneNumber, setPhoneNumber] = useState<string>(
    selectedUser ? selectedUser.phoneNumber : ''
  )
  const [department, setDepartment] = useState<string>(
    selectedUser ? selectedUser.department : ''
  )
  const [rank, setRank] = useState<string>(
    selectedUser ? selectedUser.rank : ''
  )
  const [interestAreas, setInterestAreas] = useState<string>(
    selectedUser ? selectedUser.interestAreas : ''
  )
  const [invalidFirstName, setInvalidFirstName] = useState<boolean>(false)
  const [invalidLastName, setInvalidLastName] = useState<boolean>(false)
  const [invalidPhoneNumber, setInvalidPhoneNumber] = useState<boolean>(false)
  const [updateProfileFailed, setUpdateProfileFailed] = useState<boolean>(false)

  const modalTitle = selectedUser
    ? `Update ${selectedUser.firstName}'s Profile`
    : 'Update Profile'

  const handleUpdateProfile = async () => {
    try {
      const userToken = localStorage.getItem('token')
      const nameRegex = /^[a-zA-Z\s]*$/
      const phoneNumberRegex = /^\d{10}$/

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

      if (phoneNumber !== '' && !phoneNumberRegex.test(phoneNumber)) {
        setInvalidPhoneNumber(true)
        setTimeout(() => {
          setInvalidPhoneNumber(false)
        }, 5000)
        return
      }

      const updatedUserProfile = {
        firstName,
        lastName,
        gender,
        phoneNumber,
        department,
        rank,
        interestAreas,
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/researcher/profile/${selectedUser?._id}`,
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
                  <select
                    className='form-control'
                    name='usergender'
                    id='usergender'
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value='' disabled>
                      Select your gender
                    </option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Other'>Other</option>
                  </select>
                  <small>gender</small>
                </div>
              </div>

              <div className='row form-group'>
                <div className='col-md-6 col-12 mb-3 mb-md-0'>
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
                <div className='col-md-6 col-12'>
                  <input
                    type='text'
                    className='form-control'
                    maxLength={10}
                    placeholder='Phone Number'
                    name='phonenumber'
                    id='phonenumber'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <small>
                    phone number: only visible to you &amp; the developer
                  </small>
                </div>
              </div>

              <div className='row form-group '>
                <div className='col-md-6 col-12 mb-3 mb-md-0'>
                  <select
                    className='form-control'
                    name='userdepartment'
                    id='userdepartment'
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value='' disabled>
                      Select your department
                    </option>
                    <option value='Business Administration'>
                      Business Administration (BA)
                    </option>
                    <option value='Engineering'>Engineering (ENG)</option>
                    <option value='Computer Science'>
                      Computer Science (CS)
                    </option>
                    <option value='Humanities & Social Sciences'>
                      Humanities & Social Sciences (HSS)
                    </option>
                  </select>
                  <small>department</small>
                </div>

                <div className='col-md-6 col-12'>
                  <select
                    className='form-control'
                    name='userrank'
                    id='userrank'
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                  >
                    <option value='' disabled>
                      Select your rank
                    </option>
                    <option value='Adjunct Lecturer'>Adjunct Lecturer</option>
                    <option value='Senior Lecturer'>Senior Lecturer</option>
                    <option value='Assistant Lecturer'>
                      Assistant Lecturer
                    </option>
                    <option value='Associate Professor'>
                      Associate Professor
                    </option>
                    <option value='Professor'>Professor</option>
                  </select>
                  <small>rank</small>
                </div>
              </div>

              <div className='row form-group'>
                <div className='col'>
                  <textarea
                    className='form-control'
                    placeholder='Research Interest, Specialization &amp; Expertise'
                    name='interestareas'
                    id='interestareas'
                    rows={5}
                    maxLength={500}
                    value={interestAreas}
                    onChange={(e) => setInterestAreas(e.target.value)}
                  />
                  <small className='form-text text-muted'>
                    (<span id='interestcount'>0 / 500</span>) - list your
                    interest areas separated by commas, for example: e-commerce,
                    web development, and machine learning
                  </small>
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
                {invalidPhoneNumber && (
                  <div
                    className='alert alert-danger fade show'
                    role='alert'
                    style={{
                      opacity: 0.5,
                      transition: 'opacity 5s ease-out',
                    }}
                  >
                    Invalid phone number - Please enter a 10-digit phone number
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

export default EditProfileModal
