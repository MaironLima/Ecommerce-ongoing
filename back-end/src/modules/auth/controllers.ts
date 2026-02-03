import { Request, Response } from 'express';
import {
  codes,
  loginService,
  recoverCodeService,
  recoverEmailService,
  recoverPasswordService,
  refreshService,
  registerService,
} from './services.js';
import userSchema from './dto.js';

export const registerController = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.safeParse(req.body);

    if (!parsed.success) {
      const firstMessage = parsed.error.issues[0]?.message || 'Validation error';
      return res.status(400).json({ error: firstMessage });
    }

    const { email, password, name } = parsed.data;
    const { accessToken, refreshToken } = await registerService(email, password, name);
    res.cookie('refreshToken', refreshToken);

    res.status(201).json({ message: 'User registered successfully', name, accessToken });
  } catch (e) {
    return res
      .status(400)
      .json({ error: e instanceof Error ? e.message : 'Internal server error' });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) throw new Error('The email is missing');
    if (!password) throw new Error('The password is missing');

    const loginResult = await loginService(email, password);
    if (!loginResult) throw new Error('Login failed');

    const { accessToken, refreshToken, name } = loginResult;
    res.cookie('refreshToken', refreshToken);

    res.status(202).json({ message: 'User logged successfully', name, accessToken });
  } catch (e) {
    return res
      .status(500)
      .json({ error: e instanceof Error ? e.message : 'Internal server error' });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie('refreshToken');
    res.removeHeader('Authorization');

    res.status(202).json({ message: 'Cookies was cleared' });
  } catch (e) {
    return res
      .status(500)
      .json({ error: e instanceof Error ? e.message : 'Internal server error' });
  }
};

export const refreshController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) throw new Error('Without refresh token');

    const { newAccessToken } = await refreshService(refreshToken);
    if (!newAccessToken) throw new Error('Failed to refresh access token');

    res
      .status(202)
      .json({ message: 'Access token refreshed successfully', accessToken: newAccessToken });
  } catch (e) {
    return res
      .status(500)
      .json({ error: e instanceof Error ? e.message : 'Internal server error' });
  }
};

export const recoverEmailController = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstMessage = parsed.error.issues[0]?.message || 'Validation error';
      return res.status(400).json({ error: firstMessage });
    }

    const { email } = parsed.data;

    await recoverEmailService(email);

    res.status(202).json({ message: 'Code sent' });
  } catch (e) {
    return res
      .status(500)
      .json({ error: e instanceof Error ? e.message : 'Internal server error' });
  }
};

export const recoverCodeController = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstMessage = parsed.error.issues[0]?.message || 'Validation error';
      return res.status(400).json({ error: firstMessage });
    }

    const { code, email } = parsed.data;

    if (!codes[email]) throw new Error('No code generated for this email');
    if (codes[email] !== Number(code)) throw new Error('Invalid code');

    const { accessToken, refreshToken, name } = await recoverCodeService(email);
    res.cookie('refreshToken', refreshToken);

    res.status(202).json({ message: 'Valide code', accessToken, name });
  } catch (e) {
    return res
      .status(400)
      .json({ error: e instanceof Error ? e.message : 'Internal server error' });
  }
};

export const recoverPasswordController = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstMessage = parsed.error.issues[0]?.message || 'Validation error';
      return res.status(400).json({ error: firstMessage });
    }

    const { password: newPassword } = parsed.data;
    const accessToken = req.headers.authorization as string;

    const { name } = await recoverPasswordService(accessToken, newPassword);

    res.status(202).json({ message: 'Password changed successfuly', name });
  } catch (e) {
    return res
      .status(500)
      .json({ error: e instanceof Error ? e.message : 'Internal server error' });
  }
};
