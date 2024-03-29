import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const SidebarComponent = () => {
  const { notiReportAdmin,countReqPostUseful } = useSelector((state) => state.user);
  console.log("sidebar", notiReportAdmin);
  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      <a
        className="sidebar-brand d-flex align-items-center justify-content-center"
        href="index.html"
      >
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink"></i>
        </div>
        <div className="sidebar-brand-text mx-3">
          SB Admin <sup>2</sup>
        </div>
      </a>

      <hr className="sidebar-divider my-0" />

      <li className="nav-item active">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-green-500 nav-link flex gap-3 bg-blue-300"
              : "nav-link"
          }
          to="/admin/dashboard"
        >
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </NavLink>
      </li>

      <hr className="sidebar-divider" />

      <li className="nav-item">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-green-500 nav-link flex gap-3 bg-blue-300"
              : "nav-link flex gap-3"
          }
          to="/admin/groupuser"
          data-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <span>
            <i className="fa-solid fa-users-rectangle text-white text-2xl inline-block"></i>
          </span>
          <span className="ml-1 text-2xl font-semibold">User group</span>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-green-500 nav-link flex gap-3 bg-blue-300"
              : "nav-link flex gap-3"
          }
          to="/admin/user"
          data-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <span>
            <i className="far fa-user text-white text-2xl inline-block"></i>
          </span>
          <span className="ml-1 text-2xl font-semibold">User</span>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-green-500 nav-link flex gap-3 bg-blue-300"
              : "nav-link flex gap-3"
          }
          to="/admin/post"
          data-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <span>
            <i class="fa-solid fa-palette text-white text-2xl inline-block"></i>
          </span>
          <span className="ml-1 text-2xl font-semibold">Post</span>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-green-500 nav-link flex gap-3 bg-blue-300"
              : "nav-link flex gap-3"
          }
          to="/admin/option_report"
          data-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <span>
            <i class="fa-solid fa-icons text-white text-2xl inline-block"></i>
          </span>
          <span className="ml-1 text-2xl font-semibold">
            Setting Option Report
          </span>
        </NavLink>
      </li>
      <li className="nav-item relative">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-green-500 nav-link flex gap-3 bg-blue-300"
              : "nav-link flex gap-3"
          }
          to="/admin/report"
          data-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <span>
            <i class="fa-regular fa-flag text-white text-2xl inline-block"></i>
          </span>
          <span className="ml-1 text-2xl font-semibold">
            Reports from users
          </span>
        </NavLink>
        {notiReportAdmin > 0 && (
          <span className="absolute text-white w-[30px] flex items-center justify-center h-[30px] font-bold right-[4px] top-[4px] p-1 rounded-full bg-red-500">
            {notiReportAdmin}
          </span>
        )}
      </li>
      <li className="nav-item">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-green-500 nav-link flex gap-3 bg-blue-300"
              : "nav-link flex gap-3"
          }
          to="/admin/cate-profile"
          data-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <span>
            <i class="fa-solid fa-table-list text-white text-2xl inline-block"></i>
          </span>
          <span className="ml-1 text-2xl font-semibold">Introductory List</span>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-green-500 nav-link flex gap-3 bg-blue-300"
              : "nav-link flex gap-3"
          }
          to="/admin/option-profile"
          data-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <span>
            <i class="fa-regular fa-address-card text-white text-2xl inline-block"></i>
          </span>
          <span className="ml-1 text-2xl font-semibold">Intro option</span>
        </NavLink>
      </li>
      <li className="nav-item relative">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-green-500 nav-link flex gap-3 bg-blue-300"
              : "nav-link flex gap-3"
          }
          to="/admin/request-post-useful"
          data-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <span>
            <i class="fa-regular fa-address-card text-white text-2xl inline-block"></i>
          </span>
          <span className="ml-1 text-2xl font-semibold">Request Post Useful</span>
        
        </NavLink>
        {countReqPostUseful > 0 && (
          <span className="absolute text-white w-[30px] flex items-center justify-center h-[30px] font-bold right-[4px] top-[4px] p-1 rounded-full bg-red-500">
            {countReqPostUseful}
          </span>
        )}
      </li>
    </ul>
  );
};

export default SidebarComponent;
