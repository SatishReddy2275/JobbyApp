import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const apiJobStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const failureViewImg =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class Jobs extends Component {
  state = {
    profileData: [],
    jobDetails: [],
    responseSuccess: false,
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiJobStatusConstants.initial,
    checkBoxInputs: [],
    radioInput: '',
    searchInput: '',
  }

  componentDidMount() {
    this.onGetProfileDetails()
    this.onGetJobDetails()
  }

  onGetJobDetails = async () => {
    this.setState({apiJobStatus: apiJobStatusConstants.inProgress})
    const {checkBoxInputs, radioInput, searchInput} = this.state

    const url = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInputs}&minimum_package=${radioInput}&search=${searchInput}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseData = await fetch(url, options)
    if (responseData.ok === true) {
      const fetchedJobData = await responseData.json()

      const updatedJobDetails = fetchedJobData.jobs.map(eachDetails => ({
        jobDescription: eachDetails.job_description,
        id: eachDetails.id,
        companyLogoUrl: eachDetails.company_logo_url,
        title: eachDetails.title,
        employmentType: eachDetails.employment_type,
        location: eachDetails.location,
        rating: eachDetails.rating,
        packagePerAnnum: eachDetails.package_per_annum,
      }))
      this.setState({
        jobDetails: updatedJobDetails,
        apiJobStatus: apiJobStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiJobStatusConstants.failure})
    }
  }

  onGetProfileDetails = async () => {
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responsed = await fetch(url, options)
    if (responsed.ok === true) {
      const fetchedData = [await responsed.json()]
      const updatedData = fetchedData.map(each => ({
        name: each.profile_details.name,
        profileImageUrl: each.profile_details.profile_image_url,
        shortBio: each.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedData,
        responseSuccess: true,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.onGetJobDetails)
  }

  onGetInputOption = event => {
    const {checkBoxInputs} = this.state
    const inputNotInList = checkBoxInputs.filter(
      each => each === event.target.id,
    )
    if (inputNotInList === 0) {
      this.setState(
        prev => ({
          checkBoxInputs: [...prev.checkBoxInputs, event.target.id],
        }),
        this.onGetJobDetails,
      )
    } else {
      const filteredData = checkBoxInputs.filter(
        each => each !== event.target.id,
      )
      this.setState({checkBoxInputs: filteredData}, this.onGetJobDetails)
    }
  }

  onRenderProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]
      return (
        <div className="profiles-container">
          <img src={profileImageUrl} alt="profile" className="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-para">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetryProfile = () => {
    this.onGetProfileDetails()
  }

  onGetProfileFailureView = () => (
    <div className="failure-button-container">
      <button
        className="failure-button"
        type="button"
        onClick={this.onRetryProfile}
      >
        retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRenderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onRenderProfileView()
      case apiStatusConstants.failure:
        return this.onGetProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onRetryJobs = () => {
    this.onGetJobDetails()
  }

  onGetJobsView = () => {
    const {jobDetails} = this.state
    const noJobs = jobDetails.length === 0
    return noJobs ? (
      <div className="noJob-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="noJob-img"
          alt="no jobs"
        />
        <h1 className="noJob-head">No jobs found</h1>
        <p className="noJob-para">
          We could not find any jobs.Try other filters
        </p>
      </div>
    ) : (
      <ul className="ul-jobItem">
        {jobDetails.map(each => (
          <JobItem details={each} key={each.id} />
        ))}
      </ul>
    )
  }

  onGetJobFailureView = () => (
    <div className="failure-img-button-container">
      <img src={failureViewImg} alt="failure view" className="failure-img" />
      <h1 className="failure-head">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        we cannot seem to find the page you are looking for
      </p>
      <div className="jobs-failure-btn-container">
        <button
          type="button"
          className="failure-button"
          onClick={this.onRetryJobs}
        >
          retry
        </button>
      </div>
    </div>
  )

  onRenderJobsStatus = () => {
    const {apiJobStatus} = this.state

    switch (apiJobStatus) {
      case apiJobStatusConstants.success:
        return this.onGetJobsView()
      case apiJobStatusConstants.failure:
        return this.onGetJobFailureView()
      case apiJobStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onGetCheckBoxesView = () => (
    <ul className="checkBox-container">
      {employmentTypesList.map(eachItem => (
        <li className="li-container" key={eachItem.employmentTypeId}>
          <input
            type="checkBox"
            className="input"
            id={eachItem.employmentTypeId}
            onChange={this.onGetInputOption}
          />
          <label className="label" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonsView = () => (
    <ul className="radio-container">
      {salaryRangesList.map(eachItem => (
        <li className="li-container" key={eachItem.salaryRangeId}>
          <input
            className="radio"
            type="radio"
            id={eachItem.salaryRangeId}
            name="option"
            onChange={this.onGetRadioOption}
          />
          <label className="label" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.onGetJobDetails()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.onGetJobDetails()
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="all-container">
          <div className="side-container">
            {this.onRenderProfileStatus()}
            <hr className="hr-line" />
            <h1 className="text">Type of Employment</h1>
            {this.onGetCheckBoxesView()}
            <hr className="hr-line" />
            <h1 className="text">Salary Range</h1>
            {this.onGetRadioButtonsView()}
          </div>
          <div className="job-container">
            <div>
              <input
                type="search"
                className="search-input"
                placeholder="search"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                data-testid="searchButton"
                type="button"
                className="search-buttu"
                onClick={this.onSubmitSearchInput}
              >
                <AiOutlineSearch className="find" />
              </button>
            </div>
            {this.onRenderJobsStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
