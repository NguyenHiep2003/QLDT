import React from 'react';
import { ROLES } from '@/constants/Roles';

import { Home } from '@/common/home';

export default function LecturerHomeScreen() {
    return <Home role={ROLES.LECTURER}></Home>;
}
