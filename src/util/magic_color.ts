const colors = [
    '#696969',
    '#2e8b57',
    '#800000',
    '#808000',
    '#00008b',
    '#ff0000',
    '#ff8c00',
    '#ffff00',
    '#7cfc00',
    '#ba55d3',
    '#00ffff',
    '#0000ff',
    '#ff00ff',
    '#1e90ff',
    '#fa8072',
    '#dda0dd',
    '#ff1493',
    '#f5deb3',
    '#98fb98',
    '#87cefa',
];
let magic_color_map:Record<string, string> = {};

/**
 * Map any text string to a color from a list of colors.
 * Consistent for the same text.
 * 
 * Not consistent between runs.
 * 
 * @param text 
 * @returns 
 */
export function magic_color(text:string){
    if(!(text in magic_color_map)){
        magic_color_map[text] = colors[
            Object.keys(magic_color_map).length
            % colors.length
        ]
    }
    return magic_color_map[text]
}