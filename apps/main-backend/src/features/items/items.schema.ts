import { z } from 'zod';

// POST /items body. text|url carry `text`; image carries the file-service key.
export const CreateItemBody = z
  .object({
    kind: z.enum(['text', 'url', 'image']),
    text: z.string().min(1).max(10_000).optional(),
    fileKey: z.string().min(1).max(256).optional(),
    mime: z.string().min(1).max(128).optional(),
    filename: z.string().min(1).max(256).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.kind === 'image') {
      if (!val.fileKey) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['fileKey'], message: 'fileKey is required for image items' });
      }
    } else if (!val.text) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['text'], message: 'text is required for text/url items' });
    }
  });
export type CreateItemBody = z.infer<typeof CreateItemBody>;

// GET /items?since=&limit= — cursor poll.
export const PollQuery = z.object({
  since: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(50).default(5),
});
export type PollQuery = z.infer<typeof PollQuery>;

export const RecentQuery = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(5),
});
export type RecentQuery = z.infer<typeof RecentQuery>;
