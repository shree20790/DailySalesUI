import React from 'react';
import CustomerListInfo from './CustomerListInfo';


const CustomerList = () => {
  return (
    <CustomerListInfo
        apiUrl="https://finverse.finoracles.com:8082/api/CustomerInfo/getPaginatedCustomerInfos"
    />
  );
};

export default CustomerList;
