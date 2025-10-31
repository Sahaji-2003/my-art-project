import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ProfileSidebar: React.FC = () => {
  const location = useLocation();

  const getActiveClass = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const menuItems = [
    {
      path: '/profile',
      icon: 'bi-person-circle',
      label: 'My Profile',
      description: 'Manage your artist profile'
    },
    {
      path: '/my-purchases',
      icon: 'bi-bag-check',
      label: 'My Purchases',
      description: 'Your order history'
    },
    {
      path: '/password',
      icon: 'bi-shield-lock',
      label: 'Password',
      description: 'Change password'
    },
    {
      path: '/settings',
      icon: 'bi-gear',
      label: 'Settings',
      description: 'Customize preferences'
    }
  ];

  return (
    <aside className="profile-sidebar bg-white rounded-4 shadow-sm" style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <div className="p-3 border-bottom">
        <h5 className="fw-bold mb-1">Account Settings</h5>
        <p className="text-muted small mb-0">Manage your account</p>
      </div>

      <div className="list-group list-group-flush">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`list-group-item list-group-item-action ${getActiveClass(item.path)}`}
          >
            <div className="d-flex align-items-center gap-3">
              <i className={`${item.icon} fs-5`}></i>
              <div className="flex-grow-1">
                <div className="fw-semibold">{item.label}</div>
                <div className="small text-muted">{item.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default ProfileSidebar;

