import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const ManageNews = () => {
  const navigate = useNavigate()
  const { newsId } = useParams<{ newsId: string }>()
  const [newsData, setNewsData] = useState({
    publishedOn: new Date().toLocaleString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }),
    newsTitle: '',
    newsContent: '',
  })
  const [missingFields, setMissingFields] = useState(false)
  const [addNewsFailed, setAddNewsFailed] = useState(false)
  const [updateNewsFailed, setUpdateNewsFailed] = useState(false)
  const [deleteNewsFailed, setDeleteNewsFailed] = useState(false)

  useEffect(() => {
    if (newsId) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/news/${newsId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setNewsData(data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    } else {
      setNewsData({
        publishedOn: new Date().toLocaleString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }),
        newsTitle: '',
        newsContent: '',
      })
    }
  }, [newsId])

  const handleAddNews = async () => {
    try {
      const userToken = localStorage.getItem('token')

      if (
        !newsData.publishedOn ||
        !newsData.newsTitle ||
        !newsData.newsContent
      ) {
        setMissingFields(true)
        setTimeout(() => {
          setMissingFields(false)
        }, 5000)
        return
      }

      const url = `${process.env.REACT_APP_BACKEND_URL}/news`
      const method = 'POST'
      const response = await addOrUpdateNews(url, method, newsData, userToken)

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'News Added.',
          text: "You'll be redirected to the bulletin page.",
          customClass: {
            confirmButton: 'swal-button',
          },
        }).then(() => {
          navigate('/admin-view-bulletin')
        })
      } else {
        console.error('Failed to add news')
        setAddNewsFailed(true)
        setTimeout(() => {
          setAddNewsFailed(false)
        }, 5000)
      }
    } catch (error) {
      console.error(error)
      setAddNewsFailed(true)
      setTimeout(() => {
        setAddNewsFailed(false)
      }, 5000)
    }
  }

  const handleUpdateNews = async () => {
    try {
      const userToken = localStorage.getItem('token')

      if (
        !newsData.publishedOn ||
        !newsData.newsTitle ||
        !newsData.newsContent
      ) {
        setMissingFields(true)
        setTimeout(() => {
          setMissingFields(false)
        }, 5000)
        return
      }

      const url = `${process.env.REACT_APP_BACKEND_URL}/news/${newsId}`
      const method = 'PUT'
      const response = await addOrUpdateNews(url, method, newsData, userToken)

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'News Updated.',
          text: "You'll be redirected to the bulletin page.",
          customClass: {
            confirmButton: 'swal-button',
          },
        }).then(() => {
          navigate('/admin-view-bulletin')
        })
      } else {
        console.error('Failed to update news')
        setUpdateNewsFailed(true)
        setTimeout(() => {
          setUpdateNewsFailed(false)
        }, 5000)
      }
    } catch (error) {
      console.error(error)
      setUpdateNewsFailed(true)
      setTimeout(() => {
        setUpdateNewsFailed(false)
      }, 5000)
    }
  }

  const addOrUpdateNews = async (
    url: string,
    method: string,
    newsData: any,
    userToken: string | null
  ) => {
    return await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(newsData),
    })
  }

  const handleDeleteNews = async () => {
    try {
      const userToken = localStorage.getItem('token')

      const willDelete = await Swal.fire({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this news!',
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
          `${process.env.REACT_APP_BACKEND_URL}/news/${newsId}`,
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
            title: 'News Deleted.',
            text: "You'll be redirected to the bulletin page.",
            customClass: {
              confirmButton: 'swal-button',
            },
          })
          navigate('/admin-view-bulletin')
        } else {
          console.error('Failed to delete news')
          setDeleteNewsFailed(true)
          setTimeout(() => {
            setDeleteNewsFailed(false)
          }, 5000)
        }
      } else {
        await Swal.fire({
          title: 'Your news was not deleted!',
          icon: 'info',
          customClass: {
            confirmButton: 'swal-button',
          },
        })
      }
    } catch (error) {
      console.error(error)
      setDeleteNewsFailed(true)
      setTimeout(() => {
        setDeleteNewsFailed(false)
      }, 5000)
    }
  }

  const handleChange = (
    news: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setNewsData({
      ...newsData,
      [news.target.name]: news.target.value,
    })
  }

  return (
    <div className='container mt-1'>
      <form>
        <div className='row form-group'>
          <div className='col'>
            <input
              type='text'
              name='date'
              value={newsData.publishedOn}
              onChange={handleChange}
              className='form-control'
              placeholder='Date: '
              id='date'
              maxLength={20}
              readOnly
            />
          </div>
        </div>

        <div className='row form-group'>
          <div className='col'>
            <input
              type='text'
              name='newsTitle'
              value={newsData.newsTitle}
              onChange={handleChange}
              className='form-control'
              placeholder='News Title *'
              id='newsTitle'
              maxLength={60}
            />
            <small className='form-text text-muted'>
              (<span id='interestcount'>0 / 60</span>) - news title
            </small>
          </div>
        </div>

        <div className='row form-group'>
          <div className='col'>
            <textarea
              name='newsContent'
              value={newsData.newsContent}
              onChange={handleChange}
              className='form-control'
              placeholder='News Content *'
              id='newsContent'
              rows={5}
            />
            <small className='form-text text-muted'>
              (<span id='interestcount'>0 / ∞</span>) - write the content of
              your news
            </small>
          </div>
        </div>

        <div className='container'>
          {newsId ? (
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
                  {updateNewsFailed && (
                    <div
                      className='alert alert-danger fade show'
                      role='alert'
                      style={{
                        opacity: 0.5,
                        transition: 'opacity 5s ease-out',
                      }}
                    >
                      <strong>Failed to update news!</strong> Kindly try again
                      or contact developer
                    </div>
                  )}
                  <button
                    type='button'
                    className='btn btn-block btn-info'
                    onClick={handleUpdateNews}
                  >
                    <span className='fa fa-edit'></span> Update News
                  </button>
                </div>
                <div className='col'>
                  {deleteNewsFailed && (
                    <div
                      className='alert alert-danger fade show'
                      role='alert'
                      style={{
                        opacity: 0.5,
                        transition: 'opacity 5s ease-out',
                      }}
                    >
                      <strong>Failed to delete news!</strong> Kindly try again
                      or contact developer
                    </div>
                  )}
                  <button
                    type='button'
                    className='btn btn-block btn-danger mb-3 mb-md-0'
                    onClick={handleDeleteNews}
                  >
                    <span className='fa fa-trash'></span> Delete News
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='row row-cols-1 row-cols-md-3 g-3 text-center'>
                <div className='col'></div>
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
                  {addNewsFailed && (
                    <div
                      className='alert alert-danger fade show'
                      role='alert'
                      style={{
                        opacity: 0.5,
                        transition: 'opacity 5s ease-out',
                      }}
                    >
                      <strong>Failed to add news!</strong> Kindly try again or
                      contact developer
                    </div>
                  )}
                  <button
                    type='button'
                    className='btn btn-block btn-success'
                    onClick={handleAddNews}
                  >
                    <span className='fa fa-check-circle'></span> Add News
                  </button>
                </div>
                <div className='col'></div>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

export default ManageNews
