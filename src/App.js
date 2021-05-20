import React, { useEffect, useState } from "react";
import {
  callGetApi,
  getSearchProduct,
  removeDuplicateProducts,
} from "./Utils";
import "./App.css";


const formatNumber = (number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

function App() {
  const [products, setProducts] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [errorReceived, setError] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    console.log("fetch");

    try {
      let result = await Promise.all([
        callGetApi(`api/branch1.json`),
        callGetApi(`api/branch2.json`),
        callGetApi(`api/branch3.json`),
      ]);

      //combine individual api result into one list
      result = result.reduce((accumulator, item) => {
        //   console.log('inside', accumulator, item);
        return [...accumulator, ...(item.products ? item.products : [])];
      }, []);

      //remove duplicate products
      result = removeDuplicateProducts(result);
      setProducts(result);
      console.log("onFetch", result.length);
    } catch (error) {
      setError(error);
    }
  }

  //   function handleInputChange(value){
  const searchProducts = products?.filter((product) => {
    const result = getSearchProduct(searchInput, product.name);
    return result;
  });
  // setProducts(searchProducts);
  console.log("product search", searchProducts);
  // };
  return (
    <div className="product-list">
      <label>Search Products</label>
      <input
      placeholder="Search products"
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      {searchProducts && searchProducts.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {searchProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{formatNumber(product.sold * product.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>
                {formatNumber(
                  searchProducts?.reduce(
                    (accumulator, item) =>
                      accumulator + item.sold * item.unitPrice,
                    0
                  )
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      ) : errorReceived ? (
        <div className="error-received">
          <p>Something went wrong. Please try again later</p>
        </div>
      ) : (
        //no. of products is 0
        <div className="data-not-found">
          <p>Found no products</p>
        </div>
      )}
    </div>
  );
}

export default App;
