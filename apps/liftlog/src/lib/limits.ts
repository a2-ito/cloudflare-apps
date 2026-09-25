/**
 * 入力の上限。フォーム（クライアント）とサーバーアクションの両方から読むため、
 * "use server" のファイルには置けない（非同期関数以外を export できない）。
 */

/** 世界記録でも 500kg 前後なので、それを超える値は桁の打ち間違いとして弾く */
export const MAX_WEIGHT = 500;
export const MAX_REPS = 100;
export const MAX_SETS = 10;
export const MAX_INCREMENT = 20;
/** 重量の刻み。1.25kg のプレートまで扱えればよい */
export const WEIGHT_STEP = 0.25;
