import React from 'react';
import MenuRoleMappingListInfo from './MenuRoleMappingListInfo';
const MenuRoleMappingList = () => {
  return (
    <MenuRoleMappingListInfo
        apiUrl="https://dailysalesapi.skylynxclass.in/api/MenuRoleMapping/getPaginatedMenuRoleMappings"/>
  );
};

export default MenuRoleMappingList ;