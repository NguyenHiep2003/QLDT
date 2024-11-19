export function convertDriveUrl(url: string) {
    const drivePattern = /drive.google.com/g;
    if (!drivePattern.test(url)) return url;
    const splitBySlash = url.split('/');
    const id = splitBySlash[splitBySlash.length - 2];
    const splitByFilePrefix = url.split('/file/');
    const baseURL = splitByFilePrefix[0];
    return baseURL + `/uc?id=${id}`;
}
