import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import Header from '../../components/Header/Header'
import ResearchHelpers from '../../components/ResearchHelpers'
import { Research } from '../../types/research'

const ManageResearch = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [researchData, setResearchData] = useState<Research>({
    _id: '',
    researchTopic: '',
    researchProblem: '',
    researchHypothesis: '',
    dataCollectionMethod: '',
    dataFindings: '',
    researchAbstract: '',
    grantInformation: '',
    publication: '',
  })
  const [missingresearchTopic, setMissingresearchTopic] = useState(false)
  const [saveResearchFailed, setSaveResearchFailed] = useState(false)
  const [updateResearchFailed, setUpdateResearchFailed] = useState(false)
  const [deleteResearchFailed, setDeleteResearchFailed] = useState(false)
  const [missingResearchEntry, setMissingResearchEntry] = useState(false)
  const [publishResearchFailed, setPublishResearchFailed] = useState(false)

  useEffect(() => {
    if (id) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/research/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setResearchData(data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    } else {
      setResearchData({
        _id: '',
        researchTopic: '',
        researchProblem: '',
        researchHypothesis: '',
        dataCollectionMethod: '',
        dataFindings: '',
        researchAbstract: '',
        grantInformation: '',
        publication: '',
      })
    }
  }, [id])

  const handleAddResearch = async () => {
    try {
      const userToken = localStorage.getItem('token')

      if (researchData.researchTopic === '') {
        setMissingresearchTopic(true)
        setTimeout(() => {
          setMissingresearchTopic(false)
        }, 5000)
        return
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/research`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(researchData),
        }
      )

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Research Saved.',
          text: "You'll be redirected to your ongoing research page.",
          customClass: {
            confirmButton: 'swal-button',
          },
        }).then(() => {
          navigate('/ongoing-research')
        })
      } else {
        console.error('Failed to save research')
        setSaveResearchFailed(true)
        setTimeout(() => {
          setSaveResearchFailed(false)
        }, 5000)
      }
    } catch (error) {
      console.error(error)
      setSaveResearchFailed(true)
      setTimeout(() => {
        setSaveResearchFailed(false)
      }, 5000)
    }
  }

  const handleUpdateResearch = async () => {
    try {
      const userToken = localStorage.getItem('token')

      if (researchData.researchTopic === '') {
        setMissingresearchTopic(true)
        setTimeout(() => {
          setMissingresearchTopic(false)
        }, 5000)
        return
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/research/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(researchData),
        }
      )

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Research Updated.',
          text: "You'll be redirected to your ongoing research page.",
          customClass: {
            confirmButton: 'swal-button',
          },
        }).then(() => {
          navigate('/ongoing-research')
        })
      } else {
        console.error('Failed to update research')
        setUpdateResearchFailed(true)
        setTimeout(() => {
          setUpdateResearchFailed(false)
        }, 5000)
      }
    } catch (error) {
      console.error(error)
      setUpdateResearchFailed(true)
      setTimeout(() => {
        setUpdateResearchFailed(false)
      }, 5000)
    }
  }

  const handlePublishResearch = async () => {
    try {
      const userToken = localStorage.getItem('token')

      if (
        researchData.researchTopic === '' ||
        researchData.researchProblem === '' ||
        researchData.researchHypothesis === '' ||
        researchData.dataCollectionMethod === '' ||
        researchData.dataFindings === '' ||
        researchData.researchAbstract === '' ||
        researchData.grantInformation === '' ||
        researchData.publication === ''
      ) {
        setMissingResearchEntry(true)
        setTimeout(() => {
          setMissingResearchEntry(false)
        }, 5000)
        return
      }

      const willPublish = await Swal.fire({
        title: 'Are you sure?',
        text: 'Once published, you can no longer private it!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, publish it!',
        cancelButtonText: 'Cancel',
        customClass: {
          confirmButton: 'swal-button',
        },
      })

      if (willPublish.isConfirmed) {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/research/publish/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(researchData),
          }
        )

        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Research Published.',
            text: "You'll be redirected to your published research page.",
            customClass: {
              confirmButton: 'swal-button',
            },
          })
          navigate('/published-research')
        } else {
          console.error('Failed to publish research')
          setPublishResearchFailed(true)
          setTimeout(() => {
            setPublishResearchFailed(false)
          }, 5000)
        }
      } else {
        await Swal.fire({
          title: 'Your research is still private!',
          icon: 'info',
          customClass: {
            confirmButton: 'swal-button',
          },
        })
      }
    } catch (error) {
      console.error(error)
      setPublishResearchFailed(true)
      setTimeout(() => {
        setPublishResearchFailed(false)
      }, 5000)
    }
  }

  const handleDeleteResearch = async () => {
    try {
      const userToken = localStorage.getItem('token')

      const willDelete = await Swal.fire({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this research!',
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
          `${process.env.REACT_APP_BACKEND_URL}/research/${id}`,
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
            title: 'Research Deleted.',
            text: "You'll be redirected to the research list page.",
            customClass: {
              confirmButton: 'swal-button',
            },
          })
          navigate('/ongoing-research')
        } else {
          console.error('Failed to delete research')
          setDeleteResearchFailed(true)
          setTimeout(() => {
            setDeleteResearchFailed(false)
          }, 5000)
        }
      } else {
        await Swal.fire({
          title: 'Your research was not deleted!',
          icon: 'info',
          customClass: {
            confirmButton: 'swal-button',
          },
        })
      }
    } catch (error) {
      console.error(error)
      setDeleteResearchFailed(true)
      setTimeout(() => {
        setDeleteResearchFailed(false)
      }, 5000)
    }
  }

  function copyResearchInviteLinkToClipboard() {
    const inviteLink =
      `${process.env.REACT_APP_FRONTEND_URL}/invitation-to-research/` +
      researchData._id
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        console.log(`Copied ${inviteLink} to clipboard`)
        Swal.fire({
          title: 'Research Invite Link Copied!',
          text: `Your invite link is ${inviteLink}`,
          icon: 'info',
          customClass: {
            confirmButton: 'swal-button',
          },
        })
      })
      .catch((error) =>
        console.error(`Error copying ${inviteLink} to clipboard: ${error}`)
      )
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setResearchData({
      ...researchData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div>
      <Header />
      <div className='container mt-1'>
        <h2 style={{ color: '#923D41' }}>
          <span className='fa fa-cog'></span>{' '}
          {id ? 'Manage Research' : 'Add Research'}
        </h2>
        <br />

        {id && (
          <div className='d-flex flex-row-reverse'>
            <button
              type='button'
              title={id}
              className='btn btn-success btn-sm'
              onClick={copyResearchInviteLinkToClipboard}
              disabled={!id}
            >
              <i className='fa fa-link'></i> Copy Research Invite Link
            </button>
          </div>
        )}
        <br />

        <ul className='nav nav-tabs custom-nav-tabs'>
          <li className='nav-item'>
            <a
              className='nav-link active'
              data-toggle='tab'
              href='#introduction'
            >
              <span className='fa fa-lightbulb'></span> Introduction
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' data-toggle='tab' href='#datacollection'>
              <span className='fa fa-chart-bar'></span> Data Collection
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' data-toggle='tab' href='#abstract'>
              <span className='fa fa-i-cursor'></span> Abstract
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' data-toggle='tab' href='#grant'>
              <span className='fa fa-hand-holding-usd'></span> Grant
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' data-toggle='tab' href='#publication'>
              <span className='fa fa-book'></span> Publication
            </a>
          </li>
        </ul>
        <br />

        <form className='tab-content'>
          <div className='container tab-pane active' id='introduction'>
            <div className='container'>
              <br />
              <div className='row form-group'>
                <div className='col'>
                  <textarea
                    name='researchTopic'
                    value={researchData.researchTopic}
                    onChange={handleChange}
                    className='form-control full-width'
                    placeholder='Research Topic'
                    id='researchTopic'
                    rows={1}
                    maxLength={255}
                  />
                  <small className='form-text text-muted'>
                    (<span id='interestcount'>0 / 255</span>) - write your
                    research topic (a subject or issue you are interested in
                    researching on)
                  </small>
                </div>
              </div>

              <div className='row form-group'>
                <div className='col'>
                  <textarea
                    name='researchProblem'
                    value={researchData.researchProblem}
                    onChange={handleChange}
                    className='form-control'
                    placeholder='Research Problem'
                    id='researchProblem'
                    rows={1}
                    maxLength={255}
                  ></textarea>
                  <small className='form-text text-muted'>
                    (<span id='interestcount'>0 / 255</span>) - write the
                    problem your research aims to address
                  </small>
                </div>
              </div>

              <div className='row form-group'>
                <div className='col'>
                  <textarea
                    name='researchHypothesis'
                    value={researchData.researchHypothesis}
                    onChange={handleChange}
                    className='form-control'
                    placeholder='Research Hypothesis'
                    id='researchHypothesis'
                    rows={2}
                    maxLength={255}
                  ></textarea>
                  <small className='form-text text-muted'>
                    (<span id='interestcount'>0 / 255</span>) - write your clear
                    research hypothesis, for example, 'low-cost airlines are
                    more likely to have delays than premium airlines'
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className='container tab-pane fade' id='datacollection'>
            <div className='container'>
              <br />
              <div className='row form-group'>
                <div className='col'>
                  <textarea
                    name='dataCollectionMethod'
                    value={researchData.dataCollectionMethod}
                    onChange={handleChange}
                    className='form-control'
                    placeholder='Data Collection Method'
                    id='dataCollectionMethod'
                    rows={1}
                    maxLength={255}
                  />
                  <small className='form-text text-muted'>
                    (<span id='interestcount'>0 / 255</span>) - specify which
                    data collection method you will use
                  </small>
                </div>
              </div>

              <div className='row form-group'>
                <div className='col'>
                  <textarea
                    name='dataFindings'
                    value={researchData.dataFindings}
                    onChange={handleChange}
                    className='form-control'
                    placeholder='Data Findings'
                    id='dataFindings'
                    rows={5}
                    maxLength={25500}
                  ></textarea>
                  <small className='form-text text-muted'>
                    (<span id='interestcount'>0 / 25500</span>) - write what you
                    learned newly after collecting such data
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className='container tab-pane fade' id='abstract'>
            <div className='container'>
              <br />
              <div className='row form-group'>
                <div className='col'>
                  <textarea
                    name='researchAbstract'
                    value={researchData.researchAbstract}
                    onChange={handleChange}
                    className='form-control'
                    placeholder='Research Abstract'
                    id='researchAbstract'
                    rows={6}
                    maxLength={25500}
                  ></textarea>
                  <small className='form-text text-muted'>
                    (<span id='interestcount'>0 / 25500</span>) - write an
                    abstract for your research. be sure to touch on 1) the
                    overall purpose of the research and problems; 2) research
                    methodology; 3) major findings and arguments; and 4) a brief
                    conclusion
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className='container tab-pane fade' id='grant'>
            <div className='container'>
              <br />
              <div className='row form-group'>
                <div className='col'>
                  <textarea
                    name='grantInformation'
                    value={researchData.grantInformation}
                    onChange={handleChange}
                    className='form-control'
                    placeholder='Grant Information'
                    id='grantInformation'
                    rows={2}
                    maxLength={500}
                  ></textarea>
                  <small className='form-text text-muted'>
                    (<span id='interestcount'>0 / 500</span>) - write some
                    information about the grant approved for the research, if
                    applicable
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className='container tab-pane fade' id='publication'>
            <div className='container'>
              <br />
              <div className='row form-group'>
                <div className='col'>
                  <textarea
                    name='publication'
                    value={researchData.publication}
                    onChange={handleChange}
                    className='form-control'
                    placeholder='Research Publication'
                    id='publication'
                    rows={2}
                    maxLength={500}
                  ></textarea>
                  <small className='form-text text-muted'>
                    (<span id='interestcount'>0 / 500</span>) - write where your
                    research was published, like a journal for instance
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className='container'>
            <div className='row row-cols-1 row-cols-md-3 g-3 text-center'>
              {id ? (
                <>
                  <div className='col'>
                    {missingresearchTopic && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        Missing research topic
                      </div>
                    )}
                    {updateResearchFailed && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        <strong>Failed to update research!</strong> Kindly try
                        again or contact developer
                      </div>
                    )}
                    <button
                      type='button'
                      onClick={handleUpdateResearch}
                      className='btn btn-block btn-info'
                    >
                      <span className='fa fa-edit'></span> Update Research
                    </button>
                  </div>
                  <div className='col'>
                    {missingResearchEntry && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        Missing required fields. Please fill in all fields to
                        publish
                      </div>
                    )}
                    {publishResearchFailed && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        <strong>Failed to publish research!</strong> Kindly try
                        again or contact developer
                      </div>
                    )}
                    <button
                      type='button'
                      onClick={handlePublishResearch}
                      className='btn btn-block'
                      style={{
                        backgroundColor: '#923D41',
                        color: 'white',
                      }}
                    >
                      <span className='fa fa-upload'></span> Publish Research
                    </button>
                  </div>
                  <div className='col'>
                    {deleteResearchFailed && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        <strong>Failed to delete research!</strong> Kindly try
                        again or contact developer
                      </div>
                    )}
                    <button
                      type='button'
                      onClick={handleDeleteResearch}
                      className='btn btn-block btn-danger'
                    >
                      <span className='fa fa-trash'></span> Delete Research
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className='col-12'></div>
                  <div className='col'>
                    {missingresearchTopic && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        Missing research topic
                      </div>
                    )}
                    {saveResearchFailed && (
                      <div
                        className='alert alert-danger fade show'
                        role='alert'
                        style={{
                          opacity: 0.5,
                          transition: 'opacity 5s ease-out',
                        }}
                      >
                        <strong>Failed to save research!</strong> Kindly try
                        again or contact developer
                      </div>
                    )}
                    <button
                      type='button'
                      onClick={handleAddResearch}
                      className='btn btn-block btn-success'
                    >
                      <span className='fa fa-check-circle'></span> Save Research
                    </button>
                  </div>
                  <div className='col-12'></div>
                </>
              )}
            </div>
          </div>
        </form>

        <br />
        <br />
        <br />
        <ResearchHelpers researchId={id} />
      </div>
    </div>
  )
}

export default ManageResearch
