import React, { useContext, useState, useEffect } from "react";
import Nav from "../components/nav";
import { myContext } from "./Context";

export default function Profile() {
  const user = useContext(myContext);
  const [items, setItems] = useState({});

  useEffect(() => {
    // Call the fetchData function inside the useEffect
    console.log("Calling");

    if (user !== undefined) {
      fetchAllItems();
    }
    console.log("Called");
    // eslint-disable-next-line
  }, [user]);

  const fetchAllItems = async () => {
    const response = await fetch("/retrieveUserAds", {
      method: "post",
      body: JSON.stringify({ id: user.id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log(result[0]);
    setItems(result);
  };

  return (
    <>
      <Nav />

      {user !== undefined && (
        <h1 class="mb-4 mx-4 text-4xl my-8 mb-12 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-left ">
          Hello{" "}
          <span class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">
            {user.name}
          </span>
        </h1>
      )}
      <h1 class="mb-4 mx-4  my-8 mb-12 text-4xl font-bold leading-none tracking-tight text-gray-900  dark:text-white text-left ">
        Your ads
        <span class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">
          ...
        </span>
      </h1>

      <div className="carousel carousel-center w-full p-12 space-x-4  rounded-box p-4 bg-gray-100">
        {Object.entries(items)
          .reverse()
          .map(([index, item]) => (
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

                    <div className="flex justify-center">
                      <button className="text-white bg-blue-800 p-2 mt-4 rounded ">
                        View responses
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
