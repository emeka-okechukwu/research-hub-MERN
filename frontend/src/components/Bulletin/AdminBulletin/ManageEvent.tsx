import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const ManageEvent = () => {
  const navigate = useNavigate()
  const { eventId } = useParams<{ eventId: string }>()
  const [eventData, setEventData] = useState({
    eventName: '',
    eventDate: '',
    eventType: '',
    eventVenue: '',
    eventContent: '',
  })
  const [missingFields, setMissingFields] = useState(false)
  const [addEventFailed, setAddEventFailed] = useState(false)
  const [updateEventFailed, setUpdateEventFailed] = useState(false)
  const [deleteEventFailed, setDeleteEventFailed] = useState(false)

  useEffect(() => {
    if (eventId) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/event/${eventId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setEventData(data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    } else {
      setEventData({
        eventName: '',
        eventDate: '',
        eventType: '',
        eventVenue: '',
        eventContent: '',
      })
    }
  }, [eventId])

  const handleAddEvent = async () => {
    try {
      const userToken = localStorage.getItem('token')

      if (
        !eventData.eventName ||
        !eventData.eventDate ||
        !eventData.eventType ||
        !eventData.eventVenue ||
        !eventData.eventContent
      ) {
        setMissingFields(true)
        setTimeout(() => {
          setMissingFields(false)
        }, 5000)
        return
      }

      const url = `${process.env.REACT_APP_BACKEND_URL}/event`
      const method = 'POST'
      const response = await addOrUpdateEvent(url, method, eventData, userToken)

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Event Added.',
          text: "You'll be redirected to the manage event page.",
          customClass: {
            confirmButton: 'swal-button',
          },
        }).then(() => {
          navigate('/admin-view-bulletin')
        })
      } else {
        console.error('Failed to add event')
        setAddEventFailed(true)
        setTimeout(() => {
          setAddEventFailed(false)
        }, 5000)
      }
    } catch (error) {
      console.error(error)
      setAddEventFailed(true)
      setTimeout(() => {
        setAddEventFailed(false)
      }, 5000)
    }
  }

  const handleUpdateEvent = async () => {
    try {
      const userToken = localStorage.getItem('token')

      if (
        !eventData.eventName ||
        !eventData.eventDate ||
        !eventData.eventType ||
        !eventData.eventVenue ||
        !eventData.eventContent
      ) {
        setMissingFields(true)
        setTimeout(() => {
          setMissingFields(false)
        }, 5000)
        return
      }

      const url = `${process.env.REACT_APP_BACKEND_URL}/event/${eventId}`
      const method = 'PUT'
      const response = await addOrUpdateEvent(url, method, eventData, userToken)

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Event Updated.',
          text: "You'll be redirected to the manage event page.",
          customClass: {
            confirmButton: 'swal-button',
          },
        }).then(() => {
          navigate('/admin-view-bulletin')
        })
      } else {
        console.error('Failed to update event')
        setUpdateEventFailed(true)
        setTimeout(() => {
          setUpdateEventFailed(false)
        }, 5000)
      }
    } catch (error) {
      console.error(error)
      setUpdateEventFailed(true)
      setTimeout(() => {
        setUpdateEventFailed(false)
      }, 5000)
    }
  }

  const addOrUpdateEvent = async (
    url: string,
    method: string,
    eventData: any,
    userToken: string | null
  ) => {
    return await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(eventData),
    })
  }

  const handleDeleteEvent = async () => {
    try {
      const userToken = localStorage.getItem('token')

      const willDelete = await Swal.fire({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this event!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        customClass: {
          confirmButton: 'swal-button',
        },
      })

      if (willDelete.isConfirmed) {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/event/${eventId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )

        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Event Deleted.',
            text: "You'll be redirected to the manage event page.",
            customClass: {
              confirmButton: 'swal-button',
            },
          })
          navigate('/admin-view-bulletin')
        } else {
          console.error('Failed to delete event')
          setDeleteEventFailed(true)
          setTimeout(() => {
            setDeleteEventFailed(false)
          }, 5000)
        }
      } else {
        await Swal.fire({
          title: 'Your event was not deleted!',
          icon: 'info',
          customClass: {
            confirmButton: 'swal-button',
          },
        })
      }
    } catch (error) {
      console.error(error)
      setDeleteEventFailed(true)
      setTimeout(() => {
        setDeleteEventFailed(false)
      }, 5000)
    }
  }

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setEventData({
      ...eventData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div>
      <div className='container mt-1'>
        <form>
          <div className='row form-group'>
            <div className='col'>
              <input
                type='text'
                name='eventName'
                value={eventData.eventName}
                onChange={handleChange}
                className='form-control'
                placeholder='Event Name *'
                id='eventName'
                maxLength={255}
              />
              <small className='form-text text-muted'>event name</small>
            </div>
          </div>

          <div className='row form-group'>
            <div className='col-md-6 col-12 mb-3 mb-md-0'>
              <input
                type='datetime-local'
                name='eventDate'
                value={eventData.eventDate}
                onChange={handleChange}
                className='form-control'
                placeholder='Event Date and Time *'
                id='eventDate'
                min={new Date().toISOString().slice(0, 16)}
              />

              <small className='form-text text-muted'>
                event date - eastern timezone
              </small>
            </div>
            <div className='col-md-6 col-12'>
              <select
                name='eventType'
                value={eventData.eventType}
                onChange={handleChange}
                className='form-control'
                id='eventType'
              >
                <option value='' disabled selected>
                  Select the event type
                </option>
                <option value='Research Day'>Research Day</option>
                <option value='Research Bootcamp'>Research Bootcamp</option>
                <option value='Research Committee Meetings'>
                  Research Committee Meetings
                </option>
                <option value='Faculty Research Series'>
                  Faculty Research Series
                </option>
                <option value='Research & Intellectual Community'>
                  Research & Intellectual Community
                </option>
              </select>
              <small className='form-text text-muted'>event type</small>
            </div>
          </div>

          <div className='row form-group'>
            <div className='col'>
              <input
                type='text'
                name='eventVenue'
                value={eventData.eventVenue}
                onChange={handleChange}
                className='form-control'
                placeholder='Event Venue *'
                id='eventVenue'
              />
              <small className='form-text text-muted'>event venue</small>
            </div>
          </div>

          <div className='row form-group'>
            <div className='col'>
              <textarea
                name='eventContent'
                value={eventData.eventContent}
                onChange={handleChange}
                className='form-control'
                placeholder='Event Content *'
                id='eventContent'
                rows={2}
                maxLength={255}
              ></textarea>
              <small className='form-text text-muted'>
                (<span id='interestcount'>0 / 255</span>) - write the
                description of the event
              </small>
            </div>
          </div>

          <div className='container'>
            {eventId ? (
              <>
                <div className='row row-cols-1 row-cols-md-2 g-3 text-center'>
                  <div className='col'>
                    {missingFields && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        Missing required fields
                      </div>
                    )}
                    {updateEventFailed && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        <strong>Failed to update event!</strong> Kindly try
                        again or contact developer
                      </div>
                    )}
                    <button
                      type='button'
                      className='btn btn-block btn-info'
                      onClick={handleUpdateEvent}
                    >
                      <span className='fa fa-edit'></span> Update Event
                    </button>
                  </div>
                  <div className='col'>
                    {deleteEventFailed && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        <strong>Failed to delete event!</strong> Kindly try
                        again or contact developer
                      </div>
                    )}
                    <button
                      type='button'
                      className='btn btn-block btn-danger mb-3 mb-md-0'
                      onClick={handleDeleteEvent}
                    >
                      <span className='fa fa-trash'></span> Delete Event
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='row row-cols-1 row-cols-md-3 g-3 text-center'>
                  <div className='col-12'></div>
                  <div className='col'>
                    {missingFields && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        Missing required fields
                      </div>
                    )}
                    {addEventFailed && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        <strong>Failed to add event!</strong> Kindly try again
                        or contact developer
                      </div>
                    )}
                    <button
                      type='button'
                      className='btn btn-block btn-success'
                      onClick={handleAddEvent}
                    >
                      <span className='fa fa-check-circle'></span> Add Event
                    </button>
                  </div>
                  <div className='col-12'></div>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ManageEvent
