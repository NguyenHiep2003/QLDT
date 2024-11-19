import { Profile } from '@/common/profile';
import { UnauthorizedDialog } from '@/components/UnauthorizedDialog';
import { ROLES } from '@/constants/Roles';
import { deleteProfile, getProfileLocal } from '@/services/storages/profile';
import { deleteToken } from '@/services/storages/token';
import { TProfile } from '@/types/profile';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar, Text, View, StyleSheet, Image, Button } from 'react-native';
import { Avatar, Dialog, Icon, Input, ListItem } from 'react-native-elements';

export default function LecturerProfileScreen() {
    return <Profile role={ROLES.LECTURER}></Profile>;
}
