import { Provider } from 'react-redux'
import { useStore } from '../redux/store'
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { CartProvider } from "react-use-cart";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <Provider store={store}>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </Provider>
  )
}