import { convertDriveUrl } from '@/utils/convertDriveUrl';
import { getColor } from '@/utils/getColor';
import { Avatar } from 'react-native-elements';
export function UserAvatar({
    link,
    title,
    id,
    marginRight = 10
}: {
    link?: string;
    title: string;
    id?: string;
    marginRight?: number
}) {
    if (link)
        return (
            <Avatar
                source={{
                    uri: convertDriveUrl(link),
                }}
                activeOpacity={0.7}
                rounded
                containerStyle={{
                    width: 40,
                    height: 40,
                    marginRight,
                    borderRadius: 100,
                }}
            ></Avatar>
        );
    else if (title || id)
        return (
            <Avatar
                title={title}
                activeOpacity={0.7}
                rounded
                containerStyle={{
                    backgroundColor: `${getColor(
                        title ? title[0] + title[1]: '',
                        id as string
                    )}`,
                    width: 40,
                    height: 40,
                    marginRight,
                    borderRadius: 100,
                }}
            ></Avatar>
        );
}
