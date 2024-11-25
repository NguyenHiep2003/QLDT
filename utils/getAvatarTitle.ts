export function getAvatarTitle(name: string) {
    try {
        const split = name.split(/[\s,._-]+/);
        if (split.length == 0) return 'De';
        if (split.length == 1) {
            return split[0][0] + (split[0][1] ? split[0][1] : '');
        } else {
            return split[0][0] + split[1][0];
        }
    } catch (error) {
        return 'De';
    }
}

export function getTitleFromName(name: string) {
    const split = name.split(' ');
    const title = split[0][0] + split[split.length - 1][0];
    return title;
}
