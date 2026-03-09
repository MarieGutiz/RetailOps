import { motion } from 'framer-motion';


//Small animated logo pseudo 3D

const AnimatedLogo = () => {
  const size = 25;
  const spacing = 30;
  const scale = 0.4;

  const cubes: { x: number; y: number }[] = [];
  const columns = 4;

  for (let col = 0; col < columns; col++) {
    const height = columns - col;
    for (let row = 0; row < height; row++) {
      cubes.push({ x: col, y: row });
    }
  }

  const leftX = 0;
  const rightX = spacing * (columns - 1);
  const bottomY = spacing * (columns - 0.2);

  const path = `
  M ${leftX + size / 2} ${bottomY}
  L ${leftX + spacing} ${bottomY - spacing * 1.6}
  L ${spacing * 2 - 8} ${bottomY - spacing * 1.1}
  L ${rightX - spacing / 2} ${bottomY - spacing * 2.3}
  L ${rightX - size / 2} ${bottomY - spacing * 1.8}
`;

  const cubeDelay = 0.12;

  const isLightCube = (x: number, y: number) => {
    const targets = [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 1],
    ];

    return targets.some(([tx, ty]) => tx === x && ty === y);
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <svg width="180" height="150" viewBox="0 0 180 150">
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6EE7FF" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>

            <linearGradient id="yellowGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFEA00" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>

          {cubes.map((cube, i) => (
            <motion.rect
              key={i}
              x={cube.x * spacing}
              y={spacing * (columns - 1 - cube.y)}
              width={size}
              height={size}
              rx="4"
              fill={
                isLightCube(cube.x, cube.y) ? '#6EE7FF' : 'url(#blueGradient)'
              }
              initial={{ scale: 0.6, opacity: 0, y: -12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                delay: i * cubeDelay,
                type: 'spring',
                stiffness: 90,
                damping: 14,
              }}
            />
          ))}

          <motion.path
            d={path}
            stroke="url(#yellowGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.4,
              ease: 'easeInOut',
              delay: cubes.length * cubeDelay,
            }}
          />
        </svg>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 2.4,
            duration: 0.8,
            ease: 'easeOut',
          }}
          style={{
            fontSize: '26px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#E2E8F0',
            fontFamily: 'system-ui, sans-serif',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          RetailOps Sim
        </motion.h1>
      </div>
    </div>
  );
};

export default AnimatedLogo;
