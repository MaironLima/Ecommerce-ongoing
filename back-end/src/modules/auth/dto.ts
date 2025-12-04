import * as z from 'zod';

const userSchema = z.object({
  email: z.email({ error: 'This is not an email!' }),
  name: z
    .string()
    .min(3, { error: 'Too few characters in the name!' })
    .max(64, { error: 'Too much characters in the name!' }),
  password: z.string().min(6, { error: 'Too few characters in the password!' }),
});

export default userSchema;
