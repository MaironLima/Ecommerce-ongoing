import { hash } from 'bcrypt';
import { prisma } from '../../libs/prisma.js';

export async function registerService(email: string, password: string, name: string) {
  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'CUSTOMER',
    },
  });

  return user;
}
