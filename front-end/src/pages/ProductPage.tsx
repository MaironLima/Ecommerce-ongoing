import { Plus, Minus } from "lucide-react";
import publicAPI from "@/services/api/publicApi";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import UniversalBreadcrum from "@/components/UniversalBreadcrum";

interface Product {
  id: string;
  title: string;
  description: string;
  base_price: number;
  main_image: string;
  product_category: string[];
  extra_imagens: string[];
}

interface Variant {
  id: string;
  attributes: Record<string, string> | null;
  priceOverride: number | null;
  stock: number;
}

function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState<number>(1);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<number>(0);
  const activeVariantRef = useRef<HTMLDivElement | null>(null);

  const {
    data: product,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
  } = useQuery<Product>({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await publicAPI.get(`/products/${id}`);
      const result = response.data?.result ?? response.data;
      if (!result) throw new Error("Product not found");
      return {
        ...result,
        product_category: (result.product_category ?? [])
          .map(
            (pc: { category_sync?: { name?: string } }) =>
              pc.category_sync?.name,
          )
          .filter((name: string | undefined): name is string => Boolean(name)),
        extra_imagens: (result.extra_imagens ?? []).flatMap(
          (e: { path?: string[] }) => e.path ?? [],
        ),
      };
    },
  });

  const images = useMemo(() => {
    if (!product) return [];
    return [product.main_image, ...(product.extra_imagens ?? [])].filter(
      Boolean,
    );
  }, [product]);

  const {
    data: variants,
    isLoading: isLoadingVariants,
    isError: isErrorVariants,
  } = useQuery<Variant[]>({
    queryKey: ["variants", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await publicAPI.get(`/variants/${id}`);
      const results: Variant[] = response.data?.variants ?? [];
      return results;
    },
  });

  const activeVariant =
    variants?.find((v) => v.id === activeVariantId) ?? variants?.[0] ?? null;

  if (isLoadingProduct || isLoadingVariants)
    return (
      <div className="min-h-svh flex items-center justify-center bg-background">
        <Header />
        <div className="global-card animate-pulse text-muted-foreground">
          Loading product...
        </div>
      </div>
    );
  if (isErrorProduct || !product)
    return (
      <div className="min-h-svh flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="global-card text-destructive-foreground bg-destructive/10 border-destructive/30">
            Product not found.
          </div>
        </div>
      </div>
    );
  if (isErrorVariants)
    return (
      <div className="min-h-svh flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="global-card text-destructive-foreground bg-destructive/10 border-destructive/30">
            Variants not found.
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <Header />
      <div className="w-full max-w-7xl mx-auto px-6 pt-4">
        <UniversalBreadcrum
          labels={[
            "Products",
            ...Array.from(new Set(product.product_category)),
            product.title,
          ]}
        />
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-7xl w-full mx-auto items-start">
<div className="global-card p-3 flex flex-col items-center justify-center gap-3">
          {images.length ? (
            <>
              <div className="flex items-center justify-center w-full">
                <img
                  key={activeImage}
                  src={`${publicAPI.defaults.baseURL}/uploads?path=${encodeURIComponent(images[activeImage])}`}
                  crossOrigin="anonymous"
                  alt={`${product.title} ${activeImage + 1}`}
                  className="max-w-[580px] max-h-[480px] w-full h-full object-contain rounded-xl"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {images.map((img, i) => {
                  const isActive = i === activeImage;
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={
                        "h-16 w-16 rounded-md border overflow-hidden transition-colors " +
                        (isActive
                          ? "border-primary bg-primary/10 cursor-default"
                          : "border-border hover:border-primary hover:bg-primary/5 cursor-pointer")
                      }
                      title={`View image ${i + 1}`}
                    >
                      <img
                        src={`${publicAPI.defaults.baseURL}/uploads?path=${encodeURIComponent(img)}`}
                        crossOrigin="anonymous"
                        alt={`${product.title} preview ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              No images available.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5 bg-muted/50 global-card">
          <div>
            <h1 className="text-3xl font-bold text-foreground capitalize">
              {product.title}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.product_category.length ? (
                product.product_category.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs capitalize px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30"
                  >
                    {cat}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  Uncategorized
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <h3 className="text-2xl font-semibold text-primary">
              R$ {activeVariant?.priceOverride ?? product.base_price}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  className="global-btn bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm p-2"
                  onClick={() =>
                    setQuantity((prev) => (prev - 1 <= 0 ? 1 : prev - 1))
                  }
                  title="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <p className="text-2xl text-primary font-semibold w-6 text-center">
                  {quantity}
                </p>
                <button
                  className="global-btn bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm p-2"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  title="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button className="global-btn">
                Add to cart
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Variants
            </h2>
            <div className="flex flex-wrap gap-3">
              {variants?.length ? (
                variants.map((variant) => {
                  const isActive = variant.id === (activeVariant?.id ?? null);
                  const soldOut = variant.stock === 0;
                  return (
                    <div
                      ref={isActive ? activeVariantRef : null}
                      key={variant.id}
                      onClick={
                        soldOut
                          ? undefined
                          : () => setActiveVariantId(variant.id)
                      }
                      className={
                        "min-w-[120px] rounded-xl p-3 border text-sm transition-colors " +
                        (soldOut
                          ? "border-muted-foreground/20 opacity-30 grayscale cursor-not-allowed line-through"
                          : isActive
                            ? "border-primary bg-primary/10 cursor-pointer shadow-sm"
                            : "border-primary/40 hover:border-primary hover:bg-primary/5 cursor-pointer")
                      }
                    >
                      {Object.entries(variant.attributes ?? {}).map(
                        ([key, value]) => (
                          <p key={key} className="capitalize text-foreground">
                            <span className="text-muted-foreground">
                              {key}:
                            </span>{" "}
                            <span className="font-medium">{value}</span>
                          </p>
                        ),
                      )}
                      <p
                        className={
                          "mt-1 text-xs " +
                          (variant.stock <= 5
                            ? "text-destructive"
                            : "text-muted-foreground")
                        }
                      >
                        Stock: {variant.stock}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  No variants available.
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Description
            </h2>
            <p className="text-foreground/90 leading-relaxed whitespace-pre-line min-h-[202px]">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
