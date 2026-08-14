import { Request, Response } from 'express';
import { reviewDeleteService, reviewGetAllService, reviewGetService, reviewPostService,  } from './services';
import { reviewSchema } from './dto';

export const reviewGetAllController = async (_req: Request, res: Response) => {
  try {
    const reviews = await reviewGetAllService();

    return res.status(200).json({
      reviews,
    });
  } catch (e: any) {
    return res.status(500).json({
      error: e.message || 'Error listing reviews',
    });
  }
};

export const reviewGetController = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        error: 'The product ID has not been identified',
      });
    }

    const reviews = await reviewGetService(productId);

    return res.status(200).json({
      reviews,
    });
  } catch (e: any) {
    return res.status(500).json({
      error: e.message || 'Error listing reviews',
    });
  }
};

export const reviewPostController = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        error: 'The product ID has not been identified',
      });
    }

    const parsed = reviewSchema.safeParse(req.body);

    if (!parsed.success) {
      const firstMessage = parsed.error.issues[0]?.message || 'Validation error';

      return res.status(400).json({
        error: firstMessage,
      });
    }

    const { rating, title, comment } = parsed.data;

    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
      });
    }

    const review = await reviewPostService(productId, userId, rating, title, comment);

    return res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (e: any) {
    return res.status(500).json({
      error: e.message || 'Error creating review',
    });
  }
};

export const reviewDeleteController = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId;

    if (!reviewId) {
      return res.status(400).json({
        error: 'The review ID has not been identified',
      });
    }

    reviewDeleteService(reviewId);

    return res.status(204).send()
  } catch (e: any) {
    return res.status(500).json({
      error: e.message || 'Error listing reviews',
    });
  }
};