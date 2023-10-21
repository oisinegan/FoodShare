import "./App.css";
import React, { useEffect, useState } from "react";

function App() {
  const [exampleData, setExampleData] = useState();
  const [exampleDataDB, setExampleDataDB] = useState({});

  useEffect(() => {
    fetch("/exampleRouter")
      .then((res) => res.json())
      .then((data) => {
        setExampleData(data.message);
      });
  }, []);

  const retrieveItems = () => {
    fetch("/exampleDBconnection")
      .then((res) => res.json())
      .then((data) => {
        setExampleDataDB(data);
        console.log(data);
      }, []);
  };

  return (
    <div className="App">
      <h1 class="text-4xl font-bold   my-4">Test</h1>
      <p className="text-2xl font-semibold">
        {exampleData ? exampleData : "fetching from backend..."}
      </p>

      <button
        onClick={retrieveItems}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-8 py-2 px-4 rounded"
      >
        Database test
      </button>

      {exampleDataDB ? (
        Object.keys(exampleDataDB).map((key, index) => {
          return (
            <div key={index}>
              <p>
                ID: {exampleDataDB[key].id}, Text: {exampleDataDB[key].text}
              </p>
            </div>
          );
        })
      ) : (
        <p>exampleDataDB is null</p>
      )}
    </div>
  );
}

export default App;
