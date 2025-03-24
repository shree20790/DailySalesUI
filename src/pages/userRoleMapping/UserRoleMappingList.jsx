import React from 'react';
import UserRoleMappingListInfo from './UserRoleMappingListInfo';


const UserRoleMappingList = () => {
  return (
    <UserRoleMappingListInfo
        apiUrl="https://dailysalesapi.skylynxclass.in/api/UserRoleMapping/getPaginatedUserRoleMappings"
    />
  );
};

export default UserRoleMappingList;
