import React, { useContext, useState, useEffect } from "react";
import { myContext } from "./context";
import { Html5QrcodeScanner } from "html5-qrcode";
import Nav from "../components/nav";

export default function Landing() {
  const [scanResult, setScanResult] = useState(null);
  const [foodInfoName, setFoodInfoName] = useState(null);
  const [foodInfoBrand, setFoodInfoBrand] = useState(null);
  const [foodInfoImage, setFoodInfoImage] = useState(null);
  useEffect(() => {
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
      setScanResult(res);
      getOpenFoodFactsAPI(res);
    }
    function err(err) {
      console.warn(err);
    }

    scanner.render(success, err);
    // eslint-disable-next-line
  }, []);

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

  function getFoodInfo(name, brand, image) {
    setFoodInfoName(name);
    setFoodInfoBrand(brand);
    setFoodInfoImage(image);
  }

  const user = useContext(myContext);

  console.log(user);

  return (
    <>
      <Nav />
      <div>
        <h1 class="mb-4 text-4xl my-8 mb-12 font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Hello{" "}
          <span class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">
            {user.name}
          </span>
        </h1>

        {scanResult ? (
          <div>
            <p>success: {scanResult}</p>
          </div>
        ) : (
          <div id="reader">No scan result</div>
        )}

        {foodInfoName ? (
          <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
              <img class="rounded-t-lg w-full" src={foodInfoImage} alt="" />
            </a>
            <div class="p-5">
              <a href="#">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {foodInfoName}
                </h5>
              </a>
              <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {foodInfoBrand}
              </p>
            </div>
          </div>
        ) : (
          <div id="reader"></div>
        )}
      </div>
    </>
  );
}
//https://world.openfoodfacts.org/api/v2/product/716270001660.json
//image_front_url
//brand_owner
//product_name
