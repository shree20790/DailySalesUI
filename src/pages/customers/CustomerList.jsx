import React from 'react';
import CustomerListInfo from './CustomerListInfo';


const CustomerList = () => {
  return (
    <CustomerListInfo
        apiUrl="https://dailysalesapi.skylynxclass.in/api/CustomerInfo/getPaginatedCustomerInfos"
    />
  );
};

export default CustomerList;
