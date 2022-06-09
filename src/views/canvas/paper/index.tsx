import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import GoBack from '@/components/GoBack';
import useFullCanvas from '@/hooks/useFullCanvas';

import ToolPalette from './components/ToolPalette';
import { Brush } from './canvas';
import { saveCanvas, getImageData } from '../fs';
import './index.scss';

const InitBrush = new Brush();

export default function CanvasPaperView(props: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useFullCanvas(canvasRef);
  const { path, file } = useParams();
  const filePath = `${path}/${file}`;

  const handleImage = async () => {
    const data = await getImageData(filePath);
    InitBrush.drawImage(data);
  };

  useEffect(() => {
    if (canvasRef.current) {
      InitBrush.init(canvasRef.current);
      handleImage();
    }
  }, []);

  const handleToolbar = (key: string, val: any) => {
    InitBrush.run(key, val);
  };

  const handleSave = () => {
    const image = InitBrush.save();
    saveCanvas(filePath, image);
  };

  const handleEraser = (isEraser: boolean) => {
    InitBrush.eraser(isEraser);
  };

  return (
    <div className="omb-canvas-paper">
      <GoBack />
      <ToolPalette
        onChange={handleToolbar}
        onEraser={handleEraser}
        onSave={handleSave}
      />
      <canvas ref={canvasRef} className="select-none" />
    </div>
  );
}
