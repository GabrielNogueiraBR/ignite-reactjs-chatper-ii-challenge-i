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
      if (!(await isProductValid(productId))) {
        toast.error("Erro na adição do produto");
      } else {
        const productInCart = cart.find((product) => product.id === productId);
        const productAmountAvailable = await isProductAvailableInStock({
          productId,
          amount: productInCart ? productInCart.amount + 1 : 1,
        });

        if (productAmountAvailable) {
          if (productInCart) {
            setNewCart(
              cart.map((product) => {
                if (product.id === productId) product.amount += 1;

                return product;
              })
            );
          } else {
            await api
              .get(`products/${productId}`)
              .then((response) => response.data)
              .then((product: Product) => {
                product.amount = 1;
                setNewCart([...cart, product]);
              });
          }
        }
      }
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productInCart = cart.find((product) => product.id === productId);

      if (!productInCart) {
        toast.error("Erro na remoção do produto");
      } else {
        setNewCart(cart.filter((product) => product.id !== productId));
      }
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

      if (!(await isProductValid(productId)))
        toast.error("Erro na alteração de quantidade do produto");

      if (await isProductAvailableInStock({ productId, amount })) {
        setNewCart(
          cart.map((product) => {
            if (product.id === productId) product.amount = amount;

            return product;
          })
        );
      } else {
        toast.error("Quantidade solicitada fora de estoque");
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
          return true;
        });
    } catch {
      toast.error("Quantidade solicitada fora de estoque");
      return false;
    }
  };

  const isProductValid = async (productId: number) => {
    try {
      return await api
        .get(`/products/${productId}`)
        .then((response) => response.data)
        .then((data: Product) => !!data)
        .catch(() => {
          throw new Error("Produto não existe");
        });
    } catch {
      return false;
    }
  };

  const setNewCart = (newCart: Product[]) => {
    setCart(newCart);
    localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
  };

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
