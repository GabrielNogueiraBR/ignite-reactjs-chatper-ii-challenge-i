import React, { useState, useEffect } from "react";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";
import CardProduct from "../../components/CardProduct";
import { ProductFormatted } from "../../types";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}
interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  // const cartItemsAmount = cart.reduce((sumAmount, product) => {
  //   // TODO
  // }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      api
        .get("/products")
        .then((response) => response.data)
        .then((data) =>
          data.map((product: Product) => {
            return {
              ...product,
              priceFormatted: formatPrice(product.price),
            };
          })
        )
        .then((products: ProductFormatted[]) => setProducts(products));
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      {products.map((product: ProductFormatted) => (
        <CardProduct
          key={product.id}
          product={product}
          handleAddProduct={handleAddProduct}
        />
      ))}
    </ProductList>
  );
};

export default Home;
