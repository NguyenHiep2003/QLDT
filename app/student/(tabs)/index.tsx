import React from 'react';
import { ROLES } from '@/constants/Roles';

import { Home } from '@/common/home';

export default function StudentHomeScreen() {
    return <Home role={ROLES.STUDENT}></Home>;
}
