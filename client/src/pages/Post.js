import React, { useContext, useState, useRef, useCallback } from "react";
import Nav from "../components/nav";
import Webcam from "react-webcam";
import { Context } from "../App";

export default function Post() {
  // eslint-disable-next-line
  const [user, setUser] = useContext(Context);
  const webCam = useRef(null);
  const [imgSource, setImgSource] = useState(null);
  const [isPhoto, setIsPhoto] = useState(false);

  console.log(user);

  const [foodInfo, setFoodInfo] = useState({
    foodName: null,
    brand: null,
    size: null,
    measurementType: null,
    quant: null,
    extraInfo: null,
    postTo: null,
    expiraryDate: null,
  });

  async function postAd() {
    if (imgSource === null) {
      alert("Upload an image!");
    } else {
      const adInfo = {
        // item: foodInfoName,
        // image_url: imgSource,
        // brand: foodInfoBrand,
        // category: foodInfoCategory,
        // userId: user.id,
        // userName: user.name,
        // dateTime: date,
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
            {/* <div className="flex flex-col  justify-center mt-8">
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
            </div> */}

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
                  value={foodInfo.foodName}
                  onChange={(event) =>
                    setFoodInfo((prevFoodInfo) => ({
                      ...prevFoodInfo,
                      foodName: event.target.value,
                    }))
                  }
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
                  id="foodBrand"
                  required
                  value={foodInfo.brand}
                  onChange={(event) =>
                    setFoodInfo((prevFoodInfo) => ({
                      ...prevFoodInfo,
                      brand: event.target.value,
                    }))
                  }
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="mb-5">
                <label
                  for="size"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Size
                </label>
                <div class="sm:flex rounded-lg shadow-sm">
                  <input
                    type="number"
                    id="foodSize"
                    required
                    value={foodInfo.size}
                    onChange={(event) =>
                      setFoodInfo((prevFoodInfo) => ({
                        ...prevFoodInfo,
                        size: event.target.value,
                      }))
                    }
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  <select
                    id="measurementType"
                    value={foodInfo.measurementType}
                    required
                    onChange={(event) =>
                      setFoodInfo((prevFoodInfo) => ({
                        ...prevFoodInfo,
                        measurementType: event.target.value,
                      }))
                    }
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="kilograms">Kilograms</option>
                    <option value="grams">Grams</option>
                    <option value="litres">Litres</option>
                    <option value="milliliters">Milliliters</option>
                  </select>
                </div>
              </div>

              <div className="mb-5">
                <label
                  for="date"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Epirary date
                </label>

                <input
                  type="date"
                  id="date"
                  required
                  value={foodInfo.date}
                  onChange={(event) =>
                    setFoodInfo((prevFoodInfo) => ({
                      ...prevFoodInfo,
                      date: event.target.value,
                    }))
                  }
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="mb-5">
                <label
                  for="date"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Post to
                </label>

                <select
                  id="postTo"
                  value={foodInfo.postTo}
                  required
                  onChange={(event) =>
                    setFoodInfo((prevFoodInfo) => ({
                      ...prevFoodInfo,
                      postTo: event.target.value,
                    }))
                  }
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="General">General</option>
                  <option value="Group">Group</option>
                </select>
              </div>

              <div class="mb-5">
                <label
                  for="foodItem"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Extra information
                </label>
                <textarea
                  id="extraInfo"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(event) =>
                    setFoodInfo((prevFoodInfo) => ({
                      ...prevFoodInfo,
                      extraInfo: event.target.value,
                    }))
                  }
                ></textarea>
              </div>

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
            <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              {imgSource ? (
                <img class="rounded-t-lg w-full " src={imgSource} alt="" />
              ) : (
                <div className=" w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
              <div class="flex flex-col justify-between p-4 leading-normal">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {foodInfo.foodName}
                </h5>
                <p>Brand: {foodInfo.brand}</p>
                <p>
                  Size: {foodInfo.size} {foodInfo.measurementType}
                </p>
                <p>Expiry: {foodInfo.date}</p>
                <p>Post to: {foodInfo.postTo}</p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Extra Info: {foodInfo.extraInfo}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
