// app/page.js
"use client";

import "./css/style.css";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import HomeLayout from "./layouts/HomeLayout";

const HomePage = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <body>
          <section className="sm:px-6 xl:max-w-5xl xl:px-0">
            <div className="container">
              <HomeLayout />
            </div>
          </section>
        </body>
      </PersistGate>
    </Provider>
  );
};

export default HomePage;

