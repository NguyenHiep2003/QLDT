import { Card } from '@rneui/base';
import { Icon } from '@rneui/themed';
import { ImageSourcePropType } from 'react-native';

export const ServiceCard = ({
    name,
    title,
}: {
    name: any;
    title: string;
}) => {
    return (
        <Card>
            <Card.Title>{title}</Card.Title>
            <Icon name={name} size={70}></Icon>
        </Card>
    );
};
