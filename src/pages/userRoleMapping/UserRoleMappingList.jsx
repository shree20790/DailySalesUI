import React from 'react';
import UserRoleMappingListInfo from './UserRoleMappingListInfo';


const UserRoleMappingList = () => {
  return (
    <UserRoleMappingListInfo
        apiUrl="https://finverse.finoracles.com:8082/api/UserRoleMapping/getPaginatedUserRoleMappings"
    />
  );
};

export default UserRoleMappingList;
