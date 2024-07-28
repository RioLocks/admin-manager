import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faPlus, faList, faCog, faClipboardList  } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <h2>Invoice Manager</h2>
      <nav>
        <ul>
          <li>
            <NavLink exact="true" to="/" activeclassname="active">
              <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/add" activeclassname="active">
              <FontAwesomeIcon icon={faPlus} /> Add
            </NavLink>
          </li>
          <li>
            <NavLink to="/todo" activeclassname="active">
              <FontAwesomeIcon icon={faClipboardList} /> To do
            </NavLink>
          </li>
          <li>
            <NavLink to="/list" activeclassname="active">
              <FontAwesomeIcon icon={faList} /> List
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" activeclassname="active">
              <FontAwesomeIcon icon={faCog} /> Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
