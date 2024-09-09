// app/posts/[id]/page.js
"use client";

import "../../css/style.css";
import { Provider } from "react-redux";
import { store, persistor } from "../../store/store";
import { PersistGate } from "redux-persist/integration/react";
import SinglePostLayout from "../../layouts/SinglePostLayout";

const PostPage = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* <body className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white"> */}
          <body>
            {/* <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0"> */}
            <section className="sm:px-6 xl:max-w-5xl xl:px-0">
              {/* <div className="flex h-screen flex-col justify-between font-sans"> */}
              <div className="container">
                <SinglePostLayout />
              </div>
            </section>
          </body>
        </PersistGate>
      </Provider>
    </>
  )
};

export default PostPage;