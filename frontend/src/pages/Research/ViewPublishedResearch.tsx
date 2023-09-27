import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../components/Header/Header'
import UserDetails from '../../components/Modal/UserDetails'
import { Research } from '../../types/research'
import { User } from '../../types/user'

interface TeamMember {
  _id: string
  user: User
}

const ViewPublishedResearch = () => {
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
  const [researchLeader, setResearchLeader] = useState<User | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [copiedUserId, setCopiedUserId] = useState<string>('')
  const [isCopied, setIsCopied] = useState<boolean>(false)

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

    fetch(`${process.env.REACT_APP_BACKEND_URL}/research/team/${id}/leader`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResearchLeader(data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })

    fetch(`${process.env.REACT_APP_BACKEND_URL}/research/team/${id}/members`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTeamMembers(data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [id])

  const handleCopyEmail = (userId: string, email: string) => {
    navigator.clipboard.writeText(email)
    setCopiedUserId(userId)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
  }

  return (
    <div>
      <Header />
      <div className='container mt-1'>
        <h2 style={{ color: '#923D41' }}>
          <span className='fa fa-file-alt'></span> Published Research
        </h2>
        <br />

        <ul className='nav nav-tabs'>
          <li className='nav-item'>
            <a className='nav-link active' data-toggle='tab' href='#research'>
              {' '}
              Research Information
            </a>
          </li>
        </ul>
        <br />

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

            <div className='container'>
              {' '}
              <br />
              <div className='table-responsive'>
                <table className='table table-hover table-sm custom-table'>
                  <thead>
                    <tr>
                      <th scope='col'></th>
                      <th scope='col' className='text-nowrap'>
                        Name
                      </th>
                      <th scope='col' className='text-nowrap'>
                        Department
                      </th>
                      <th scope='col' className='text-nowrap'>
                        Rank
                      </th>
                      <th scope='col' className='text-nowrap'></th>
                    </tr>
                  </thead>
                  {researchLeader || teamMembers.length > 0 ? (
                    <tbody>
                      {researchLeader && (
                        <tr>
                          <td width='1%'>
                            <i
                              className='btn fa fa-eye'
                              style={{
                                cursor: 'pointer',
                              }}
                              data-toggle='modal'
                              onClick={() => handleUserClick(researchLeader)}
                              data-target='#viewDetails'
                              id={researchLeader._id}
                            ></i>
                          </td>
                          <td className='text-nowrap'>
                            {researchLeader.firstName} {researchLeader.lastName}{' '}
                            (Leader)
                          </td>
                          <td className='text-nowrap'>
                            {researchLeader.department}
                          </td>
                          <td className='text-nowrap'>{researchLeader.rank}</td>
                          <td className='text-nowrap' width='1%'>
                            <button
                              className='btn btn-light'
                              onClick={() =>
                                handleCopyEmail(
                                  researchLeader._id,
                                  researchLeader.email
                                )
                              }
                            >
                              {copiedUserId === researchLeader._id && isCopied
                                ? 'Copied!'
                                : 'Copy Email'}
                              <i className='btn fa fa-envelope'></i>
                            </button>
                          </td>
                        </tr>
                      )}
                      {teamMembers.map((teamMember) => (
                        <tr key={teamMember._id}>
                          <td width='1%'>
                            <i
                              className='btn fa fa-eye'
                              style={{
                                cursor: 'pointer',
                              }}
                              data-toggle='modal'
                              onClick={() => handleUserClick(teamMember.user)}
                              data-target='#viewDetails'
                              id={teamMember.user._id}
                            ></i>
                          </td>
                          <td className='text-nowrap'>
                            {teamMember.user.firstName}{' '}
                            {teamMember.user.lastName}
                          </td>
                          <td className='text-nowrap'>
                            {teamMember.user.department}
                          </td>
                          <td className='text-nowrap'>
                            {teamMember.user.rank}
                          </td>
                          <td className='text-nowrap' width='1%'>
                            <button
                              className='btn btn-light'
                              onClick={() =>
                                handleCopyEmail(
                                  teamMember.user._id,
                                  teamMember.user.email
                                )
                              }
                            >
                              {copiedUserId === teamMember.user._id && isCopied
                                ? 'Copied!'
                                : 'Copy Email'}
                              <i className='btn fa fa-envelope'></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={4}>
                          There are currently no members on this research team.
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        {selectedUser && (
          <UserDetails selectedUser={selectedUser} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  )
}

export default ViewPublishedResearch
