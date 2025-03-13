import React from 'react';
import MenuRoleMappingListInfo from './MenuRoleMappingListInfo';
const MenuRoleMappingList = () => {
  return (
    <MenuRoleMappingListInfo
        apiUrl="https://dailysales.skylynxtech.com:8082/api/MenuRoleMapping/getPaginatedMenuRoleMappings"/>
  );
};

export default MenuRoleMappingList ;