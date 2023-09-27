import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import Header from '../../components/Header/Header'
import { Research } from '../../types/research'

const InvitationToResearch = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [joinResearchFailed, setJoinResearchFailed] = useState(false)
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

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/research/public/${id}`, {
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
  }, [id])

  const handleJoinResearch = async () => {
    try {
      const userToken = localStorage.getItem('token')
      const researchId = researchData._id

      const willJoin = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to join this research?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, join it!',
        cancelButtonText: 'Cancel',
        customClass: {
          confirmButton: 'swal-button',
        },
      })

      if (willJoin.isConfirmed) {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/research/team`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({ researchId }),
          }
        )

        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Joined Research.',
            text: "You'll be redirected to your collaborative research page.",
            customClass: {
              confirmButton: 'swal-button',
            },
          })
          navigate('/collaborative-research')
        } else if (response.status === 409) {
          await Swal.fire({
            title: 'You are already in the team!',
            icon: 'info',
            customClass: {
              confirmButton: 'swal-button',
            },
          })
        } else {
          console.error('Failed to join research')
          setJoinResearchFailed(true)
          setTimeout(() => {
            setJoinResearchFailed(false)
          }, 5000)
        }
      } else {
        await Swal.fire({
          title: 'You did not join the research!',
          icon: 'info',
          customClass: {
            confirmButton: 'swal-button',
          },
        })
      }
    } catch (error) {
      console.error(error)
      setJoinResearchFailed(true)
      setTimeout(() => {
        setJoinResearchFailed(false)
      }, 5000)
    }
  }

  return (
    <div>
      <Header />
      <div className='container mt-1'>
        <div className='row'>
          <div className='col-sm-10'>
            <p
              className='rounded-lg text-center invitation-to-research-banner btn-block'
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
              }}
            >
              You have been invited to join this research. Click{' '}
              <b>Join Research</b> to accept the invitation!
            </p>
          </div>
          <div className='col-sm-2'>
            {joinResearchFailed && (
              <div
                className='alert alert-danger fade collapse'
                id='join_research_failed'
              >
                <strong>Failed to join research!</strong> Kindly try again or
                contact developer
              </div>
            )}

            <button
              type='submit'
              className='btn btn-success'
              name='joinresearchbutton'
              id='joinresearchbutton'
              onClick={handleJoinResearch}
            >
              <span className='fas fa-sign-in-alt'></span> Join Research
            </button>
          </div>
        </div>

        <div className='tab-content'>
          <div className='container tab-pane active' id='research'>
            <form className='tab-content' action='' method='post'>
              <div className='container'>
                <br />
                <h4 style={{ color: '#923D41' }}>
                  <span className='fa fa-lightbulb'></span> Introduction
                </h4>
                <br />

                <div className='row form-group'>
                  <div className='col'>
                    <textarea
                      className='form-control'
                      readOnly
                      value={researchData.researchTopic}
                    ></textarea>
                    <small className='form-text text-muted'>
                      research topic
                    </small>
                  </div>
                </div>

                <div className='row form-group'>
                  <div className='col'>
                    <textarea
                      className='form-control'
                      readOnly
                      value={researchData.researchProblem}
                    ></textarea>
                    <small className='form-text text-muted'>
                      research problem
                    </small>
                  </div>
                </div>

                <div className='row form-group'>
                  <div className='col'>
                    <textarea
                      className='form-control'
                      readOnly
                      value={researchData.researchHypothesis}
                    ></textarea>
                    <small className='form-text text-muted'>
                      research hypothesis
                    </small>
                  </div>
                </div>
                <br />
                <br />

                <h4 style={{ color: '#923D41' }}>
                  <span className='fa fa-chart-bar'></span> Data Collection
                  Method & Analysis
                </h4>
                <br />

                <div className='row form-group'>
                  <div className='col'>
                    <textarea
                      className='form-control'
                      readOnly
                      value={researchData.dataCollectionMethod}
                    ></textarea>
                    <small className='form-text text-muted'>
                      data collection method
                    </small>
                  </div>
                </div>

                <div className='row form-group'>
                  <div className='col'>
                    <textarea
                      className='form-control'
                      readOnly
                      value={researchData.dataFindings}
                    ></textarea>
                    <small className='form-text text-muted'>
                      data analysis
                    </small>
                  </div>
                </div>
                <br />
                <br />

                <h4 style={{ color: '#923D41' }}>
                  <span className='fa fa-i-cursor'></span> Research Abstract
                </h4>
                <br />

                <div className='row form-group'>
                  <div className='col'>
                    <textarea
                      className='form-control'
                      readOnly
                      value={researchData.researchAbstract}
                    ></textarea>
                    <small className='form-text text-muted'>
                      research abstract
                    </small>
                  </div>
                </div>
                <br />
                <br />

                <h4 style={{ color: '#923D41' }}>
                  <span className='fa fa-hand-holding-usd'></span> Grant
                  Information
                </h4>
                <br />

                <div className='row form-group'>
                  <div className='col'>
                    <textarea
                      className='form-control'
                      readOnly
                      value={researchData.grantInformation}
                    ></textarea>
                    <small className='form-text text-muted'>
                      grant information
                    </small>
                  </div>
                </div>
                <br />
                <br />

                <h4 style={{ color: '#923D41' }}>
                  <span className='fa fa-book'></span> Publication
                </h4>
                <br />

                <div className='row form-group'>
                  <div className='col'>
                    <textarea
                      className='form-control'
                      readOnly
                      value={researchData.publication}
                    ></textarea>
                    <small className='form-text text-muted'>publication</small>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <br />
        <br />
      </div>
    </div>
  )
}

export default InvitationToResearch
