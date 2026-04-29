import ScrollShowbarComponent from "./ScrollShowbarComponent";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getUserFundings } from "../api/client";

function ProfileComponent(props) {
  const location = useLocation();
  const address = location.state?.address;
  const name = location.state?.name;
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [userFundedProjects, setUserFundedProjects] = useState([]);

  // fetch the projects created by the address passed as parameter
  const getProjectList = useCallback(async () => {
    let res;
    try {
      // fetch the project information from the contract for the address
      let indexList = await props.contract.getCreatorProjects(address);
      res = await props.contract.getProjectsDetail(indexList).then((res) => {
        let tmp = [];
        for (const index in res) {
          let {
            cid,
            creatorName,
            projectDescription,
            projectName,
            creationTime,
            duration,
          } = { ...res[index] };
          tmp.push({
            cid,
            creatorName,
            projectDescription,
            projectName,
            creationTime,
            duration,
            index: Number(indexList[index]),
          });
        }
        return tmp;
      });
    } catch (error) {
      console.log(error);
      alert("Error Fetching data: " + error);
      return;
    }

    let currProjects = [];
    let finishedProjects = [];

    // separating the list of projects on the basis of competion status
    for (const index in res) {
      const currentTime = new Date().getTime() / 1000;
      const remainingTime =
        Number(res[index].creationTime) +
        Number(res[index].duration) -
        currentTime;
      if (remainingTime < 0) {
        finishedProjects.push(res[index]);
      } else {
        currProjects.push(res[index]);
      }
    }
    setOngoingProjects(currProjects);
    setCompletedProjects(finishedProjects);
  }, [address, props.contract]);

  // fetch the list of projects, the user has funded
  const getUserFundingList = useCallback(async () => {
    try {
      const result = await getUserFundings(props.userAddress);
      const fundingList = result.data || [];

      // fundingList contains: [{ projectIndex: number, totalAmount: string }, ...]
      // Now fetch full details for each project
      const fundedProjects = [];
      for (const funding of fundingList) {
        try {
          const projectRes = await props.contract.getProject(funding.projectIndex);
          fundedProjects.push({
            cid: projectRes.cid,
            creatorName: projectRes.creatorName,
            projectDescription: projectRes.projectDescription,
            projectName: projectRes.projectName,
            index: funding.projectIndex,
          });
        } catch (projectError) {
          console.error(`Error fetching project ${funding.projectIndex}:`, projectError);
        }
      }
      setUserFundedProjects(fundedProjects);
    } catch (error) {
      console.error("Failed to fetch user funding list:", error);
      alert("Error fetching user funding list: " + error.message);
    }
  }, [props.userAddress, props.contract]);

  useEffect(() => {
    if (!address) {
      return;
    }
    getProjectList();
  }, [address, getProjectList]);

  useEffect(() => {
    if (address && props.userAddress === address) {
      // only executing if visit own profile
      getUserFundingList();
    }
  }, [address, getUserFundingList, props.userAddress]);

  if (!address) {
    return (
      <div className="noProjects">
        Open a profile from a project or reconnect your wallet to view profile details.
      </div>
    );
  }

  return (
    <div className="profileContainer">
      <div className="profileHeadingContainer">
        <h1>{name || address}</h1>
      </div>
      <div className="profileAddressContainer">
        <h2>{address}</h2>
      </div>
      {ongoingProjects.length ? (
        <div className="projectsContainer">
          <div className="projectList">
            <ScrollShowbarComponent
              recentUploads={ongoingProjects}
              heading={"ONGOING PROJECTS"}
              emptyMessage={"No ongoing projects"}
            />
          </div>
        </div>
      ) : (
        ""
      )}
      {completedProjects.length ? (
        <div className="projectsContainer">
          <div className="projectList">
            <ScrollShowbarComponent
              recentUploads={completedProjects}
              heading={"COMPLETED PROJECTS"}
              emptyMessage={"No completed projects"}
            />
          </div>
        </div>
      ) : (
        ""
      )}
      {address === props.userAddress && userFundedProjects.length ? (
        <div className="projectsContainer">
          <div className="projectList">
            <ScrollShowbarComponent
              recentUploads={userFundedProjects}
              heading={"PROJECTS FUNDED"}
              emptyMessage={"No projects funded yet"}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProfileComponent;
