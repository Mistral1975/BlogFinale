// app/blog/page.js
"use client";

import "../css/style.css";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import ListLayoutWithTags from "../layouts/ListLayoutWithTags";

const TagPage = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <body>
          <section className="sm:px-6 xl:max-w-5xl xl:px-0">
            <div className="container">
              <ListLayoutWithTags />
            </div>
          </section>
        </body>
      </PersistGate>
    </Provider>
  )
}

export default TagPage;