export interface Coordinate {
    x1: number
    x2: number
    y1: number;
    y2: number;
}

export interface TileType {
    id: number;
    coordinates?: Coordinate;
    isHighlighted: boolean;
    word: string;
}

export interface TileProps {
    tile: TileType;
}

export const letterWidth = 'w-8'