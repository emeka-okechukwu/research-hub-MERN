import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../types/user'
import UserDetails from './Modal/UserDetails'

interface Props {
  researchId?: string
}

interface TeamMember {
  _id: string
  user: User
}

const ResearchHelpers: React.FC<Props> = ({ researchId }) => {
  const navigate = useNavigate()
  const [researchLeader, setResearchLeader] = useState<User | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [copiedUserId, setCopiedUserId] = useState<string>('')
  const [isCopied, setIsCopied] = useState<boolean>(false)

  useEffect(() => {
    if (researchId) {
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}/research/team/${researchId}/leader`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setResearchLeader(data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })

      fetch(
        `${process.env.REACT_APP_BACKEND_URL}/research/team/${researchId}/members`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setTeamMembers(data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }
  }, [researchId])

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
      <h3 style={{ color: '#923D41' }}>
        <span className='fa fa-hands-helping'></span> Research Helpers
      </h3>
      <br />

      <ul className='nav nav-tabs'>
        <li className='nav-item'>
          <a className='nav-link active' data-toggle='tab' href='#researchteam'>
            <span className='fa fa-users'></span> Research Team
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link' data-toggle='tab' href='#writingtips'>
            <span className='fas fa-file-pen'></span> Writing Tips
          </a>
        </li>
      </ul>
      <br />

      <div className='tab-content'>
        <div className='container tab-pane active' id='researchteam'>
          <div className='container'>
            {' '}
            <br />
            <div className='d-flex flex-row-reverse'>
              {researchId ? (
                <button
                  type='button'
                  className='btn btn-info'
                  title=''
                  onClick={() => navigate('/invite-researcher')}
                >
                  <i className='fa fa-user-plus'></i> Add To Team
                </button>
              ) : (
                <button
                  type='button'
                  className='btn btn-info'
                  title=''
                  onClick={() => {
                    alert('Please save your research to add team members')
                  }}
                >
                  <i className='fa fa-user-plus'></i> Add To Team
                </button>
              )}
            </div>
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
                {researchLeader && teamMembers.length > 0 ? (
                  <tbody className='tbody'>
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
                          {teamMember.user.firstName} {teamMember.user.lastName}
                        </td>
                        <td className='text-nowrap'>
                          {teamMember.user.department}
                        </td>
                        <td className='text-nowrap'>{teamMember.user.rank}</td>
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
                        Click <b>'Add To Team'</b> to add researchers.
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
        <div className='container tab-pane fade' id='writingtips'>
          <div className='container'>
            <br />
            <h3>Writing a Research Study</h3>
            <br />
            <div id='accordion'>
              <div className='card'>
                <div
                  className='card-header'
                  style={{ backgroundColor: '#923D41' }}
                >
                  <a
                    className='card-link'
                    data-toggle='collapse'
                    href='#collapseOne'
                    style={{ color: 'white' }}
                  >
                    Quisque feugiat nisi vel fermentum varius.
                  </a>
                </div>
                <div
                  id='collapseOne'
                  className='collapse show'
                  data-parent='#accordion'
                >
                  <div className='card-body'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus vehicula venenatis nunc, non porttitor orci auctor
                    in. Morbi iaculis tellus lectus. Mauris consequat lacus
                    arcu, nec gravida metus fringilla vitae. Etiam lectus
                    mauris, laoreet in mi et, ultrices ultrices nisi. Vivamus
                    condimentum metus ac nulla hendrerit, sed commodo lorem
                    posuere. Aliquam elementum bibendum metus. Phasellus iaculis
                    tortor at auctor finibus. Quisque id eleifend nibh. Aenean
                    vitae augue quis ex auctor aliquam aliquam id mi. Curabitur
                    a orci nec massa pretium sagittis. Duis eget accumsan dolor.
                    Nulla lobortis gravida porttitor. Curabitur sed augue in
                    velit venenatis molestie.
                  </div>
                </div>
              </div>

              <div className='card'>
                <div
                  className='card-header'
                  style={{ backgroundColor: '#923D41' }}
                >
                  <a
                    className='collapsed card-link'
                    data-toggle='collapse'
                    href='#collapseTwo'
                    style={{ color: 'white' }}
                  >
                    Praesent convallis finibus massa non.
                  </a>
                </div>
                <div
                  id='collapseTwo'
                  className='collapse'
                  data-parent='#accordion'
                >
                  <div className='card-body'>
                    Fusce ut aliquam enim. Proin a sollicitudin elit. Proin ac
                    imperdiet libero. Quisque vitae sapien mi. Fusce vestibulum
                    elementum lectus ut pellentesque. Class aptent taciti
                    sociosqu ad litora torquent per conubia nostra, per inceptos
                    himenaeos. Nam commodo interdum imperdiet. Aliquam vitae
                    elit sed ipsum consectetur porta. Nam id egestas eros.
                  </div>
                </div>
              </div>

              <div className='card'>
                <div
                  className='card-header'
                  style={{ backgroundColor: '#923D41' }}
                >
                  <a
                    className='collapsed card-link'
                    data-toggle='collapse'
                    href='#collapseThree'
                    style={{ color: 'white' }}
                  >
                    Cras nec libero a velit.
                  </a>
                </div>
                <div
                  id='collapseThree'
                  className='collapse'
                  data-parent='#accordion'
                >
                  <div className='card-body'>
                    Praesent vel eros nec nisi laoreet faucibus. Mauris ligula
                    arcu, tincidunt quis malesuada ut, aliquam ut leo. Nullam
                    nunc velit, sodales rhoncus erat et, ullamcorper sagittis
                    diam. Morbi et libero leo. Donec varius quam et vulputate
                    porttitor. Aliquam tristique vitae enim vitae iaculis. Sed
                    ex odio, posuere ut erat vitae, eleifend commodo velit.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      {selectedUser && (
        <UserDetails selectedUser={selectedUser} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default ResearchHelpers
