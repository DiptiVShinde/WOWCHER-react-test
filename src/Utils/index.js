export const callGetApi = (url) => fetch(url).then((res) => res.json());
export const sortByName = (products) => {
  console.log("sortByName", products);
  return products.sort((a, b) => (a?.name > b?.name ? 1 : -1));
};
export const removeDuplicateProducts = (products) => {
  //   return sortByName(Array.from(new Set(products.map((item) => item.id)))
  //   .map(id=>{
  //     return products.find(a => a.id === id)
  //   }));
  for (var i = 0; i <= products.length - 2; i++) {
    for (var j = i + 1; j <= products.length - 1; j++) {
      if (products[i].id === products[j].id) {
        products[i].sold = products[i].sold + products[j].sold;
        products.splice(j, 1);
      }
    }
  }
  return sortByName(products);
};

export const getSearchProduct = (searchInput, productName) => {
  productName = productName.toLowerCase();
  searchInput = searchInput.toLowerCase();
  return productName.includes(searchInput);
};
