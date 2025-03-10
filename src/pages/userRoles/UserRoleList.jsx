import React from 'react';
import UserRoleListInfo from './UserRoleListInfo';


const UserRoleList = () => {
  return (
    <UserRoleListInfo
        apiUrl="https://finverse.finoracles.com:8082/api/UserRole/getPaginatedUserRoles"
    />
  );
};

export default UserRoleList;
