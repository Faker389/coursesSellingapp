import Cookies from 'js-cookie'
interface Data {
  ID: string;
  email: string;
  name: string;
  phoneNumber: string;
  image: string;
};
// zapisanie danych użytkownika
export function saveCookies(data:Data){
  Cookies.set("user",JSON.stringify(data),{expires:365})
  return true
}
// zwrócenie danych użytkownika
export function getCookies(){
  const data = Cookies.get("user");
  if(data){
    return JSON.parse(data);
  }
  return null
}
// usuwanie użytkownika
export function removeCookie(){
  Cookies.remove("user")
}

interface Cart {
  id: string;
  title: string;
  price: number;
  image: string;
}
// pobranie obecnego koszyka dla danego id użytkownika
export function getCart(userID: string): Cart[] {
  const data = Cookies.get("cart");
  if (data) {
    const parsedData = JSON.parse(data);
    return parsedData[userID] || [];
  }
  return [];
}
// sprawdzajaca czy koszyk zawiera juz dany kurs
function ifIncludes(data: Cart[], dataToCheck: Cart): boolean {
  return data.some((item: Cart) => item.id === dataToCheck.id);
}
// dodawanie rzeczy do koszyka i zmiana ilosci
export function addToCart(
  userID: string,
  data: Cart,
  setCartItemsCount: (count: number) => void
) {
  const currentCart = Cookies.get("cart");
  const parsedCart = currentCart ? JSON.parse(currentCart) : {};

  if (typeof parsedCart !== "object" || Array.isArray(parsedCart)) {
    console.error("Invalid cart structure in cookies");
    Cookies.set("cart", JSON.stringify({ [userID]: [] }), { expires: 15 });
    return;
  }

  const userCart = parsedCart[userID] || [];

  if (ifIncludes(userCart, data)) {
    console.log("Item is already in the cart.");
    return;
  }

  const updatedUserCart = [...userCart, data];
  parsedCart[userID] = updatedUserCart;

  Cookies.set("cart", JSON.stringify(parsedCart), { expires: 15 });

  setCartItemsCount(updatedUserCart.length);

  console.log("Item added to cart:", data);
}
// usuniecie koszyka
export function removeCart(){
  Cookies.remove("cart")
}
// usuniecie poszegolnych rzeczy z koszyka i zmiana ilosci
export function removeItemFromCart(
  userID: string,
  itemId: string,
  setCartItemsCount: (count: number) => void,
) {
  const currentCart = Cookies.get("cart");
  if (!currentCart) return [];

  const parsedCart = JSON.parse(currentCart);

  const userCart = parsedCart[userID] || [];

  const updatedUserCart = userCart.filter((item: Cart) => item.id !== itemId);
  parsedCart[userID] = updatedUserCart;

  Cookies.set("cart", JSON.stringify(parsedCart), { expires: 15 });

  setCartItemsCount(parsedCart[userID].length);

  return updatedUserCart;
}