import { ConversationSearch } from '@/common/search-chat';
import { ROLES } from '@/constants/Roles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudentSearchScreen() {
    return <ConversationSearch role={ROLES.STUDENT}></ConversationSearch>;
}
