import React from 'react';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPlus from '../../components/Icon/IconPlus';
import { Link } from 'react-router-dom';
import StaffInfo from './AppointmentList';

const Staff = () => {
  return (
    <StaffInfo 
        apiUrl="https://dailysales.skylynxtech.com:8082/api/StaffInfo/getPaginatedStaffInfos"
    />
  );
};

export default Staff;