import React from 'react';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPlus from '../../components/Icon/IconPlus';
import { Link } from 'react-router-dom';
import ClientHistoryInfo from './ClientHistoryInfo';

const ClientHistory = () => {
  return (
    <ClientHistoryInfo 
      apiUrl="https://dailysales.skylynxtech.com:8082/api/CustomerHistory/getPaginatedCustomerHistorys"
    />
  );
};

export default ClientHistory;