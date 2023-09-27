import React, { useEffect, useState } from 'react'
import { Event } from '../../../types/event'
import EventModal from '../../Modal/EventModal'

const ViewEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/event`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = events.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(events.length / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleCloseModal = () => {
    setSelectedEvent(null)
  }

  return (
    <div className='tab-content container'>
      {' '}
      <br />
      {currentItems.length > 0 ? (
        currentItems.map((event) => (
          <li className='media' key={event._id}>
            <div className='media-left border border-danger rounded-lg'>
              <div className='panel panel-danger text-center date'>
                <div className='panel-heading month bg-warning border-bottom-0 rounded-top text-nowrap'>
                  <span className='panel-title strong'>
                    {new Date(event.eventDate).toLocaleString('default', {
                      month: 'short',
                    })}
                  </span>
                </div>
                <div className='panel-body day text-danger'>
                  {new Date(event.eventDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className='table-responsive'>
              <div className='media-body pl-3'>
                <h4 className='media-heading'>
                  {event.eventName}{' '}
                  <i
                    className='btn-sm btn-secondary action-button view_details'
                    style={{ cursor: 'pointer' }}
                    data-toggle='modal'
                    data-target='#viewDetails'
                    onClick={() => handleEventClick(event)}
                  >
                    View Details
                  </i>{' '}
                </h4>
                <table className='table table-borderless table-sm event-table'>
                  <thead className='thead-light'>
                    <tr>
                      <th>
                        <small>
                          <i className='fas fa-podcast'></i> Type
                        </small>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{event.eventType}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </li>
        ))
      ) : (
        <p>No events here yet</p>
      )}
      <nav>
        <ul className='pagination'>
          {pageNumbers.map((pageNumber) => (
            <li
              key={pageNumber}
              className={`page-item ${
                pageNumber === currentPage ? 'active' : ''
              }`}
            >
              <button
                type='button'
                className='page-link'
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {selectedEvent && (
        <EventModal selectedEvent={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  )
}
export default ViewEvents
