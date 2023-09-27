import React from 'react'
import { Grant } from '../../types/grant'

interface Props {
  selectedGrant: Grant | null
  onClose: () => void
}

const GrantModal: React.FC<Props> = ({ selectedGrant, onClose }) => {
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
            <h5 className='modal-title'>Grant Details</h5>
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
            {selectedGrant && (
              <div>
                <table className='table table-sm table-borderless table-responsive'>
                  <tbody>
                    <tr>
                      <td className='text-nowrap'>
                        <i className='fas fa-trophy'></i>
                        <strong> Grant Name</strong>
                      </td>
                      <td>
                        <i>{selectedGrant.grantName}</i>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <i className='fas fa-circle-info'></i>
                        <strong> Description</strong>
                      </td>
                      <td>
                        <i>{selectedGrant.grantDescription}</i>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <i className='fas fa-money-bill'></i>
                        <strong> Maximum Award</strong>
                      </td>
                      <td>
                        <i>
                          {' '}
                          {selectedGrant.currency !== 'Other'
                            ? selectedGrant.currency +
                              ' ' +
                              selectedGrant.maximumAward
                            : selectedGrant.maximumAward}
                        </i>
                      </td>
                    </tr>

                    <tr>
                      <td className='text-nowrap'>
                        <i className='fas fa-calendar'></i>
                        <strong> Closing Date</strong>
                      </td>
                      <td>
                        <i>
                          {new Date(selectedGrant.closingDate).toLocaleString(
                            'en-US',
                            {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            }
                          )}
                        </i>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <i className='fas fa-link'></i>
                        <strong> More Information</strong>
                      </td>
                      <td>
                        <i>
                          <a
                            href={selectedGrant.websiteLink}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {selectedGrant.websiteLink}
                          </a>
                        </i>
                      </td>
                    </tr>
                  </tbody>
                </table>
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

export default GrantModal
