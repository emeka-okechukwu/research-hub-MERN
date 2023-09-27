import ViewEvents from '../../components/Bulletin/ResearcherBulletin/ViewEvents'
import ViewNews from '../../components/Bulletin/ResearcherBulletin/ViewNews'
import Header from '../../components/Header/Header'

const ViewBulletin = () => {
  return (
    <div>
      <Header />
      <div className='container mt-1'>
        <h2 style={{ color: '#923D41' }}>
          <span className='fa fa-chalkboard'></span> View Bulletin
        </h2>
        <br />

        <ul className='nav nav-tabs'>
          <li className='nav-item'>
            <a
              className='nav-link active'
              data-toggle='tab'
              href='#upcomingevents'
            >
              <span className='fa fa-calendar-alt'></span> Upcoming Events
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' data-toggle='tab' href='#latestnews'>
              <span className='fa fa-newspaper'></span> Latest News
            </a>
          </li>
        </ul>

        <div className='tab-content'>
          <br />
          <div className='container tab-pane active' id='upcomingevents'>
            <ViewEvents />
          </div>
          <div className='container tab-pane fade' id='latestnews'>
            <ViewNews />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewBulletin
