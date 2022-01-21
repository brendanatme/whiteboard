import * as React from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useBoardData } from '../services/db';

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

const DrawingBoard = ({ id }) => {
  const { userLineGroups, users, myColor, myLines, setMyLines, clear } = useBoardData(id);
  const [isDrawing, setIsDrawing] = React.useState(false);

  /**
   * on drag start,
   * enable drawing and
   * create a new line to start drawing
   */
  const handleDragStart = () => {
    setIsDrawing(true);
    setMyLines([...myLines, []]);
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
    const latest = myLines.pop();

    setMyLines([...myLines, [...latest, evt.clientX, evt.clientY]]);
  };

  return (
    <div className="fullscreen">
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
          {userLineGroups.map((lineGroup) => lineGroup.lines && lineGroup.lines.map((points, i) => (
            <Line
              key={i}
              points={points}
              stroke={lineGroup.color}
              strokeWidth={5}
            />
          )))}
          {myLines && myLines.map((points, i) => (
            <Line
              key={i}
              points={points}
              stroke={myColor}
              strokeWidth={5}
            />
          ))}
        </Layer>
      </Stage>
      <button style={{ bottom: '10px', right: '10px', position: 'absolute' }} onClick={clear}>
        CLEAR
      </button>
    </div>
  );
};

export default DrawingBoard;