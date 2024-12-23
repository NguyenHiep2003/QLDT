import { Card } from '@rneui/base';
import { Icon } from '@rneui/themed';
import { ImageSourcePropType } from 'react-native';

export const ServiceCard = ({ name, title }: { name: any; title: string }) => {
    return (
        <Card
            containerStyle={{
                borderColor: 'black',
                borderRadius: 10,
                margin: 5,
                padding: 5,
            }}
        >
            <Card.Title numberOfLines={1}>{title}</Card.Title>
            <Icon name={name} size={70}></Icon>
        </Card>
    );
};
