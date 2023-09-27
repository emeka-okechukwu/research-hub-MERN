import React from 'react'
import defaultUser from '../../assets/face-icon-user.png'
import { User } from '../../types/user'

interface Props {
  selectedUser: User | null
  onClose: () => void
}

const UserDetails: React.FC<Props> = ({ selectedUser, onClose }) => {
  return (
    <div
      className='modal fade'
      id='viewDetails'
      tabIndex={-1}
      role='dialog'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>User Details</h5>
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
            {selectedUser && (
              <div className='media border p-3'>
                <img
                  src={defaultUser}
                  alt={`${selectedUser.firstName}'s profile`}
                  className='mr-3 mt-3 rounded-circle'
                  style={{ width: '60px' }}
                ></img>
                <div className='media-body'>
                  <h4>
                    {selectedUser.firstName} {selectedUser.lastName}
                    <small>
                      {' '}
                      <i>{selectedUser.department}</i>
                    </small>
                  </h4>
                  <p>
                    <strong>Rank</strong>: {selectedUser.rank}
                  </p>
                  <p>
                    <strong>Interests</strong>:
                  </p>
                  <p>{selectedUser.interestAreas}</p>
                </div>
              </div>
            )}
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

export default UserDetails
