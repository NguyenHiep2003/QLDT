const distinguishableColor = [
    '#003366', // Dark Blue
    '#000080', // Navy
    '#333333', // Charcoal Gray
    '#4B0082', // Deep Purple
    '#228B22', // Forest Green
    '#DC143C', // Crimson
    '#556B2F', // Olive Green
    '#654321', // Dark Brown
    '#800000', // Maroon
    '#2F4F4F', // Slate Gray
    '#8B0000', // Dark Red
    '#4B0082', // Indigo
    '#800020', // Burgundy
    '#006F6A', // Dark Teal
    '#483D8B', // Dark Slate Blue
    '#FF1493', // Deep Pink
    '#0F52BA', // Sapphire
    '#4169E1', // Royal Blue
    '#5F9EA0', // Cadet Blue
    '#4682B4', // Steel Blue
    '#191970', // Midnight Blue
    '#9932CC', // Dark Orchid
    '#556B2F', // Dark Olive Green
    '#8E4585', // Plum
    '#2E8B57', // Sea Green
    '#008080', // Teal
    '#5C4033', // Coffee Brown
    '#4B0082', // Indigo
    '#9C27B0', // Purple
    '#FF6347', // Tomato
    '#00BFFF', // Deep Sky Blue
    '#B22222', // Firebrick
    '#2E3A87', // Dark Cornflower Blue
    '#993366', // Reddish Purple
    '#C71585', // Medium Violet Red
    '#8B4513', // Saddle Brown
    '#CD5C5C', // Indian Red
    '#556B2F', // Dark Olive Green
    '#00008B', // Dark Blue
];

export function getColor(title: string, id: string) {
    let unique = 0;
    for (let i = 0; i < id.length; i++) {
        unique += id.charCodeAt(i);
    }
    const index = (title.charCodeAt(0) + title.charCodeAt(1) + unique) % 40;
    return distinguishableColor[index];
}
