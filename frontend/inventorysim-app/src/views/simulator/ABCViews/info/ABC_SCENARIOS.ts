export const ABC_SCENARIOS_META = {
  Baseline: {
    title: 'Baseline',
    theory: 'Steady-state inventory valuation',
    thresholds: 'A ≤ 80%, B ≤ 95%, C ≤ 100%',
    description:
      'Uses standard ABC cutoffs where the top 80% of cumulative inventory value is classified as A. This reflects the current valuation based on prices, costs, and quantities and serves as the reference scenario.',
  },

  Optimistic: {
    title: 'Optimistic',
    theory: 'More balanced value distribution',
    thresholds: 'A ≤ 85%, B ≤ 97%, C ≤ 100%',
    description:
      'Assumes inventory value is spread more evenly across products. A larger share of items remains in class A before value concentration occurs.',
  },

  Pessimistic: {
    title: 'Pessimistic',
    theory: 'Faster value concentration',
    thresholds: 'A ≤ 70%, B ≤ 90%, C ≤ 100%',
    description:
      'Represents a scenario where inventory value concentrates quickly in fewer products, causing fewer items to qualify as class A.',
  },
};
