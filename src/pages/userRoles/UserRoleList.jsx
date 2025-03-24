import React from 'react';
import UserRoleListInfo from './UserRoleListInfo';


const UserRoleList = () => {
  return (
    <UserRoleListInfo
        apiUrl="https://dailysalesapi.skylynxclass.in/api/UserRole/getPaginatedUserRoles"
    />
  );
};

export default UserRoleList;
