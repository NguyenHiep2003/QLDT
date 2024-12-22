import { Chat } from '@/common/chat';
import { ROLES } from '@/constants/Roles';

export default function StudentChatScreen() {
    return <Chat role={ROLES.STUDENT}></Chat>;
}
