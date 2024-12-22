import { ConversationSearch } from '@/common/search-chat';
import { ROLES } from '@/constants/Roles';

export default function LecturerSearchScreen() {
    return <ConversationSearch role={ROLES.LECTURER}></ConversationSearch>;
}
