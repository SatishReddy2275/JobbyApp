import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="home">
    <Header />
    <div className="home-container">
      <div className="content">
        <h1 className="head">Find The Job That Fits Your life</h1>
        <p className="para">
          Millions of people are searching for jobs,salary information,company
          reviews.Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" className="search-button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </div>
)

export default Home
