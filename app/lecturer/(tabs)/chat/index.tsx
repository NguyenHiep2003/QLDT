import { Chat } from '@/common/chat';
import { ROLES } from '@/constants/Roles';

export default function LecturerChatScreen() {
    return <Chat role={ROLES.LECTURER}></Chat>;
}
