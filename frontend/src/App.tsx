import React, { useEffect } from 'react'
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from 'react-router-dom'
import AdminViewBulletin from './pages/Bulletin/AdminViewBulletin'
import ManageBulletin from './pages/Bulletin/ManageBulletin'
import ViewBulletin from './pages/Bulletin/ViewBulletin'
import AdminDashboard from './pages/Dashboard/AdminDashboard'
import Dashboard from './pages/Dashboard/Dashboard'
import AccessDenied from './pages/Errors/AccessDenied'
import NotFound from './pages/Errors/NotFound'
import AdminViewGrants from './pages/Grant/AdminViewGrants'
import ManageGrant from './pages/Grant/ManageGrant'
import ViewGrants from './pages/Grant/ViewGrants'
import Home from './pages/Home/Home'
import AllOngoingResearch from './pages/Research/AllOngoingResearch'
import AllPublishedResearch from './pages/Research/AllPublishedResearch'
import CollaborativeResearch from './pages/Research/CollaborativeResearch'
import InvitationToResearch from './pages/Research/InvitationToResearch'
import ManageCollaborativeResearch from './pages/Research/ManageCollaborativeResearch'
import ManageResearch from './pages/Research/ManageResearch'
import OngoingResearch from './pages/Research/OngoingResearch'
import PublishedResearch from './pages/Research/PublishedResearch'
import ViewPublishedResearch from './pages/Research/ViewPublishedResearch'
import AdminAllResearchers from './pages/Users/AdminAllResearchers'
import AdminUserProfile from './pages/Users/AdminUserProfile'
import InviteResearcher from './pages/Users/InviteResearcher'
import ResearcherProfile from './pages/Users/ResearcherProfile'
import './styles/bootstrap.min.css'

const ResearcherRoute: React.FC<{ component: React.FC; title?: string }> = ({
  component: Component,
  title,
}) => {
  const AuthenticatedComponent: React.FC = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const isResearcher =
      user.email === process.env.REACT_APP_RESEARCHER_ONE_EMAIL ||
      user.email === process.env.REACT_APP_RESEARCHER_TWO_EMAIL

    useEffect(() => {
      if (!token) {
        navigate('/')
      } else if (!isResearcher) {
        navigate('/access-denied')
      }
      document.title = title ? `${title} - Research Hub` : 'Research Hub'
    }, [navigate, token, isResearcher])

    return <Component />
  }

  return <AuthenticatedComponent />
}

const AdminRoute: React.FC<{ component: React.FC; title?: string }> = ({
  component: Component,
  title,
}) => {
  const AuthenticatedComponent: React.FC = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const isAdmin = user.email === process.env.REACT_APP_ADMIN_EMAIL

    useEffect(() => {
      if (!token) {
        navigate('/')
      } else if (!isAdmin) {
        navigate('/access-denied')
      }
      document.title = title ? `${title} - Research Hub` : 'Research Hub'
    }, [navigate, token, isAdmin])

    return <Component />
  }

  return <AuthenticatedComponent />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />

        {/* Researcher Routes */}
        <Route
          path='/dashboard'
          element={<ResearcherRoute component={Dashboard} title='Dashboard' />}
        />
        <Route
          path='/manage-research'
          element={
            <ResearcherRoute
              component={ManageResearch}
              title='Manage Research'
            />
          }
        />

        <Route
          path='/manage-research/:id'
          element={
            <ResearcherRoute
              component={ManageResearch}
              title='Manage Research'
            />
          }
        />
        <Route
          path='/ongoing-research'
          element={
            <ResearcherRoute
              component={OngoingResearch}
              title='Ongoing Research'
            />
          }
        />
        <Route
          path='/invitation-to-research/:id'
          element={
            <ResearcherRoute
              component={InvitationToResearch}
              title='Invitation to Research'
            />
          }
        />
        <Route
          path='/published-research'
          element={
            <ResearcherRoute
              component={PublishedResearch}
              title='Published Research'
            />
          }
        />
        <Route
          path='/view-published-research/:id'
          element={
            <ResearcherRoute
              component={ViewPublishedResearch}
              title='View Published Research'
            />
          }
        />
        <Route
          path='/collaborative-research'
          element={
            <ResearcherRoute
              component={CollaborativeResearch}
              title='Collaborative Research'
            />
          }
        />
        <Route
          path='/manage-collaborative-research'
          element={
            <ResearcherRoute
              component={CollaborativeResearch}
              title='Manage Collaborative Research'
            />
          }
        />
        <Route
          path='/manage-collaborative-research/:id'
          element={
            <ResearcherRoute
              component={ManageCollaborativeResearch}
              title='Manage Collaborative Research'
            />
          }
        />
        <Route
          path='/invite-researcher'
          element={
            <ResearcherRoute
              component={InviteResearcher}
              title='Invite Researcher'
            />
          }
        />
        <Route
          path='/view-grants'
          element={
            <ResearcherRoute component={ViewGrants} title='View Grants' />
          }
        />
        <Route
          path='/all-ongoing-research'
          element={
            <ResearcherRoute
              component={AllOngoingResearch}
              title='All Ongoing Research'
            />
          }
        />
        <Route
          path='/all-published-research'
          element={
            <ResearcherRoute
              component={AllPublishedResearch}
              title='All Published Research'
            />
          }
        />
        <Route
          path='/view-bulletin'
          element={
            <ResearcherRoute component={ViewBulletin} title='View Bulletin' />
          }
        />
        <Route
          path='/user-profile'
          element={
            <ResearcherRoute
              component={ResearcherProfile}
              title='User Profile'
            />
          }
        />

        {/* Administrator Routes */}
        <Route
          path='/admin-dashboard'
          element={
            <AdminRoute component={AdminDashboard} title='Admin Dashboard' />
          }
        />
        <Route
          path='/admin-view-grants'
          element={
            <AdminRoute component={AdminViewGrants} title='Admin View Grants' />
          }
        />
        <Route
          path='/manage-grant'
          element={<AdminRoute component={ManageGrant} title='Manage Grant' />}
        />
        <Route
          path='/manage-grant/:id'
          element={<AdminRoute component={ManageGrant} title='Manage Grant' />}
        />
        <Route
          path='/admin-view-bulletin'
          element={
            <AdminRoute
              component={AdminViewBulletin}
              title='Admin View Bulletin'
            />
          }
        />
        <Route
          path='/manage-bulletin'
          element={
            <AdminRoute component={ManageBulletin} title='Manage Bulletin' />
          }
        />
        <Route
          path='/manage-bulletin/event/:eventId'
          element={
            <AdminRoute component={ManageBulletin} title='Manage Bulletin' />
          }
        />
        <Route
          path='/manage-bulletin/news/:newsId'
          element={
            <AdminRoute component={ManageBulletin} title='Manage Bulletin' />
          }
        />
        <Route
          path='/admin-all-researchers'
          element={
            <AdminRoute
              component={AdminAllResearchers}
              title='Admin All Researchers'
            />
          }
        />
        <Route
          path='/admin-user-profile'
          element={
            <AdminRoute
              component={AdminUserProfile}
              title='Admin User Profile'
            />
          }
        />

        {/* Error Pages */}
        <Route path='/access-denied' element={<AccessDenied />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
