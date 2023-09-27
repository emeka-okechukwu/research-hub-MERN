import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import AdminHeader from '../../components/Header/AdminHeader'

const ManageGrant = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [grantData, setGrantData] = useState({
    grantName: '',
    currency: '',
    maximumAward: '',
    closingDate: '',
    websiteLink: '',
    grantDescription: '',
  })
  const [missingFields, setMissingFields] = useState(false)
  const [invalidLink, setInvalidLink] = useState(false)
  const [addGrantFailed, setAddGrantFailed] = useState(false)
  const [updateGrantFailed, setUpdateGrantFailed] = useState(false)
  const [deleteGrantFailed, setDeleteGrantFailed] = useState(false)

  useEffect(() => {
    if (id) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/grant/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setGrantData(data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    } else {
      setGrantData({
        grantName: '',
        currency: '',
        maximumAward: '',
        closingDate: '',
        websiteLink: '',
        grantDescription: '',
      })
    }
  }, [id])

  const handleAddGrant = async () => {
    try {
      const userToken = localStorage.getItem('token')
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/

      if (Object.values(grantData).some((value) => value === '')) {
        setMissingFields(true)
        setTimeout(() => {
          setMissingFields(false)
        }, 5000)
        return
      }

      if (!urlRegex.test(grantData.websiteLink)) {
        setInvalidLink(true)
        setTimeout(() => {
          setInvalidLink(false)
        }, 5000)
        return
      }

      const url = `${process.env.REACT_APP_BACKEND_URL}/grant`
      const method = 'POST'
      const response = await addOrUpdateGrant(url, method, grantData, userToken)

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Grant Added.',
          text: "You'll be redirected to the manage grant page.",
          customClass: {
            confirmButton: 'swal-button',
          },
        }).then(() => {
          navigate('/admin-view-grants')
        })
      } else {
        console.error('Failed to add grant')
        setAddGrantFailed(true)
        setTimeout(() => {
          setAddGrantFailed(false)
        }, 5000)
      }
    } catch (error) {
      console.error(error)
      setAddGrantFailed(true)
      setTimeout(() => {
        setAddGrantFailed(false)
      }, 5000)
    }
  }

  const handleUpdateGrant = async () => {
    try {
      const userToken = localStorage.getItem('token')
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/

      if (Object.values(grantData).some((value) => value === '')) {
        setMissingFields(true)
        setTimeout(() => {
          setMissingFields(false)
        }, 5000)
        return
      }

      if (!urlRegex.test(grantData.websiteLink)) {
        setInvalidLink(true)
        setTimeout(() => {
          setInvalidLink(false)
        }, 5000)
        return
      }

      const url = `${process.env.REACT_APP_BACKEND_URL}/grant/${id}`
      const method = 'PUT'
      const response = await addOrUpdateGrant(url, method, grantData, userToken)

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Grant Updated.',
          text: "You'll be redirected to the manage grant page.",
          customClass: {
            confirmButton: 'swal-button',
          },
        }).then(() => {
          navigate('/admin-view-grants')
        })
      } else {
        console.error('Failed to update grant')
        setUpdateGrantFailed(true)
        setTimeout(() => {
          setUpdateGrantFailed(false)
        }, 5000)
      }
    } catch (error) {
      console.error(error)
      setUpdateGrantFailed(true)
      setTimeout(() => {
        setUpdateGrantFailed(false)
      }, 5000)
    }
  }

  const addOrUpdateGrant = async (
    url: string,
    method: string,
    grantData: any,
    userToken: string | null
  ) => {
    return await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(grantData),
    })
  }

  const handleDeleteGrant = async () => {
    try {
      const userToken = localStorage.getItem('token')

      const willDelete = await Swal.fire({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this grant!',
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
          `${process.env.REACT_APP_BACKEND_URL}/grant/${id}`,
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
            title: 'Grant Deleted.',
            text: "You'll be redirected to the manage grant page.",
            customClass: {
              confirmButton: 'swal-button',
            },
          })
          navigate('/admin-view-grants')
        } else {
          console.error('Failed to delete grant')
          setDeleteGrantFailed(true)
          setTimeout(() => {
            setDeleteGrantFailed(false)
          }, 5000)
        }
      } else {
        await Swal.fire({
          title: 'Your grant was not deleted!',
          icon: 'info',
          customClass: {
            confirmButton: 'swal-button',
          },
        })
      }
    } catch (error) {
      console.error(error)
      setDeleteGrantFailed(true)
      setTimeout(() => {
        setDeleteGrantFailed(false)
      }, 5000)
    }
  }

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target
    if (name === 'maximumAward' && grantData.currency !== 'Other') {
      const parsedValue = parseInt(value.replace(/,/g, ''))
      setGrantData({
        ...grantData,
        [name]: parsedValue.toLocaleString(),
      })
    } else {
      setGrantData({
        ...grantData,
        [name]: value,
      })
    }
  }

  return (
    <div>
      <AdminHeader />
      <div className='container mt-1'>
        <h2 style={{ color: '#923D41' }}>
          <span className='fa fa-hand-holding-usd'></span>{' '}
          {id ? 'Manage Grant' : 'Add Grant'}
        </h2>
        <br />

        <form>
          <div className='row form-group'>
            <div className='col'>
              <input
                type='text'
                name='grantName'
                value={grantData.grantName}
                onChange={handleChange}
                className='form-control'
                placeholder='Grant Name *'
                id='grantName'
                maxLength={255}
              />
              <small className='form-text text-muted'>grant name</small>
            </div>
          </div>

          <div className='row form-group'>
            <div className='col-md-6 col-12 mb-3 mb-md-0'>
              <select
                name='currency'
                value={grantData.currency}
                onChange={handleChange}
                className='form-control'
                id='currency'
              >
                <option value='' disabled selected>
                  Select the currency of grant
                </option>
                <option value='USD'>United States Dollar - USD</option>
                <option value='CAD'>Canadian Dollars - CAD</option>
                <option value='£'>Pound Sterling - GBP (£)</option>
                <option value='€'>Euro - EUR (€)</option>
                <option value='Other'>Other</option>
              </select>
              <small className='form-text text-muted'>
                currency - if 'other,' use the format 'Amount - (Currency)' in
                the amount field
              </small>
            </div>
            <div className='col-md-6 col-12'>
              <input
                type='text'
                name='maximumAward'
                value={grantData.maximumAward}
                onChange={handleChange}
                className='form-control'
                placeholder='Maximum Award *'
                id='maximumAward'
                maxLength={255}
              />
              <small className='form-text text-muted'>
                maximum award - enter the amount using commas to separate
                thousands
              </small>
            </div>
          </div>

          <div className='row form-group'>
            <div className='col'>
              <input
                type='datetime-local'
                name='closingDate'
                value={grantData.closingDate}
                onChange={handleChange}
                className='form-control'
                placeholder='Closing Date *'
                id='closingDate'
                maxLength={255}
                min={new Date().toISOString().slice(0, 16)}
              />
              <small className='form-text text-muted'>closing date</small>
            </div>
          </div>

          <div className='row form-group'>
            <div className='col'>
              <input
                type='text'
                name='websiteLink'
                value={grantData.websiteLink}
                onChange={handleChange}
                className='form-control'
                placeholder='Website Link *'
                id='websiteLink'
                maxLength={255}
              />
              <small className='form-text text-muted'>
                website link - hint: you can copy the link directly from your
                browser's address bar
              </small>
            </div>
          </div>

          <div className='row form-group'>
            <div className='col'>
              <textarea
                name='grantDescription'
                value={grantData.grantDescription}
                onChange={handleChange}
                className='form-control'
                placeholder='Grant Description *'
                id='grantDescription'
                rows={5}
                maxLength={255}
              ></textarea>
              <small className='form-text text-muted'>
                (<span id='interestcount'>0 / 255</span>) - write the
                description of the grant
              </small>
            </div>
          </div>

          <div className='container'>
            {id ? (
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
                    {invalidLink && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        Invalid website link
                      </div>
                    )}
                    {updateGrantFailed && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        <strong>Failed to update grant!</strong> Kindly try
                        again or contact developer
                      </div>
                    )}
                    <button
                      type='button'
                      className='btn btn-block btn-info'
                      onClick={handleUpdateGrant}
                    >
                      <span className='fa fa-edit'></span> Update Grant
                    </button>
                  </div>
                  <div className='col'>
                    {deleteGrantFailed && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        <strong>Failed to delete grant!</strong> Kindly try
                        again or contact developer
                      </div>
                    )}
                    <button
                      type='button'
                      className='btn btn-block btn-danger mb-3 mb-md-0'
                      onClick={handleDeleteGrant}
                    >
                      <span className='fa fa-trash'></span> Delete Grant
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
                    {invalidLink && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        Invalid website link
                      </div>
                    )}
                    {addGrantFailed && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        <strong>Failed to add grant!</strong> Kindly try again
                        or contact developer
                      </div>
                    )}
                    <button
                      type='button'
                      className='btn btn-block btn-success'
                      onClick={handleAddGrant}
                    >
                      <span className='fa fa-check-circle'></span> Add Grant
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

export default ManageGrant
