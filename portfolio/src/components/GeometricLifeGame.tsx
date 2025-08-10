import { useCallback, useEffect, useRef, useState } from 'react';

const GRID_SIZE = 60;
const CELL_SIZE = 20;
const UPDATE_INTERVAL = 5000; // 5 seconds

// Different shapes have different neighbor patterns
type ShapeType = 'triangle' | 'square' | 'pentagon';

interface GameState {
  grid: boolean[][];
  shape: ShapeType;
  color: string;
  opacity: number;
  rules: {
    survive: number[];
    birth: number[];
  };
}

// Optimized neighbor calculation for different shapes with proper tiling
const getNeighbors = {
  // Hexagonal tiling for triangles (honeycomb structure)
  triangle: (x: number, y: number): [number, number][] => {
    const isOddRow = y % 2 === 1;
    const xOffset = isOddRow ? 1 : 0;
    return [
      [x - 1 + xOffset, y - 1],
      [x + xOffset, y - 1],
      [x - 1, y],
      [x + 1, y],
      [x - 1 + xOffset, y + 1],
      [x + xOffset, y + 1],
    ];
  },

  // Square grid (traditional Conway's Game of Life)
  square: (x: number, y: number): [number, number][] => [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ],

  // Pentagon tiling (approximated honeycomb)
  pentagon: (x: number, y: number): [number, number][] => {
    const isOddRow = y % 2 === 1;
    const xOffset = isOddRow ? 1 : 0;
    return [
      [x - 1 + xOffset, y - 1],
      [x + xOffset, y - 1],
      [x + 1 + xOffset, y - 1],
      [x - 2, y],
      [x - 1, y],
      [x + 1, y],
      [x + 2, y],
      [x - 1 + xOffset, y + 1],
      [x + xOffset, y + 1],
      [x + 1 + xOffset, y + 1],
    ];
  },
};

const gameConfigs: GameState[] = [
  {
    grid: [],
    shape: 'triangle',
    color: '#3b82f6', // blue
    opacity: 0.4,
    rules: { survive: [2, 3], birth: [2] },
  },
  {
    grid: [],
    shape: 'square',
    color: '#8b5cf6', // purple
    opacity: 0.5,
    rules: { survive: [2, 3], birth: [3] },
  },
  {
    grid: [],
    shape: 'pentagon',
    color: '#ec4899', // pink
    opacity: 0.3,
    rules: { survive: [4, 5], birth: [4] },
  },
];

// Memoized grid initialization
const createRandomGrid = (density = 0.3): boolean[][] => {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => Math.random() < density),
  );
};

// Optimized neighbor counting with bounds checking
const countNeighbors = (grid: boolean[][], x: number, y: number, shape: ShapeType): number => {
  let count = 0;
  const neighbors = getNeighbors[shape](x, y);

  for (const [nx, ny] of neighbors) {
    if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && grid[nx][ny]) {
      count++;
    }
  }

  return count;
};

// Optimized grid update with minimal allocations
const updateGrid = (
  grid: boolean[][],
  shape: ShapeType,
  rules: { survive: number[]; birth: number[] },
): boolean[][] => {
  const newGrid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));

  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const neighbors = countNeighbors(grid, x, y, shape);
      const isAlive = grid[x][y];

      if (isAlive) {
        newGrid[x][y] = rules.survive.includes(neighbors);
      } else {
        newGrid[x][y] = rules.birth.includes(neighbors);
      }
    }
  }

  return newGrid;
};

// Memoized shape renderer
const ShapeRenderer = ({
  cell,
  shape,
  color,
  size,
  x,
  y,
}: {
  cell: boolean;
  shape: ShapeType;
  color: string;
  size: number;
  x: number;
  y: number;
}) => {
  if (!cell) return null;

  // Calculate position based on shape type for proper tiling
  const getPosition = () => {
    switch (shape) {
      case 'triangle': {
        // Hexagonal tiling positions
        const isOddRow = y % 2 === 1;
        const offsetX = isOddRow ? size * 0.5 : 0;
        return {
          left: x * size * 0.866 + offsetX, // √3/2 spacing
          top: y * size * 0.75,
        };
      }
      case 'pentagon': {
        // Pentagon honeycomb approximation
        const isOddRow = y % 2 === 1;
        const offsetX = isOddRow ? size * 0.6 : 0;
        return {
          left: x * size * 0.8 + offsetX,
          top: y * size * 0.7,
        };
      }
      default:
        // Square grid
        return {
          left: x * size,
          top: y * size,
        };
    }
  };

  const position = getPosition();
  const baseStyle = {
    position: 'absolute' as const,
    ...position,
    transition: 'opacity 0.8s ease-in-out, transform 0.3s ease',
    opacity: cell ? 0.8 : 0,
    transform: cell ? 'scale(1)' : 'scale(0.8)',
  };

  const shapeStyle = {
    triangle: {
      ...baseStyle,
      width: size,
      height: size,
      backgroundColor: color,
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      borderRadius: '3px',
    },
    square: {
      ...baseStyle,
      width: size * 0.9,
      height: size * 0.9,
      backgroundColor: color,
      borderRadius: '4px',
    },
    pentagon: {
      ...baseStyle,
      width: size,
      height: size,
      backgroundColor: color,
      clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
      borderRadius: '2px',
    },
  };

  return <div style={shapeStyle[shape]} />;
};

function GameLayer({ config, index }: { config: GameState; index: number }) {
  const [grid, setGrid] = useState<boolean[][]>(() => createRandomGrid(0.2 - index * 0.03));
  const lastUpdateRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>();

  const updateGridCallback = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current >= UPDATE_INTERVAL + index * 1000) {
      setGrid((currentGrid) => updateGrid(currentGrid, config.shape, config.rules));
      lastUpdateRef.current = now;
    }
  }, [config.shape, config.rules, index]);

  useEffect(() => {
    const animate = () => {
      updateGridCallback();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateGridCallback]);

  // Position each layer in different areas of the screen
  const getLayerPosition = () => {
    switch (config.shape) {
      case 'triangle':
        return {
          left: '0%',
          top: '0%',
          width: '60%',
          height: '60%',
        };
      case 'square':
        return {
          left: '40%',
          top: '20%',
          width: '60%',
          height: '60%',
        };
      case 'pentagon':
        return {
          left: '20%',
          top: '40%',
          width: '60%',
          height: '60%',
        };
      default:
        return {
          left: '0%',
          top: '0%',
          width: '100%',
          height: '100%',
        };
    }
  };

  const layerPosition = getLayerPosition();

  return (
    <div
      className="absolute"
      style={{
        opacity: config.opacity,
        overflow: 'hidden',
        ...layerPosition,
      }}
    >
      {grid.map((row, x) =>
        row.map((cell, y) => (
          <ShapeRenderer
            key={`${config.shape}-${x}-${y}`}
            cell={cell}
            shape={config.shape}
            color={config.color}
            size={CELL_SIZE}
            x={x}
            y={y}
          />
        )),
      )}
    </div>
  );
}

export default function GeometricLifeGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!isVisible) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/20"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        perspective: '2000px',
        transformStyle: 'preserve-3d',
        width: '100vw',
        height: '100vh',
      }}
    >
      {gameConfigs.map((config, index) => (
        <GameLayer key={config.shape} config={config} index={index} />
      ))}

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.06) 0%, transparent 80%)
          `,
          opacity: 0.6,
          animation: 'pulse 12s ease-in-out infinite',
        }}
      />

      {/* Subtle moving elements */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.02) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite',
        }}
      />
    </div>
  );
}
