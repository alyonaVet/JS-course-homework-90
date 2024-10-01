export const apiURL = 'ws://localhost:8000/draw';

export const drawPoint = (context: CanvasRenderingContext2D, x: number, y: number) => {
  context.fillStyle = 'red';
  context.fillRect(x, y, 5, 5);
};