import { Request, Response } from 'express';
import { productsAddService, productsGetService, productsService } from './services';

export const productsController = async (req: Request, res: Response) => {
  try {
    const { results } = await productsService();

    res.status(200).json({ results });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const productsGetController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error('ID not founded');

    const { result } = await productsGetService(id);

    res.status(200).json({ result });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const productsAddController = async (req: Request, res: Response) => {
  try {
    const { title, description, basePrice, category } = req.body;
    if (!title) throw new Error('Without title');
    if (!basePrice) throw new Error('Without base price');
    if (!category) throw new Error('Without category');

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const mainImage = files && files['mainImage'] ? files['mainImage'][0] : undefined;
    const extraImages = files && files['extraImages'] ? files['extraImages'] : [];

    if (!mainImage) throw new Error('Without main image');

    await productsAddService(title, description, basePrice, category, mainImage, extraImages);

    res.status(201).json({ message: 'Product added successfully' });
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const productAttController = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const productDeleteController = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const productsSearchController = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
