import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwtToken')
    history.replace('/login')
  }
  return (
    <nav className="navbar-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        alt="website logo"
        className="img"
      />
      <ul className="items">
        <Link to="/" className="linked">
          <li className="list">Home</li>
        </Link>
        <Link to="/jobs" className="linked">
          <li className="list">Jobs</li>
        </Link>
      </ul>
      <button type="button" className="buttu" onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
