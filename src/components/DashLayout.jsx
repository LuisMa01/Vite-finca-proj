import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import DashNav from "./DashNav";
import BranchImg from "../images/branch.svg";




const DashLayout = () => {
  

  return (
    <>
      <DashHeader />
      <DashNav />
      

      <div className="main">
        <img src={BranchImg} alt="" className="background-img" />
        <Outlet />
      </div>
    </>
  );
};

export default DashLayout;
