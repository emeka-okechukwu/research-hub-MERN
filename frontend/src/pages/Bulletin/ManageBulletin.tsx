import { useParams } from 'react-router-dom'
import ManageEvent from '../../components/Bulletin/AdminBulletin/ManageEvent'
import ManageNews from '../../components/Bulletin/AdminBulletin/ManageNews'
import AdminHeader from '../../components/Header/AdminHeader'

const ManageBulletin = () => {
  const { eventId, newsId } = useParams()

  const isEventTabActive = !!eventId || !newsId
  const isNewsTabActive = !!newsId

  const headingText = eventId || newsId ? 'Manage Bulletin' : 'Add to Bulletin'
  const eventTabText = eventId ? 'Manage Event' : 'Add Event'
  const newsTabText = newsId ? 'Manage News' : 'Add News'

  return (
    <div>
      <AdminHeader />
      <div className='container mt-1'>
        <h2 style={{ color: '#923D41' }}>
          <span className='fa fa-chalkboard'></span> {headingText}
        </h2>
        <br />

        <ul className='nav nav-tabs'>
          <li className='nav-item'>
            <a
              className={`nav-link ${isEventTabActive ? 'active' : ''}`}
              data-toggle='tab'
              href='#upcomingevents'
            >
              <span className='fa fa-calendar-alt'></span> {eventTabText}
            </a>
          </li>
          <li className='nav-item'>
            <a
              className={`nav-link ${isNewsTabActive ? 'active' : ''}`}
              data-toggle='tab'
              href='#latestnews'
            >
              <span className='fa fa-newspaper'></span> {newsTabText}
            </a>
          </li>
        </ul>

        <div className='tab-content'>
          <br />
          <div
            id='upcomingevents'
            className={`container tab-pane ${
              isEventTabActive ? 'active' : 'fade'
            }`}
          >
            <ManageEvent />
          </div>
          <div
            className={`container tab-pane ${
              isNewsTabActive ? 'active' : 'fade'
            }`}
            id='latestnews'
          >
            <ManageNews />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageBulletin
