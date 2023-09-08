import './index.css'
import {BsFillStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {BiEnvelope} from 'react-icons/bi'

const JobItem = props => {
  const {details} = props
  const {
    title,
    location,
    rating,
    companyLogoUrl,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = details

  return (
    <li className="list-container">
      <div className="img-rating">
        <img src={companyLogoUrl} className="imu" alt={title} />
        <div className="details">
          <h1 className="head-1">{title}</h1>
          <div className="rating-container">
            <BsFillStarFill className="star" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>

      <div className="location-internship">
        <div className="loc">
          <div className="location">
            <MdLocationOn className="icon" />
            <p className="para-1">{location}</p>
          </div>

          <div className="location">
            <BiEnvelope className="icon" />
            <p className="para-1">{employmentType}</p>
          </div>
        </div>
        <p className="para-3">{packagePerAnnum}</p>
      </div>

      <hr className="line" />
      <p className="para-2">{jobDescription}</p>
    </li>
  )
}

export default JobItem
