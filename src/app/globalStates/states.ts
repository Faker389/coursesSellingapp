import {create} from 'zustand';

interface isLoadingInterface {
    isLoading: boolean;
    setIsLoading: (newState: boolean) => void;
}

export const useIsLoading = create<isLoadingInterface>((set) => ({
  isLoading: true,
  setIsLoading: (newState) => set({ isLoading: newState }),
}));

interface errorInterface {
    error: boolean;
    setError: (newState: boolean) => void;
}

export const useError = create<errorInterface>((set) => ({
  error: true,
  setError: (newState) => set({ error: newState }),
}));

interface errorMessageInterface {
    errorMessage: string;
    setErrorMessage: (newState: string) => void;
}

export const useErrorMessage = create<errorMessageInterface>((set) => ({
  errorMessage: "",
  setErrorMessage: (newState) => set({ errorMessage: newState }),
}));

interface isSubmittedInterface {
    isSubmitted: boolean;
    setIsSubmitted: (newState: boolean) => void;
}

export const useIsSubmitted = create<isSubmittedInterface>((set) => ({
  isSubmitted: false,
  setIsSubmitted: (newState) => set({ isSubmitted: newState }),
}));

export const clearStates = () => {
  useIsLoading.getState().setIsLoading(false)
  useError.getState().setError(false)
  useErrorMessage.getState().setErrorMessage("")
  useIsSubmitted.getState().setIsSubmitted(false)

}

interface GlobalState {
  keyWord: string;
  setKeyWord: (newState: string) => void;
}

export const useMainRender = create<GlobalState>((set) => ({
  keyWord: "",
  setKeyWord: (newState) => set({ keyWord: newState }),
}));

interface PriceFromState {
    priceFrom: number;
    setPriceFrom: (newState: number) => void;
  }
  
  export const usePriceFrom = create<PriceFromState>((set) => ({
    priceFrom: 0,
    setPriceFrom: (newState) => set({ priceFrom: newState }),
  }));
  interface PriceToState {
    priceTo: number;
    setPriceTo: (newState: number) => void;
  }
  
  export const usePriceTo = create<PriceToState>((set) => ({
    priceTo: 0,
    setPriceTo: (newState) => set({ priceTo: newState }),
  }));

  interface searchTerm {
    searchTerm: string;
    setSearchTerm: (newState: string) => void;
  }
  
  export const useSearchTerm = create<searchTerm>((set) => ({
    searchTerm: "",
    setSearchTerm: (newState) => set({ searchTerm: newState }),
  }));

  interface isThisWindow {
    isThisWindow: string;
    setIsThisWindow: (newState: string) => void;
  }
  
  export const useIsThisWindow = create<isThisWindow>((set) => ({
    isThisWindow: "",
    setIsThisWindow: (newState) => {set({ isThisWindow: newState })},
  }));


  interface globalCookies {
    cookiesCrated: boolean;
    setCookiesCrated: (cookiesCrated: boolean) => void;
  }
  
  export const useCookiesSet = create<globalCookies>((set) => ({
    cookiesCrated: true,
    setCookiesCrated: (newState) => set({ cookiesCrated: newState }),
  }));
  

  interface useNavpos {
    state: boolean;
    setState: (newState: boolean) => void;
  }
  
  export const useNavPosition = create<useNavpos>((set) => ({
    state: false,
    setState: (newState) => set({ state: newState }),
  }));
  
  
  interface useCartPosition {
    cart: boolean;
    setCart: (newState: boolean) => void;
  }
  
  export const useCartPosition = create<useCartPosition>((set) => ({
    cart: false,
    setCart: (newState) => set({ cart: newState }),
  }));
  
  
  interface cartItemsCount {
    cartItemsCount: number;
    setCartItemsCount: (newState: number) => void;
  }
  
  export const useCartItemsCount = create<cartItemsCount>((set) => ({
    cartItemsCount: 0,
    setCartItemsCount: (newState) => set({ cartItemsCount: newState }),
  }));