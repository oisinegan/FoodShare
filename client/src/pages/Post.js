import React, { useContext, useState, useRef, useCallback } from "react";
import { myContext } from "./Context";
import { Html5QrcodeScanner } from "html5-qrcode";
import Nav from "../components/nav";
import moment from "moment";
import Webcam from "react-webcam";

export default function Post() {
  const user = useContext(myContext);
  const webCam = useRef(null);
  const [imgSource, setImgSource] = useState(null);
  const [isPhoto, setIsPhoto] = useState(false);

  console.log(user);

  const [foodInfoName, setFoodInfoName] = useState(null);
  const [foodInfoBrand, setFoodInfoBrand] = useState(null);
  const [foodInfoCategory, setFoodInfoCategory] = useState(null);
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
          data.product.image_front_url
        )
      )
      .catch((error) => console.error("Error fetching data:", error));
  }

  async function postAd() {
    if (imgSource === null) {
      alert("Upload an image!");
    } else {
      const date = moment().format("DD MM YYYY, h:mm:ss");

      const adInfo = {
        item: foodInfoName,
        image_url: imgSource,
        brand: foodInfoBrand,
        category: foodInfoCategory,
        userId: user.id,
        userName: user.name,
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
  }

  function getFoodInfo(name, brand, image) {
    setFoodInfoName(name);
    setFoodInfoBrand(brand);
    setImgSource(image);
  }

  const takePicture = useCallback(() => {
    setImgSource(webCam.current.getScreenshot());
  }, [webCam]);

  const retakePicture = () => {
    setImgSource(null);
  };

  const updateIsPhoto = () => {
    setIsPhoto(true);
  };
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
        <div className="flex w-full justify-center items-center  mt-20">
          <div className="w-1/2 ">
            <div className="flex flex-col  justify-center mt-8">
              <div className="flex justify-center">
                <button
                  className="text-white bg-blue-800 p-4 rounded "
                  onClick={scanItem}
                >
                  Quick upload now!
                </button>
              </div>

              <div className="flex justify-center mt-2">
                {isScanItemPressed === true ? (
                  <button
                    className="text-white bg-blue-400 p-2 mx-4 rounded "
                    onClick={() => setIsScanItemPressed(false)}
                  >
                    Cancel
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {isScanItemPressed === true ? (
              <div className="flex justify-center p-8 ">
                <div id="reader" className="bg-blue-100 rounded "></div>
              </div>
            ) : (
              <></>
            )}

            <div class="inline-flex items-center justify-center w-full">
              <hr class="w-1/2 h-1  bg-gray-800   dark:bg-gray-700" />
            </div>

            <form class="w-1/2 mx-auto mt-6" onSubmit={postAd}>
              <div class="mb-5">
                <label
                  for="foodItem"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Food item
                </label>
                <input
                  type="text"
                  id="foodItem"
                  required
                  value={foodInfoName}
                  onChange={(event) => setFoodInfoName(event.target.value)}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div class="mb-5">
                <label
                  for="foodItem"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="foodItem"
                  required
                  value={foodInfoBrand}
                  onChange={(event) => setFoodInfoBrand(event.target.value)}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Food category
              </label>
              <select
                id="countries"
                value={foodInfoCategory}
                required
                onChange={(event) => setFoodInfoCategory(event.target.value)}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Please choose a category</option>
                <option value="Dairy">Dairy</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Cereal grains">Cereal grains</option>
                <option value="Protein">Protein</option>
                <option value="Snacks">Snacks</option>
                <option value="Drinks">Drinks</option>
                <option value="Alcohol">Alcohol</option>
                <option value="Sauces">Sauces</option>
              </select>

              <div className="flex justify-center mt-8">
                {isPhoto === true ? (
                  <div className="flex flex-col w-1/2 justify-center items-center">
                    {imgSource ? (
                      <img src={imgSource} alt="Your food item" />
                    ) : (
                      <Webcam height={500} width={500} ref={webCam} />
                    )}

                    <div className="flex mt-4">
                      {imgSource ? (
                        <div>
                          <button
                            className="text-white bg-blue-800 p-2 rounded mx-2"
                            onClick={retakePicture}
                          >
                            Retake
                          </button>

                          <button
                            className="text-white bg-blue-800 p-2 rounded mx-2"
                            onClick={() => setIsPhoto(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            className="text-white bg-blue-800 p-2 rounded mx-2 "
                            onClick={takePicture}
                          >
                            Capture
                          </button>
                          <button
                            className="text-white bg-blue-800 p-2 rounded mx-2"
                            onClick={() => setIsPhoto(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      <div></div>
                    </div>
                  </div>
                ) : (
                  <button
                    className="text-white bg-blue-800 p-2 rounded mx-2"
                    onClick={updateIsPhoto}
                  >
                    Update Photo
                  </button>
                )}
              </div>
              <div className="flex justify-center mt-4">
                <button
                  className="text-white  bg-green-500   px-12 py-4 rounded "
                  type="submit"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
          <div className=" w-1/2 flex justify-center">
            <div class="w-3/4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <p>
                {imgSource ? (
                  <img
                    class="rounded-t-lg w-full max-h-96"
                    src={imgSource}
                    alt=""
                  />
                ) : (
                  <div className=" w-full h-96 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600">No Image</span>
                  </div>
                )}
              </p>
              <div class="p-5">
                {foodInfoName ? (
                  <p class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {foodInfoName}
                  </p>
                ) : (
                  <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Item name
                  </h5>
                )}

                {foodInfoBrand ? (
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {foodInfoBrand}
                  </p>
                ) : (
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Food Brand
                  </p>
                )}

                {foodInfoCategory ? (
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {foodInfoCategory}
                  </p>
                ) : (
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    choose a food category!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
