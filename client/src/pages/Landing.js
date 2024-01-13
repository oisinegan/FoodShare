import React, { useContext, useState, useEffect } from "react";
import { Context } from "../App";
import Nav from "../components/nav";

export default function Landing() {
  const [user, setUser] = useContext(Context);
  const [items, setItems] = useState({});

  const [responses, setResponses] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [greyButton, setGreyButton] = useState(false);
  // const [noItems, setNoItems] = useState({});

  // useEffect(() => {

  //   // Call the fetchData function inside the useEffect
  //   console.log("Calling");
  //   fetchAllItems();
  //   console.log("Called");
  //   // eslint-disable-next-line
  // }, []);

  // const fetchAllItems = async () => {
  //   //GET ALL HOMES
  //   fetch("/getAllItems")
  //     .then((res) => res.json())
  //     .then((items) => {
  //       setItems(items);
  //       //setNoItems(": " + Object.keys(items).length);
  //     });

  //   console.log(items["0"]);
  // };

  const registerInterest = async (item) => {
    console.log(user.name);
    const response = await fetch("/registerInterest", {
      method: "post",
      body: JSON.stringify({
        adId: item.id,
        author: item.userId,
        userInterested: user.id,
        userName: user.name,
      }),

      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result) {
      alert("Interest sent!");
    }
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
          className="fixed inset-0 overflow-y-scroll flex items-center  justify-center z-50"
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
                        <button className="text-white bg-blue-800 p-2 mt-4 rounded ">
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
      <div>
        {console.log(user)}
        <h1>1</h1>
      </div>
    </>
  );
}
