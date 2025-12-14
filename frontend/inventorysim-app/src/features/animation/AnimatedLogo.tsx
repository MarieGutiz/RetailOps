import { motion } from "framer-motion";

const AnimatedLogo = () => {
  const size = 25;
  const spacing = 30;

  // Generate cubes: 4→1 pattern
  const cubes: { x: number; y: number }[] = [];
  const columns = 4;
  for (let col = 0; col < columns; col++) {
    const height = columns - col; // 4,3,2,1
    for (let row = 0; row < height; row++) {
      cubes.push({ x: col, y: row });
    }
  }

  // Path for yellow "M" line (bottom-left to bottom-right)
//   const path = `
//     M 0 ${spacing * 3.8}
//     L ${spacing} ${spacing * 2.5}
//     L ${spacing * 2} ${spacing * 3.8}
//     L ${spacing * 3} ${spacing * 2.5}
//     L ${spacing * 4} ${spacing * 3.8}
//   `;
// Compute "M" path dynamically based on cube positions
  const leftX = 0;
  const rightX = spacing * (columns - 1);
  const topY = spacing * 0.5;
  const bottomY = spacing * (columns - 0.2);

  const path = `
  M ${leftX + size / 2} ${bottomY}
  L ${leftX + spacing} ${bottomY - spacing * 1.6}
  L ${spacing * 2 - 8} ${bottomY - spacing * 1.1}
  L ${rightX - spacing / 2} ${bottomY - spacing * 2.3}
  L ${rightX - size / 2} ${bottomY - spacing * 1.8}
`;

  return (
    <svg width="180" height="150" viewBox="0 0 180 150" xmlns="http://www.w3.org/2000/svg">
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

      {/* Blue cubes */}
      {cubes.map((cube, i) => (
        <motion.rect
          key={i}
          x={cube.x * spacing}
          y={spacing * (columns - 1 - cube.y)}
          width={size}
          height={size}
          rx="4"
          fill="url(#blueGradient)"
          initial={{ scale: 0, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 120 }}
        />
      ))}

      {/* Yellow M line */}
      <motion.path
        d={path}
        stroke="url(#yellowGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: cubes.length * 0.12 }}
      />
    </svg>
  );
};

export default AnimatedLogo;
