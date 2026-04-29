import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import dummyPic from "../assets/pg1.jpg";
import { toPublicGatewayUrl } from "../utils/ipfs";
import CategoryComponent from "./CategoryComponent";
import { getAllProjects } from "../api/client";

const PRECISION = 10 ** 18;

export default function DiscoverComponent() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();
  const filterCategory = location.state?.category ?? null;

  useEffect(() => {
    (async () => {
      try {
        const result = await getAllProjects();
        let res = result.data.map((p) => ({
          amountRaised: Number(p.amountRaised),
          cid: p.cid,
          creatorName: p.creatorName,
          fundingGoal: Number(p.fundingGoal),
          projectDescription: p.projectDescription,
          projectName: p.projectName,
          category: Number(p.category),
          index: p.id,
        }));
        if (filterCategory !== null) res = res.filter((p) => p.category === filterCategory);
        setProjects(res);
      } catch (err) {
        setError("Failed to load projects: " + err.message);
      }
    })();
  }, [filterCategory]);

  return (
    <>
      <CategoryComponent />
      <div className="discoverHeading">Discover Projects</div>
      {error && <div className="error">{error}</div>}
      <div className="discoverContainer">
        {projects.length > 0 ? projects.map((project, idx) => (
          <div className="projectCardWrapper" key={idx}>
            <div className="projectCard">
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
                <div className="progressBarWrapper">
                  <div className="progressBar" style={{
                    width: `${Math.min((project.amountRaised / project.fundingGoal) * 100, 100)}%`
                  }} />
                </div>
              </div>
            </div>
          </div>
        )) : <div className="noProjects">No projects found</div>}
      </div>
    </>
  );
}
