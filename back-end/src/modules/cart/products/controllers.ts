import { Request, Response } from 'express';
import {
  productsAddService,
  productsAttService,
  productsDeleteService,
  productsGetService,
  productsService,
} from './services';
import path from 'path';
import productSchema from './dto';

export const productsController = async (req: Request, res: Response) => {
  try {
    const { results } = await productsService();

    res.status(200).json({ results });
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'It was not possible to return the products' });
  }
};

export const productsGetController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error('ID not founded');

    const { result } = await productsGetService(id);

    res.status(200).json({ result });
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'Error searching for the item' });
  }
};

export const productsSearchController = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const productsAddController = async (req: Request, res: Response) => {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstMessage = parsed.error.issues[0]?.message || 'Validation error';
      return res.status(400).json({ error: firstMessage });
    }

    const { title, description, basePrice, category } = parsed.data;
    if (!title) throw new Error('Without title');
    if (!basePrice) throw new Error('Without base price');
    if (!category) throw new Error('Without category');

    const mainImageWebp = req.body.mainImageWebp;
    const extraImagesWebp = req.body.extraImagesWebp || [];

    if (!mainImageWebp) throw new Error('Without main image');

    const mainImagePath = path.resolve(__dirname, '../../../imagens/uploads', mainImageWebp);
    const extraImagesPaths = extraImagesWebp.map((img: string) => path.resolve(__dirname, '../../../imagens/uploads', img));
    await productsAddService(title, description, basePrice, category, mainImagePath, extraImagesPaths);

    res.status(201).json({ message: 'Product added successfully' });
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'It was not possible to create the product' });
  }
};

export const productAttController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error('ID not provided');

    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstMessage = parsed.error.issues[0]?.message || 'Validation error';
      return res.status(400).json({ error: firstMessage });
    }
    const { title, description, basePrice, category } = parsed.data;

    const mainImageWebp = req.body.mainImageWebp;
    const extraImagesWebp = req.body.extraImagesWebp || [];

    const mainImagePath = mainImageWebp ? path.resolve(__dirname, '../../../imagens/uploads', mainImageWebp) : undefined;
    const extraImagesPaths = extraImagesWebp.map((img: string) => path.resolve(__dirname, '../../../imagens/uploads', img));

    const updatedProduct = await productsAttService(
      id,
      title,
      description,
      basePrice,
      category,
      mainImagePath,
      extraImagesPaths,
    );

    res.status(200).json({ message: 'The product has been updated', product: updatedProduct });
  } catch (e: any) {
    console.log("asdasdasdasdsad")
    console.log(e)
    res.status(400).json({ error: e.message || 'Internal server error' });
  }
};

export const productDeleteController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error('ID not provided');

    await productsDeleteService(id);

    res.status(204);
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'Cannot delete the product' });
  }
};
