declare module "jstat" {
  const jStat: {
    normal: {
      pdf: (x: number, mean?: number, std?: number) => number;
      cdf: (x: number, mean?: number, std?: number) => number;
      inv: (p: number, mean?: number, std?: number) => number;
    };
  };

  export = jStat;
}