export const DB_LV = Math.log(10.0) / 20.0;

/**
 * Convert a decibel value to a gain value
 * @param db The decibel value
 * @returns The gain value
 */
export const dbToGain = (db: number): number => Math.exp(db * DB_LV);

/**
 * Convert a gain value to a decibel value
 * @param gain The gain value
 * @returns The decibel value
 */
export const gainToDb = (gain: number): number => Math.log(gain) / DB_LV;

// The gain value at the anchor point
const GAIN_AT_ANCHOR = dbToGain(-6);
const ANCHOR = 0.5;
// get max gain values from given constraints
const GAIN_AT_ONE = 1.995262;
// get the ratio of gain at anchor relative to gain at one
const GAIN_RATIO_AT_ANCHOR = GAIN_AT_ANCHOR / GAIN_AT_ONE;
const B =
  (GAIN_AT_ONE * GAIN_RATIO_AT_ANCHOR * GAIN_RATIO_AT_ANCHOR) /
  (1.0 - GAIN_RATIO_AT_ANCHOR * 2.0);
// gain shift
const A = -B;
// scaling factor
const D =
  Math.log((1.0 - GAIN_RATIO_AT_ANCHOR) / GAIN_RATIO_AT_ANCHOR) / ANCHOR;
// adjustment
const E = Math.log(B);

export const normalizedToGain = (normalizedValue: number): number => {
  if (normalizedValue <= 0) {
    return 0;
  }

  if (normalizedValue < 1) {
    return Math.exp(D * normalizedValue + E) + A;
  }

  return GAIN_AT_ONE;
};

export const gainToNormalized = (gainValue: number): number =>
  (Math.log(gainValue - A) - E) / D;

export const gainToDbString = (gainValue: number): string => {
  const dbValue = gainToDb(gainValue);

  if (dbValue === -Infinity) {
    return "-∞";
  }
  return dbValue.toFixed(2);
};
