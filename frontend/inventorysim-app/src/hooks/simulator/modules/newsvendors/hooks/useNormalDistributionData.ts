import { useMemo } from "react";
import jStat from "jstat";

export function useNormalDistributionData(
  mean: number,
  std: number,
  serviceLevel: number
) {
  return useMemo(() => {
    if (!std || std <= 0) {
      return { data: [], Q: 0, z: 0 };
    }

    const z = jStat.normal.inv(serviceLevel, 0, 1);
    const Q = mean + z * std;

    const min = mean - 4 * std;
    const max = mean + 4 * std;
    const step = (max - min) / 300;

    const points = [];

    for (let x = min; x <= max; x += step) {
      const y = jStat.normal.pdf(x, mean, std);

      points.push({
        x,
        pdf: y,
        leftArea: x <= Q ? y : null,
        rightArea: x > Q ? y : null,
      });
    }

    return { data: points, Q, z };
  }, [mean, std, serviceLevel]);
}