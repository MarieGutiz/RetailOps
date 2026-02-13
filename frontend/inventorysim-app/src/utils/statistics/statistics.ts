import * as jStat from "jstat";

export const quantileNormal = (p: number) =>
  jStat.normal.inv(p, 0, 1);
