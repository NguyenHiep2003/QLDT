import { Profile } from '@/common/profile';
import { ROLES } from '@/constants/Roles';

export default function StudentProfileScreen() {
    return <Profile role={ROLES.STUDENT}></Profile>;
}
