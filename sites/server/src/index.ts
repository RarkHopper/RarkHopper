import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono();

const messageResSchema = z.object({
  message: z.string(),
});
type MessageResponse = z.infer<typeof messageResSchema>;

const routes = app.get('/message', (c) => {
  const resBody: MessageResponse = {
    message: 'Hello Hono!',
  };

  const validation = messageResSchema.safeParse(resBody);

  if (!validation.success) {
    return c.json({ success: false, errors: "Inernal Server Error" }, 500);
  }
  return c.json(resBody);
});

export type AppType = typeof routes;
export default app;
