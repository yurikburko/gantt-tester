import { useDivSize } from '@/common/hooks/useBoxSize';
import React, { FC } from 'react';
import { Stage, Layer, Circle, Rect, Text } from 'react-konva';

const GanttCanvas: FC = () => {
    const [canvasContainerRef, containerHeight, containerWidth] = useDivSize();

    return (
        <div ref={canvasContainerRef} style={{ height: '100%', overflow: 'hidden' }}>
            <Stage width={containerWidth} height={containerHeight}>
                <Layer>
                    <Text text="Some text on canvas" fontSize={15} />
                    <Rect
                        x={20}
                        y={50}
                        width={100}
                        height={100}
                        fill="red"
                        shadowBlur={10}
                    />
                    <Circle x={200} y={100} radius={50} fill="green" />
                </Layer>
            </Stage>
        </div>

    )
}

export default GanttCanvas;