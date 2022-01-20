import * as React from 'react';
import { Stage, Layer, Line } from 'react-konva';

/**
 * array of lines;
 * each line is an array of points
 * 
 * ex.
 * 
 * [
 *   [100, 50, 300, 50], // line 1: { x: 100, y: 50 }, { x: 300, y: 50 }
 *   [100, 400, 300, 400], // line 2: { x: 100, y: 400 }, { x: 300, y: 400 }
 * ]
 */
const INITIAL_LINES = [];

const DrawingBoard = () => {
  const [lines, setLines] = React.useState(INITIAL_LINES);
  const [isDrawing, setIsDrawing] = React.useState(false);
  
  /**
   * on drag start,
   * enable drawing and
   * create a new line to start drawing
   */
  const handleDragStart = () => {
    setIsDrawing(true);
    setLines([...lines, []]);
  };
  
  /**
   * on drag end,
   * disable drawing
   */
  const handleDragEnd = () => {
    setIsDrawing(false);
  };

  /**
   * during drag,
   * add points to latest line
   */
  const handleDragMove = (e) => {
    if (!isDrawing) {
      return;
    }

    const { evt } = e;
    const latest = lines.pop();

    setLines([...lines, [...latest, evt.clientX, evt.clientY]]);
  };

  return (
    <Stage
      height={window.innerHeight}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDragMove}
      width={window.innerWidth}
    >
      <Layer>
        {lines && lines.map((points, i) => (
          <Line
            key={i}
            fill="#000"
            points={points}
            stroke="#000"
            strokeWidth={5}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default DrawingBoard;