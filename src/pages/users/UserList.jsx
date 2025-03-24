import React from 'react';
import UserListinfo from './UserListInfo';


const UserList = () => {
  return (
    <UserListinfo
        apiUrl="https://dailysalesapi.skylynxclass.in/api/User/getPaginatedUsers"
    />
  );
};

export default UserList;
