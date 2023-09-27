import React from 'react'
import { Event } from '../../types/event'

interface Props {
  selectedEvent: Event | null
  onClose: () => void
}

const EventModal: React.FC<Props> = ({ selectedEvent, onClose }) => {
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
            <h5 className='modal-title'>Event Details</h5>
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
            {selectedEvent && (
              <div>
                <table className='table table-sm table-borderless table-responsive'>
                  <tbody>
                    <tr>
                      <td className='text-nowrap'>
                        <i className='fas fa-podcast'></i>
                        <strong> Type</strong>
                      </td>
                      <td>
                        <i>{selectedEvent.eventType}</i>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <i className='fas fa-flag'></i>
                        <strong> Title</strong>
                      </td>
                      <td>
                        <i>{selectedEvent.eventName}</i>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <i className='fas fa-circle-info'></i>
                        <strong> Content</strong>
                      </td>
                      <td>
                        <i>{selectedEvent.eventContent}</i>
                      </td>
                    </tr>

                    <tr>
                      <td className='text-nowrap'>
                        <i className='fas fa-map-marker'></i>
                        <strong> Venue</strong>
                      </td>
                      <td>
                        <i>{selectedEvent.eventVenue}</i>
                      </td>
                    </tr>

                    <tr>
                      <td className='text-nowrap'>
                        <i className='fas fa-calendar'></i>
                        <strong> Event Date</strong>
                      </td>
                      <td>
                        <i>
                          {new Date(selectedEvent.eventDate).toLocaleString(
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

export default EventModal
