import React, { useContext, useState, useEffect } from "react";
import { myContext } from "./Context";

import Nav from "../components/nav";

export default function Landing() {
  const [items, setItems] = useState({});
  // const [noItems, setNoItems] = useState({});
  const user = useContext(myContext);
  console.log(user);

  useEffect(() => {
    // Call the fetchData function inside the useEffect
    console.log("Calling");
    fetchAllItems();
    console.log("Called");
    // eslint-disable-next-line
  }, []);

  const fetchAllItems = async () => {
    //GET ALL HOMES
    fetch("/getAllItems")
      .then((res) => res.json())
      .then((items) => {
        setItems(items);
        //setNoItems(": " + Object.keys(items).length);
      });

    console.log(items["0"]);
  };

  return (
    <>
      <Nav />
      <div>
        <h1 class="mb-4 mx-4 text-4xl my-8 mb-12 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center ">
          Current{" "}
          <span class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">
            food items
          </span>
        </h1>
        <div className="flex">
          <div className="w-1/2 p-4">
            <h1 class="mb-4 text-4xl my-8 mb-12 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center ">
              <span class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">
                Dairy
              </span>
            </h1>

            <div className="carousel carousel-center w-full p-12 space-x-4  rounded-box p-4 bg-gray-100">
              {Object.entries(items)
                .reverse()
                .map(([index, item]) =>
                  item.category === "Dairy" ? (
                    <div key={item.id}>
                      <div className="carousel-item w-80 ">
                        <div class=" bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-8">
                          <p>
                            <img
                              class="rounded-t-lg w-full h-80 "
                              src={item.image_url}
                              alt=""
                            />
                          </p>
                          <div class="p-5">
                            <p>
                              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {item.item}
                              </h5>
                            </p>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                              {item.brand}
                            </p>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                              {item.category}
                            </p>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                              {item.userId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
            </div>
          </div>
          <div className="w-1/2 p-4 ">
            <h1 class="mb-4 text-4xl my-8 mb-12 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center ">
              <span class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">
                Sauces
              </span>
            </h1>

            <div className="carousel carousel-center w-full p-12 space-x-4  bg-gray-100 rounded-box">
              {Object.entries(items)
                .reverse()
                .map(([index, item]) =>
                  item.category === "Sauces" ? (
                    <div key={item.id}>
                      <div className="carousel-item w-80 ">
                        <div class=" bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-8">
                          <p>
                            <img
                              class="rounded-t-lg w-full h-80 "
                              src={item.image_url}
                              alt=""
                            />
                          </p>
                          <div class="p-5">
                            <p>
                              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {item.item}
                              </h5>
                            </p>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                              {item.brand}
                            </p>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                              {item.category}
                            </p>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                              {item.userId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
