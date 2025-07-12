import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { AppState, AppAction, Invoice } from "../types";
import { useAuth } from "../hooks/useAuth";

const initialState: AppState = {
  company: {
    logo: "/images/default-logo.png",
    name: "Said Trasporto Gordola",
    address: "Via S.Gottardo 100,\n6596 Gordola",
    email: "Info@saidauto.ch",
    phone: "",
    currency: "CHF",
    language: "it",
    watermark: "",
    showNotes: false,
    showTerms: false,
    taxRate: 0,
  },
  clients: [],
  products: [],
  invoices: [],
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "UPDATE_COMPANY":
      return { ...state, company: action.payload };
    case "ADD_CLIENT":
      return {
        ...state,
        clients: [...state.clients, action.payload],
      };
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case "ADD_INVOICE":
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
      };
    case "UPDATE_CLIENT":
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.id === action.payload.id ? action.payload : client
        ),
      };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case "UPDATE_INVOICE":
      return {
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice.id === action.payload.id ? action.payload : invoice
        ),
      };
    case "ARCHIVE_CLIENT":
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.id === action.payload ? { ...client, archived: true } : client
        ),
      };
    case "UNARCHIVE_CLIENT":
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.id === action.payload ? { ...client, archived: false } : client
        ),
      };
    case "ARCHIVE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload
            ? { ...product, archived: true }
            : product
        ),
      };
    case "UNARCHIVE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload
            ? { ...product, archived: false }
            : product
        ),
      };
    case "LOAD_DATA":
      return action.payload;
    case "SET_CLIENTS":
      return { ...state, clients: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_INVOICES":
      return { ...state, invoices: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  loadUserData: () => Promise<void>;
  saveInvoice: (invoice: Partial<Invoice>) => Promise<boolean>;
  updateInvoice: (invoice: Partial<Invoice>) => Promise<boolean>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { state: authState } = useAuth();

  const loadUserData = useCallback(async () => {
    if (!authState.isAuthenticated || !authState.token) return;

    try {
      const headers = {
        Authorization: `Bearer ${authState.token}`,
        "Content-Type": "application/json",
      };

      // 1. Load company data first
      const companyResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/company`,
        { headers }
      );

      if (companyResponse.ok) {
        const companyData = await companyResponse.json();
        const savedCompany = companyData.data;

        // Update the app state with company data
        dispatch({ type: "UPDATE_COMPANY", payload: savedCompany });

        // 2. Update language in localStorage if it exists in company data
        if (savedCompany.language) {
          try {
            const currentStoredLanguage = JSON.parse(
              localStorage.getItem("language") || '"it"'
            );

            // Only update if different to avoid unnecessary re-renders
            if (currentStoredLanguage !== savedCompany.language) {
              localStorage.setItem(
                "language",
                JSON.stringify(savedCompany.language)
              );
            }
          } catch (error) {
            console.error("Error handling language in localStorage:", error);
            // Fallback to company language if localStorage fails
            localStorage.setItem(
              "language",
              JSON.stringify(savedCompany.language)
            );
          }
        }
      }

      // 3. Load other data (clients, products, invoices)
      const [clientsResponse, productsResponse, invoicesResponse] =
        await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/clients`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/products`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/invoices`, { headers }),
        ]);

      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        dispatch({ type: "SET_CLIENTS", payload: clientsData.data });
      }

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        dispatch({ type: "SET_PRODUCTS", payload: productsData.data });
      }

      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        dispatch({ type: "SET_INVOICES", payload: invoicesData.data.invoices });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, [authState.isAuthenticated, authState.token, dispatch]);

  const saveInvoice = async (invoice: Partial<Invoice>): Promise<boolean> => {
    if (!authState.isAuthenticated || !authState.token) return false;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoices`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoice),
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "ADD_INVOICE", payload: data.data });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving invoice:", error);
      return false;
    }
  };

  const updateInvoice = async (invoice: Partial<Invoice>): Promise<boolean> => {
    if (!authState.isAuthenticated || !authState.token) return false;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoices/${invoice.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoice),
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "UPDATE_INVOICE", payload: data.data });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating invoice:", error);
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (authState.isAuthenticated) {
        try {
          await loadUserData();
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      } else {
        dispatch({ type: "LOAD_DATA", payload: initialState });
      }
    };

    loadData();
  }, [authState.isAuthenticated, loadUserData]);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        loadUserData,
        saveInvoice,
        updateInvoice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export { AppContext };
