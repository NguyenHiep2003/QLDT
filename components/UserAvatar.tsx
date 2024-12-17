import { convertDriveUrl } from '@/utils/convertDriveUrl';
import { getColor } from '@/utils/getColor';
import { Avatar } from 'react-native-elements';
export function UserAvatar({
    link,
    title,
    id,
    marginRight = 10,
    size = 40,
    borderRadius = 100
}: {
    link?: string;
    title: string;
    id?: string;
    marginRight?: number,
    size?: number;
    borderRadius?: number
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
                    width: size,
                    height: size,
                    marginRight,
                    borderRadius: borderRadius,
                    overflow:'hidden'
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
                    width: size,
                    height: size,
                    marginRight,
                    borderRadius: borderRadius,
                    overflow:'hidden'
                }}
            ></Avatar>
        );
}
