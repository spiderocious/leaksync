import { z } from 'zod';

export const PairCodeBody = z.object({
  macName: z.string().min(1).max(80),
  userName: z.string().min(1).max(80),
});
export type PairCodeBody = z.infer<typeof PairCodeBody>;

export const PairRedeemBody = z.object({
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
  deviceName: z.string().min(1).max(80),
});
export type PairRedeemBody = z.infer<typeof PairRedeemBody>;
