import React, { useContext, useState } from "react";
import { myContext } from "./Context";
import { Html5QrcodeScanner } from "html5-qrcode";
import Nav from "../components/nav";
import moment from "moment";

export default function Post() {
  const user = useContext(myContext);

  console.log(user);

  const [foodInfoName, setFoodInfoName] = useState(null);
  const [foodInfoBrand, setFoodInfoBrand] = useState(null);
  const [foodInfoImage, setFoodInfoImage] = useState(null);
  const [foodInfoCategories, setFoodInfoCategories] = useState(null);
  const [isScanItemPressed, setIsScanItemPressed] = useState(false);

  const scanItem = () => {
    setIsScanItemPressed(true);
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      []
    );

    function success(res) {
      scanner.clear();

      getOpenFoodFactsAPI(res);
    }
    function err(err) {
      console.warn(err);
    }

    scanner.render(success, err);
    // eslint-disable-next-line
  };

  function getOpenFoodFactsAPI(res) {
    fetch("https://world.openfoodfacts.org/api/v2/product/" + res + "json")
      .then((response) => response.json())
      .then((data) =>
        getFoodInfo(
          data.product.product_name,
          data.product.brands,
          data.product.image_front_url,
          data.product.categories
        )
      )
      .catch((error) => console.error("Error fetching data:", error));
  }

  async function postAd() {
    const date = moment().format("DD MM YYYY, h:mm:ss");

    const adInfo = {
      item: foodInfoName,
      image_url: foodInfoImage,
      brand: foodInfoBrand,
      category: foodInfoCategories,
      userId: user.id,
      dateTime: date,
    };

    const response = await fetch("/PostAd", {
      method: "post",
      body: JSON.stringify(adInfo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result) {
      window.location.href = "https://localhost:3000";
    }
  }

  function getFoodInfo(name, brand, image, category) {
    setFoodInfoName(name);
    setFoodInfoBrand(brand);
    setFoodInfoImage(image);
    setFoodInfoCategories(category);
  }

  return (
    <div className="p-4  ">
      <Nav />
      <div className="flex flex-col">
        <h1 class="mb-4 text-4xl my-8 mb-12 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center ">
          Post your{" "}
          <span class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">
            food item!
          </span>
        </h1>

        <div className="flex justify-center mt-4">
          <button
            className="text-white bg-blue-800 p-2 rounded "
            onClick={scanItem}
          >
            Upload now!
          </button>

          {isScanItemPressed === true ? (
            <button
              className="text-white bg-blue-400 p-2 mx-4 rounded "
              onClick={() => setIsScanItemPressed(false)}
            >
              Cancel
            </button>
          ) : (
            <div />
          )}
        </div>

        <div className="flex justify-center p-8 ">
          {isScanItemPressed === true ? (
            <div id="reader" className="bg-blue-100 rounded "></div>
          ) : (
            <div className="hidden">h</div>
          )}
        </div>

        {foodInfoName ? (
          <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <p>
              <img class="rounded-t-lg w-full" src={foodInfoImage} alt="" />
            </p>
            <div class="p-5">
              <p>
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {foodInfoName}
                </h5>
              </p>
              <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {foodInfoBrand}
              </p>
              <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {foodInfoCategories}
              </p>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <div className="flex justify-center">
          {isScanItemPressed === true ? (
            <button
              className="text-white  bg-green-500  p-2 rounded "
              onClick={postAd}
            >
              {" "}
              Post
            </button>
          ) : (
            <div className="hidden">h</div>
          )}
        </div>
      </div>
    </div>
  );
}
