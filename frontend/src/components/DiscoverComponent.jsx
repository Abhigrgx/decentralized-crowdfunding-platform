import CategoryComponent from "./CategoryComponent";
import { useEffect, useState } from "react";
import dummyPic from "../assets/pg1.jpg";
import { toPublicGatewayUrl } from "../utils/ipfs";
import { Link, useLocation } from "react-router-dom";
import { getAllProjects as fetchAllProjects } from "../api/client";

export default function DiscoverComponent(props) {
  const location = useLocation();
  const [filter, setFilter] = useState(
    location?.state?.selected >= 0 ? location.state.selected : -1
  );
  const [projects, setProjects] = useState([]);
  const changeFilter = (val) => {
    setFilter(val);
  };
  const getAllProjects = async () => {
    try {
      const result = await fetchAllProjects();
      let res = result.data.map((p, idx) => ({
        amountRaised: Number(p.amountRaised),
        cid: p.cid,
        creatorName: p.creatorName,
        fundingGoal: Number(p.fundingGoal),
        projectDescription: p.projectDescription,
        projectName: p.projectName,
        totalContributors: p.totalContributors,
        index: p.id,
        category: Number(p.category),
      }));

      if (filter !== -1) {
        let tmp = [];
        for (const index in res) {
          if (res[index].category === filter) {
            tmp.push(res[index]);
          }
        }
        res = tmp;
      }

      setProjects(res);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      alert("Failed to load projects: " + err.message);
    }
  };
  const renderCards = () => {
    return projects.map((project, index) => {
      return (
        <Link to="/project" state={{ index: project.index }} key={index}>
          <div className="projectCardWrapper">
            <div className="projectCard">
              <div
                className="cardImg"
                style={{
                  backgroundImage: project.cid
                    ? `url(${toPublicGatewayUrl(project.cid)})`
                    : dummyPic,
                }}
              ></div>
              <div className="cardDetail">
                <div className="cardTitle">{project.projectName}</div>
                <div className="cardDesc">{project.projectDescription}</div>
                <div className="cardAuthor">{project.creatorName}</div>
              </div>
            </div>
          </div>
        </Link>
      );
    });
  };

  useEffect(() => {
    getAllProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <>
      <CategoryComponent
        filter={filter}
        changeCategory={(val) => changeFilter(val)}
      />
      <div className="discoverHeading">Discover</div>
      <div className="discoverContainer">
        {projects.length !== 0 ? (
          renderCards()
        ) : (
          <div className="noProjects">No projects found</div>
        )}
      </div>
    </>
  );
}
