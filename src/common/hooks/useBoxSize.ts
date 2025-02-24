import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type BoxSizeType = {
    boxWidth: number;
    boxHeight: number;
};

const useBoxSize = (node: Element | null): BoxSizeType => {
    const [boxSize, setBoxSize] = useState<BoxSizeType>({ boxWidth: 0, boxHeight: 0 });

    useLayoutEffect(() => {
        if (node) {
            const resizeObserver = new ResizeObserver((entries) => {
                entries.forEach((entry) => {
                    const boxWidth = entry.contentBoxSize
                        ? entry.contentBoxSize[0].inlineSize
                        : entry.contentRect.width;

                    const boxHeight = entry.contentBoxSize
                        ? entry.contentBoxSize[0].blockSize
                        : entry.contentRect.height;

                    setBoxSize({ boxWidth, boxHeight });
                });
            });

            resizeObserver.observe(node);

            return (): void => resizeObserver.unobserve(node);
        }
        return undefined;
    }, [node]);

    return boxSize;
};

export const useDivSize = (): [ref: React.MutableRefObject<HTMLDivElement | null>, height?: number, width?: number] => {
    const [box, setBox] = useState<{ height?: number; width?: number }>({});
    const divRef = useRef<HTMLDivElement | null>(null);
    const { boxWidth, boxHeight } = useBoxSize(divRef.current);

    useEffect(() => {
        if (!divRef.current) {
            return;
        }

        setBox({
            height: divRef.current.offsetHeight,
            width: divRef.current.offsetWidth,
        });
    }, [divRef, boxWidth, boxHeight]);

    return [divRef, box.height, box.width];
};

export default useBoxSize;
