import React, { useContext, useState, useEffect } from "react";
import Nav from "../components/nav";
import { myContext } from "./Context";

export default function Profile() {
  const user = useContext(myContext);
  const [items, setItems] = useState({});
  const [responses, setResponses] = useState({});
  const [isClicked, setIsClicked] = useState(false);

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

  const openModal = () => {
    setIsClicked(true);
    document.body.classList.add("overflow-hidden");
  };

  const closeModal = () => {
    setIsClicked(false);
    document.body.classList.remove("overflow-hidden");
  };

  const fetchResponses = async (item) => {
    console.log(item);
    console.log(item.id);
    const response = await fetch("/getResponses", {
      method: "post",
      body: JSON.stringify({ item: item }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log(result[0]);
    setResponses(result);
    openModal();
  };

  const showResponses = () => {
    const validResponses = Object.entries(responses)
      .reverse()
      .filter(([index, item]) => item.userName);
    console.log(validResponses.length);
    if (validResponses.length === 0) {
      return (
        <div>
          <div
            className="fixed inset-0 bg-black opacity-70 z-40"
            onClick={() => closeModal()}
          />
          <div
            id="default-modal"
            tabindex="-1"
            aria-hidden="true"
            className="fixed inset-0 flex items-center  justify-center z-50"
          >
            <div class="relative p-4 w-full max-w-lg max-h-full">
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <h5 class="mb-2 text-2xl font-bold text-center tracking-tight p-4 text-gray-900 dark:text-white">
                  No responses yet
                </h5>

                <div class="flex justify-end  p-4 md:p-5 border-t border-gray-200  rounded-b dark:border-gray-600">
                  <button
                    data-modal-hide="default-modal"
                    onClick={() => closeModal()}
                    type="button"
                    class="ms-3 text-white text-lg bg-blue-800 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div
          className="fixed inset-0 bg-black opacity-70 z-40"
          onClick={() => closeModal()}
        />
        <div
          id="default-modal"
          tabindex="-1"
          aria-hidden="true"
          className="fixed inset-0 flex items-center  justify-center z-50"
        >
          <div class="relative p-4 w-full max-w-2xl max-h-full">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {validResponses.map(([index, item]) => (
                <div key={item.id}>
                  <div class=" bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-8">
                    <div class="p-5">
                      <p>
                        <h5 class="mb-2 text-5xl font-bold text-center tracking-tight text-gray-900 dark:text-white">
                          {item.userName}
                        </h5>
                      </p>

                      <div className="flex justify-center">
                        <button className="text-white bg-blue-800 p-1 mt-4 rounded ">
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div class="flex justify-end  p-4 md:p-5 border-t border-gray-200  rounded-b dark:border-gray-600">
                <button
                  data-modal-hide="default-modal"
                  onClick={() => closeModal()}
                  type="button"
                  class="ms-3 text-white text-lg bg-blue-800 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Nav />

      {user !== undefined && (
        <h1 class="mb-4 mx-16 text-4xl my-8 mb-12 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-left ">
          Hello{" "}
          <span class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">
            {user.name}
          </span>
        </h1>
      )}
      <h1 class="mb-4 mx-16  my-8 mb-12 text-5xl text-center font-bold leading-none tracking-tight text-gray-900  dark:text-white text-left ">
        Your ads
      </h1>

      {isClicked ? showResponses() : null}
      {console.log(items)}
      <div className="flex justify-center mt-16">
        <div className="carousel carousel-center w-3/4  space-x-4  rounded-box p-16 mx-4 bg-gray-100">
          {Object.entries(items)
            .reverse()
            .map(([index, item]) =>
              item ? (
                <div key={item.id}>
                  <div className="carousel-item  ">
                    <div className="  w-80">
                      <div class=" bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-4">
                        <p>
                          <img
                            class="rounded-t-lg h-72 w-full "
                            src={item.image_url}
                            alt=""
                          />
                        </p>
                        <div class="p-5">
                          <p>
                            <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                              {item.item}
                            </h5>
                          </p>
                          {/* <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                          {item.brand}
                        </p> */}
                          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            {item.category}
                          </p>

                          <div className="flex justify-center">
                            <button
                              className="text-white bg-blue-800 p-2 mt-4 rounded "
                              onClick={() => fetchResponses(item)}
                            >
                              View responses
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null
            )}
        </div>
      </div>
    </>
  );
}
