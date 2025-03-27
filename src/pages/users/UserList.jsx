import React from 'react';
import UserListinfo from './UserListInfo';
import config from "../../config";

const UserList = () => {
  return (
    <UserListinfo
    apiUrl="`${config.BaseUrl}/`User/getPaginatedUsers"

        //apiUrl="https://dailysalesapi.skylynxclass.in/api/User/getPaginatedUsers"
    />
    
  );
};
Consol.log(apiUrl);
export default UserList;
