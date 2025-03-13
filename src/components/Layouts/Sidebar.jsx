import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../app/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import logo from "../../assets/dailysaleslogo.png";
import Icon from '../Icon/Icon';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState('');
    const themeConfig = useSelector((state) => state.themeConfig);
    const semidark = useSelector((state) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const staticMenuData = [
        
        {
            id: 'client-list',
            label: 'Client List',
            link: '/clientList',
            subItems: []
        },
        {
            id: 'appointment-list',
            label: 'Appointment List',
            link: '/Appointment',
            subItems: []
        },
        {
            id: 'client-history',
            label: 'Client History',
            link: '/clienthistory',
            subItems: []
        },
        {
            id: 'Appointment-historyreport',
            label: 'Appointment History Report',
            link: '/AppointmentHistoryReport',
            subItems: []
        },
        {
            id: 'PayType-historyreport',
            label: 'PayType History Report',
            link: '/PayTypeHistory',
            subItems: []
        },
        {
            id: 'customer-historyreport',
            label: 'Customer History Report',
            link: '/CustomerHistoryReport',
            subItems: []
        },
    ];

    const renderSubMenu = (subItems) => {
        return subItems.length > 0 && (
          <ul className="sub-menu text-gray-500">
            {subItems.map(subItem => (
              <li key={subItem.id}>
                <NavLink to={subItem.link} className="group">
                  <div className="flex items-center">
                    <span className="ltr:pl-3 rtl:pr-3 text-black group-hover:!text-primary shrink-0 dark:text-[#506690] dark:group-hover:text-white-dark">{subItem.label}</span>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        );
    };

    const renderMenuItems = (items) => {
        return items.map(item => (
          <li key={item.id} className="menu nav-item">
            <NavLink
              to={item.link}
              className={`${currentMenu === item.id ? 'active' : ''} nav-link group w-full`}
              onClick={() => toggleMenu(item.id)}
            >
                <div className="flex items-center">
                  <Icon className='group-hover:!text-primary shrink-0' name={item.icon}></Icon>
                  <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{item.label}</span>
                </div>
                <div className={currentMenu !== item.id ? 'rtl:rotate-90 -rotate-90' : ''}>
                  <IconCaretDown />
                </div>
            </NavLink>
            <AnimateHeight duration={300} height={currentMenu === item.id ? 'auto' : 0}>
              {renderSubMenu(item.subItems)}
            </AnimateHeight>
          </li>
        ));
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul = selector.closest('ul.sub-menu');
            if (ul) {
                let ele = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);
    
    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                          {/* Replace the text with the imsge "Daily Sales" */}
                          {themeConfig.menu=='collapsible-vertical' ? <img className="w-8 ml-[5px] flex-none" src={logo} alt="logo" />:<img className="w-40 ml-[5px] flex-none" src={logo} alt="logo" />}
                        </NavLink>
                        

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            {renderMenuItems(staticMenuData)}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;