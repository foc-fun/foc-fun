import React, { useState, useEffect, useRef, createRef, useCallback } from "react";

function PipelineBlock(props: any) {
  return (
    <div
      ref={props.ref}
      style={props.style}
      className="border-2 border-gray-500 bg-gray-100 rounded-lg shadow-md flex flex-col p-4 m-2"
    >
      <h2 className="text-center text-lg font-bold text-gray-700">
        {props.title}
      </h2>
      <div className="flex-1 flex flex-col">
        <div className="flex flex-row justify-between p-2">
          <div className="text-sm text-gray-600">
            <p className="mb-4">Inputs:</p>
            {props.inputs.map((input: any, index: number) => (
              <div key={index} className="text-gray-500 mb-2">
                <div className="w-[1rem] h-[1rem] bg-gray-500 rounded-full inline-block mr-2"
                ref={props.inputRefs[index]}></div>
                {input.name} ({input.type})
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <p className="mb-4">Outputs:</p>
            {props.outputs.map((output: any, index: number) => (
              <div key={index} className="text-gray-500">
                {output.name} ({output.type})
                <div className="w-[1rem] h-[1rem] bg-gray-500 rounded-full inline-block ml-2"
                ref={props.outputRefs[index]}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnginePipelines() {
  const canvasControllerRef = useRef(null as any);
  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);
  const [canvasScale, setCanvasScale] = useState(1.02);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);

  const handlePointerDown = (e: any) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartY(e.clientY);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragStartX(0);
    setDragStartY(0);
  };

  const handlePointerMove = (e: any) => {
    if (isDragging) {
      setCanvasX(canvasX + e.clientX - dragStartX);
      setCanvasY(canvasY + e.clientY - dragStartY);
      setDragStartX(e.clientX);
      setDragStartY(e.clientY);
    }
  };

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, canvasX, canvasY]);

  const [artificialZoom, _setArtificialZoom] = useState(1);
  const baseWorldX = 256;
  const baseWorldY = 396;
  const surroundingWorldX = 256;
  const surroundingWorldY = 396;
  const mainCanvasRef = useRef(null as any);
  const minScale = 0.6;
  const maxScale = 40;
  const zoom = useCallback((e: any) => {
    // Get the cursor position within the canvas ( note the canvas can go outside the viewport )
    if (!mainCanvasRef.current) return;
    const rect = mainCanvasRef.current.getBoundingClientRect();
    let cursorX = e.clientX - rect.left;
    let cursorY = e.clientY - rect.top;
    if (cursorX < -surroundingWorldX * canvasScale) {
      cursorX = -surroundingWorldX * canvasScale;
    } else if (cursorX > rect.width + surroundingWorldX * canvasScale) {
      cursorX = rect.width + surroundingWorldX * canvasScale;
    }
    if (cursorY < -surroundingWorldY * canvasScale) {
      cursorY = -surroundingWorldY * canvasScale;
    } else if (cursorY > rect.height + surroundingWorldY * canvasScale) {
      cursorY = rect.height + surroundingWorldY * canvasScale;
    }

    // Calculate new left and top position to keep cursor over the same rect pos  ition
    const direction = e.deltaY > 0 ? 1 : -1;
    const scaler = Math.log2(1 + Math.abs(e.deltaY) * 2) * direction;
    let newScale = canvasScale * (1 + scaler * -0.01);
    if (newScale < minScale) {
      newScale = minScale;
    } else if (newScale > maxScale) {
      newScale = maxScale;
    }
    const newWidth = baseWorldX * newScale * artificialZoom;
    const newHeight = baseWorldY * newScale * artificialZoom;
    const oldCursorXRelative = cursorX / rect.width;
    const oldCursorYRelative = cursorY / rect.height;
    const newCursorX = oldCursorXRelative * newWidth;
    const newCursorY = oldCursorYRelative * newHeight;
    const newPosX = canvasX - (newCursorX - cursorX);
    const newPosY = canvasY - (newCursorY - cursorY);

    setCanvasScale(newScale);
    setCanvasX(newPosX);
    setCanvasY(newPosY);
  }, [canvasScale, canvasX, canvasY, artificialZoom]);

  const [touchInitialDistance, setInitialTouchDistance] = useState(0);
  const [touchScale, setTouchScale] = useState(1);
  const handleTouchStart = useCallback((e: any) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const initialDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setTouchScale(canvasScale);
      setInitialTouchDistance(initialDistance);
    }
  }, [canvasScale]);

  const handleTouchMove = useCallback((e: any) => {
    if (e.touches.length === 2) {
      const [touch1, touch2] = e.touches;
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      const rect = mainCanvasRef.current.getBoundingClientRect();
      const midX = (touch1.clientX + touch2.clientX) / 2;
      const midY = (touch1.clientY + touch2.clientY) / 2;

      let cursorX = midX - rect.left;
      let cursorY = midY - rect.top;
      if (cursorX < 0) {
        cursorX = 0;
      } else if (cursorX > rect.width) {
        cursorX = rect.width;
      }
      if (cursorY < 0) {
        cursorY = 0;
      } else if (cursorY > rect.height) {
        cursorY = rect.height;
      }

      let newScale = (distance / touchInitialDistance) * touchScale;
      if (newScale < minScale) {
        newScale = minScale;
      } else if (newScale > maxScale) {
        newScale = maxScale;
      }
      const newWidth = baseWorldX * newScale * artificialZoom;
      const newHeight = baseWorldY * newScale * artificialZoom;

      const oldCursorXRelative = cursorX / rect.width;
      const oldCursorYRelative = cursorY / rect.height;

      const newCursorX = oldCursorXRelative * newWidth;
      const newCursorY = oldCursorYRelative * newHeight;

      const newPosX = canvasX - (newCursorX - cursorX);
      const newPosY = canvasY - (newCursorY - cursorY);

      setCanvasScale(newScale);
      setCanvasX(newPosX);
      setCanvasY(newPosY);

      // TODO: Make scroll acceleration based
    }
  }, [touchInitialDistance, touchScale, minScale, maxScale, baseWorldX, baseWorldY, artificialZoom, canvasX, canvasY]);

  useEffect(() => {
    const currentCanvas = canvasControllerRef.current;
    if (!currentCanvas) return;
    currentCanvas.addEventListener("wheel", zoom);
    currentCanvas.addEventListener("touchstart", handleTouchStart);
    currentCanvas.addEventListener("touchmove", handleTouchMove);
    return () => {
      if (!currentCanvas) return;
      currentCanvas.removeEventListener("wheel", zoom);
      currentCanvas.removeEventListener(
        "touchstart",
        handleTouchStart
      );
      currentCanvas.removeEventListener(
        "touchmove",
        handleTouchMove
      );
    };
  }, [canvasScale, canvasX, canvasY, touchInitialDistance, zoom, handleTouchStart, handleTouchMove]);

  const [hasInit, setHasInit] = useState(false);
  useEffect(() => {
    if (!canvasControllerRef.current) return;
    if (hasInit) return;
    const containerRect = canvasControllerRef.current.getBoundingClientRect();
    const adjustX = ((canvasScale - 1) * baseWorldX) / 2;
    const adjustY = ((canvasScale - 1) * baseWorldY) / 2;
    setCanvasX(containerRect.width / 2 - adjustX);
    setCanvasY(containerRect.height / 2 - adjustY);
    setHasInit(true);
  }, [canvasControllerRef, canvasScale, hasInit]);

  const [blockOneInputRefs, setBlockOneInputRefs] = useState<any[]>([]);
  const [blockOneOutputRefs, setBlockOneOutputRefs] = useState<any[]>([]);
  const [blockTwoInputRefs, setBlockTwoInputRefs] = useState<any[]>([]);
  const [blockTwoOutputRefs, setBlockTwoOutputRefs] = useState<any[]>([]);
  useEffect(() => {
    setBlockOneInputRefs([
      Array.from({ length: 1 }, () => createRef())
    ]);
    setBlockOneOutputRefs([
      Array.from({ length: 1 }, () => createRef())
    ]);
    setBlockTwoInputRefs([
      Array.from({ length: 2 }, () => createRef())
    ]);
    setBlockTwoOutputRefs([
      Array.from({ length: 1 }, () => createRef())
    ]);
  }, []);

  // Draw a line between blockOneOutputRef[0] and blockTwoInputRef[1]
  const drawLine = useCallback((startRef: any, endRef: any) => {
    if (!startRef.current || !endRef.current) return;
    const startRect = startRef.current.getBoundingClientRect();
    const endRect = endRef.current.getBoundingClientRect();
    
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.closePath();
    const line = document.createElement("img");
    line.src = canvas.toDataURL();
    line.style.position = "absolute";
    line.style.left = "0px";
    line.style.top = "0px";
    line.style.color = "black";
    line.style.width = `${window.innerWidth}px`;
    line.style.height = `${window.innerHeight}px`;
    line.style.transform = `translate(${canvasX}px, ${canvasY}px)`;
    line.style.transformOrigin = `${startX}px ${startY}px`;
    line.style.zIndex = "100"; // Ensure the line is behind the blocks
    line.style.pointerEvents = "none"; // Prevent pointer events on the line
    canvasControllerRef.current.appendChild(line);
    return () => {
      if (line && line.parentNode) {
        line.parentNode.removeChild(line);
      }
    };
  }, [canvasX, canvasY]);
  useEffect(() => {  
    if (!blockOneOutputRefs[0] || !blockTwoInputRefs[0]) return;
    if (!blockOneOutputRefs[0][0] || !blockTwoInputRefs[0][1]) return;
    drawLine(blockOneOutputRefs[0][0], blockTwoInputRefs[0][1]);
  }, [blockOneInputRefs, blockOneOutputRefs, blockTwoInputRefs, blockTwoOutputRefs, drawLine]);
  return (
    <div
      className="w-full h-full overflow-hidden relative flex flex-col items-center justify-center"
      ref={canvasControllerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
    >
      <div
        className="absolute"
        style={{
          top: -baseWorldY / 2,
          left: -baseWorldX / 2,
          transform: `translate(${canvasX}px, ${canvasY}px)`,
        }}
      >
        <PipelineBlock
          ref={mainCanvasRef}
          width={baseWorldX}
          height={baseWorldY}
          style={{
            width: baseWorldX * canvasScale * artificialZoom,
            height: baseWorldY * canvasScale * artificialZoom,
          }}
          origin={{
            x: 0,
            y: 0,
          }}
          title="Deploy BasicContract"
          inputs={[
            {
              name: "version",
              type: "string",
            }
          ]}
          outputs={[
            {
              name: "address",
              type: "address",
            },
          ]}
          inputRefs={blockOneInputRefs}
          outputRefs={blockOneOutputRefs}
        />
        <PipelineBlock
          width={surroundingWorldX}
          height={surroundingWorldY}
          style={{
            width: surroundingWorldX * canvasScale * artificialZoom,
            height: surroundingWorldY * canvasScale * artificialZoom,
            position: "absolute",
            left: (baseWorldX + 50) * canvasScale,
            top: (0) * canvasScale,
          }}
          origin={{
            x: (baseWorldX + 50) * canvasScale,
            y: (0) * canvasScale,
          }}
          title="Deploy AdvancedContract"
          inputs={[
            {
              name: "input1",
              type: "string",
            },
            {
              name: "input2",
              type: "address",
            },
          ]}
          outputs={[
            {
              name: "address",
              type: "address",
            },
          ]}
          inputRefs={blockTwoInputRefs}
          outputRefs={blockTwoOutputRefs}
        />
        <PipelineBlock
          width={168}
          height={84}
          style={{
            width: 168 * canvasScale * artificialZoom,
            height: 84 * canvasScale * artificialZoom,
            position: "absolute",
            left: (-200) * canvasScale,
            top: (0) * canvasScale,
          }}
          origin={{
            x: (-200) * canvasScale,
            y: (0) * canvasScale,
          }}
          title="String Input"
          inputs={[]}
          outputs={[
            {
              name: "value",
              type: "string",
            },
          ]}
          inputRefs={[]}
          outputRefs={[]}
        />
        <PipelineBlock
          width={168}
          height={84}
          style={{
            width: 168 * canvasScale * artificialZoom,
            height: 84 * canvasScale * artificialZoom,
            position: "absolute",
            left: (86) * canvasScale,
            top: (-100) * canvasScale,
          }}
          origin={{
            x: (86) * canvasScale,
            y: (-100) * canvasScale,
          }}
          title="String Input"
          inputs={[]}
          outputs={[
            {
              name: "value",
              type: "string",
            },
          ]}
          inputRefs={[]}
          outputRefs={[]}
        />
        <PipelineBlock
          width={228}
          height={124}
          style={{
            width: 228 * canvasScale * artificialZoom,
            height: 124 * canvasScale * artificialZoom,
            position: "absolute",
            left: (606) * canvasScale,
            top: (-20) * canvasScale,
          }}
          origin={{
            x: (606) * canvasScale,
            y: (-20) * canvasScale,
          }}
          title="Invoke AdvancedContract SetValue"
          inputs={[
            {
              name: "contract",
              type: "address",
            },
            {
              name: "value",
              type: "string",
            },
          ]}
          outputs={[]}
          inputRefs={[]}
          outputRefs={[]}
        />
      </div>
      <div
        className="absolute bottom-0 left-0 w-full flex flex-row justify-end gap-4 p-4"
      >
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-l"
          onClick={() => console.log("Save")}
        >
          Save
        </button>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-r"
          onClick={() => console.log("Load")}
        >
          Load
        </button>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-r"
          onClick={() => console.log("New")}
        >
          New
        </button>
      </div>
    </div>
  );
}
