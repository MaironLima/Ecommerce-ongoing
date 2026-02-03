import * as z from 'zod';

const userSchema = z.object({
  email: z.email({ message: 'This is not an email!' }),
  name: z
    .string()
    .min(3, { message: 'Too few characters in the name!' })
    .max(64, { message: 'Too much characters in the name!' }),
  password: z.string().min(6, { message: 'Too few characters in the password!' }),
  code: z.number().min(6, { message: 'Too few numbers in the code!' }).max(6, { message: 'Too much numbers in the code!' })
});

export default userSchema;
