import React from 'react';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPlus from '../../components/Icon/IconPlus';
import { Link } from 'react-router-dom';
import ClientInfo from './ClientList';

const Client = () => {
  return (
    <ClientInfo 
        apiUrl="https://dailysales.skylynxtech.com:8082/api/CustomerProfile/getPaginatedCustomerProfiles"
    />
  );
};

export default Client;