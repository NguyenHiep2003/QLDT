const distinguishableColor = [
    '#E57373',
    '#F06292',
    '#D32F2F',
    '#C2185B',
    '#F8BBD0',
    '#D81B60',
    '#F48FB1',
    '#880E4F',
    // Oranges & Yellows
    '#FFB74D',
    '#FF9800',
    '#F57C00',
    '#FFC107',
    '#FFA726',
    '#EF6C00',
    '#FFE082',
    '#FFEB3B',
    // Greens
    '#81C784',
    '#66BB6A',
    '#43A047',
    '#2E7D32',
    '#A5D6A7',
    '#4CAF50',
    '#388E3C',
    '#69F0AE',
    // Blues
    '#64B5F6',
    '#2196F3',
    '#1976D2',
    '#0D47A1',
    '#BBDEFB',
    '#1565C0',
    '#1E88E5',
    '#03A9F4',
    // Purples & Violets
    '#BA68C8',
    '#9C27B0',
    '#6A1B9A',
    '#AB47BC',
    '#F3E5F5',
    '#8E24AA',
    '#CE93D8',
    '#4A148C',
    // Neutral Grays
    '#E0E0E0',
    '#BDBDBD',
    '#757575',
    '#424242',
    '#616161',
    '#9E9E9E',
    '#116f73',
    '#212121',
    // Earth Tones
    '#A1887F',
    '#795548',
    '#5D4037',
    '#3E2723',
    '#D7CCC8',
    '#8D6E63',
    '#FFCCBC',
    '#BCAAA4',
    // Bright Colors
    '#FF5722',
    '#00BCD4',
    '#FF4081',
    '#CDDC39',
    '#F50057',
    '#1DE9B6',
    '#00E676',
    '#FFFF00',
];

export function getColor(title: string, id: string) {
    const index = (title.charCodeAt(0) + title.charCodeAt(1) + Number(id)) % 64;
    return distinguishableColor[index];
}
