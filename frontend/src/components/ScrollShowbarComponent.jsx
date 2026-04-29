import { Link } from "react-router-dom";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import dummyPic from "../assets/pg1.jpg";
import { toPublicGatewayUrl } from "../utils/ipfs";

export default function ScrollShowbarComponent({ recentUploads, heading, emptyMessage }) {
  const scroll = (val) => {
    document.getElementsByClassName("recentUploadsContainer")[0].scrollLeft += val;
  };
  return (
    <div className="recentUploads">
      <div className="recentUploadsHeader">
        <div className="recentUploadsHeading">{heading}</div>
        {recentUploads.length > 0 && (
          <div className="scrollButtons">
            <BsArrowLeftCircle className="scrollNavBtn" onClick={() => scroll(-300)} />
            <BsArrowRightCircle className="scrollNavBtn" onClick={() => scroll(300)} />
          </div>
        )}
      </div>
      <div className="recentUploadsContainer">
        {recentUploads.length > 0 ? recentUploads.map((project, index) => (
          <div className="projectCard" key={index}>
            <Link to="/project" state={{ index: project.index }}>
              <div className="cardImgWrapper">
                <div className="cardImg" style={{
                  backgroundImage: project.cid ? `url(${toPublicGatewayUrl(project.cid)})` : `url(${dummyPic})`
                }} />
              </div>
            </Link>
            <div className="cardDetail">
              <div className="cardTitle">
                <Link to="/project" state={{ index: project.index }}>{project.projectName}</Link>
              </div>
              <div className="cardDesc">{project.projectDescription}</div>
              <div className="cardAuthor">{"By " + project.creatorName}</div>
            </div>
          </div>
        )) : <div className="noProjects">{emptyMessage}</div>}
      </div>
    </div>
  );
}
