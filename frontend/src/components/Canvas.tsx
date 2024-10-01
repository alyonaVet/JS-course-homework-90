import React, {useEffect, useRef} from 'react';
import {apiURL, drawPoint} from '../constants';
import {Pixel} from '../types';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    wsRef.current = new WebSocket(apiURL);

    wsRef.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    wsRef.current.onmessage = (event: MessageEvent) => {
      const {type, payload} = JSON.parse(event.data);
      if (type === 'DRAW' && context) {
        const {x, y} = payload;
        drawPoint(context, x, y);
      } else if (type === 'EXISTING_PIXELS' && context) {
        const initialDrawingData: Pixel[] = payload;
        initialDrawingData.forEach((pixel: Pixel) => drawPoint(context, pixel.x, pixel.y));
      }
    };

    wsRef.current.onclose = () => {
      console.log('Connection disconnected');
    };

    return () => {
      wsRef.current?.close();
    };

  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const context = canvas?.getContext('2d');

      if (context) {
        drawPoint(context, x, y);
        wsRef.current?.send(JSON.stringify({x, y}));
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      style={{border: '1px solid black'}}
      onMouseDown={handleMouseDown}
    />
  );
};

export default Canvas;