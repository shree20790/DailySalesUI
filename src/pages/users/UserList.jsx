import React from 'react';
import UserListinfo from './UserListInfo';


const UserList = () => {
  return (
    <UserListinfo
        apiUrl="https://finverse.finoracles.com:8082/api/User/getPaginatedUsers"
    />
  );
};

export default UserList;
