import { TClass } from '@/types/classes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveClassesLocal(classes: TClass[]) {
    try {
        return await AsyncStorage.setItem('classes', JSON.stringify(classes));
    } catch (error) {
        console.log(
            '🚀 ~ file: class-list.ts:5 ~ saveClassesLocal ~ error:',
            error
        );
    }
}

export async function getClassesCache(): Promise<TClass[] | undefined> {
    try {
        const data = await AsyncStorage.getItem('classes');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.log(
            '🚀 ~ file: class-list.ts:19 ~ getClassesCache ~ error:',
            error
        );
    }
}
