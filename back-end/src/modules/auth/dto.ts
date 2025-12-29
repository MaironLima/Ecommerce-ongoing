import * as z from 'zod';

const userSchema = z.object({
  email: z.email({ message: 'This is not an email!' }),
  name: z
    .string()
    .min(3, { message: 'Too few characters in the name!' })
    .max(64, { message: 'Too much characters in the name!' }),
  password: z.string().min(6, { message: 'Too few characters in the password!' }),
});

export default userSchema;
