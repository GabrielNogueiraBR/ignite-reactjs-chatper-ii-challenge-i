import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface ProductAvailableInStock {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const productInCart = cart.find((product) => product.id === productId);

      if (productInCart)
        await updateProductAmount({
          productId,
          amount: productInCart.amount + 1,
        });
      else {
        if (await isProductAvailableInStock({ productId, amount: 1 })) {
          await api
            .get(`products/${productId}`)
            .then((response) => response.data)
            .then((product: Product) => {
              product.amount = 1;
              setCart([...cart, product]);
            });
        }
      }
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      setCart(cart.filter((product) => product.id !== productId));
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) return;

      if (await isProductAvailableInStock({ productId, amount })) {
        setCart(
          cart.map((product) => {
            if (product.id === productId) product.amount = amount;

            return product;
          })
        );
      }
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  const isProductAvailableInStock = async ({
    productId,
    amount,
  }: ProductAvailableInStock) => {
    try {
      return await api
        .get(`/stock/${productId}`)
        .then((response) => response.data)
        .then((data: Stock) => data.amount >= amount)
        .then((available) => {
          if (!available)
            throw new Error("Quantidade solicitada fora de estoque");
          return available;
        });
    } catch {
      toast.error("Quantidade solicitada fora de estoque");
      return false;
    }
  };

  useEffect(() => {
    localStorage.setItem("@RocketShoes:cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
