export interface Pixel {
    x: number;
    y: number;
}

export interface IncomingPixel {
    type: string;
    payload: Pixel;
}