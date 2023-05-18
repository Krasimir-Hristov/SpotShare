import React from 'react';
import  ReactDOM  from 'react-dom';

import './SideDrawer.css';

export default function SideDrawer(props) {

    const content = <aside className='side-drawer'>{props.children}</aside>;

    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));

}

