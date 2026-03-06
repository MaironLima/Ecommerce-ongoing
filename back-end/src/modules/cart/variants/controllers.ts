// import { Request, Response } from 'express';

// import {
//   productVariantCreateService,
//   productVariantGetService,
//   productVariantUpdateService,
//   productVariantDeleteService,
// } from './services';

// export async function createProductVariant(req:Request, res:Response) {
//   try {
//     const { name } = req.body;

//     const variant = await productVariantCreateService(productId, data);

//     res.status(201).json(variant);
//   } catch (e:any) {
//     res.status(400).json({ error: e.message });
//   }
// }

// export async function getProductVariant(req:Request, res:Response) {
//   try {
//     const { id } = req.params;
//     const variant = await productVariantGetService(id);
//     if (!variant) return res.status(404).json({ error: 'Variant not found' });
//     res.json(variant);
//   } catch (e:any) {
//     res.status(400).json({ error: e.message });
//   }
// }

// export async function updateProductVariant(req:Request, res:Response) {
//   try {
//     const { id } = req.params;
//     const data = req.body;
//     const variant = await productVariantUpdateService(id, data);
//     res.json(variant);
//   } catch (e:any) {
//     res.status(400).json({ error: e.message });
//   }
// }

// export async function deleteProductVariant(req:Request, res:Response) {
//   try {
//     const { id } = req.params;
//     await productVariantDeleteService(id);
//     res.status(204).end();
//   } catch (e:any) {
//     res.status(400).json({ error: e.message });
//   }
// }