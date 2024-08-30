import { useState, useEffect, useRef } from "react";
import "./App.css";
import { url } from "./connection.js";

function App() {
  const [data, setData] = useState(null);
  const [oldPrice, setOldPrice] = useState(null);
  const priceRef = useRef(null); // Reference to the price div

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const marketData = JSON.parse(event.data);
      const currentPrice = parseFloat(marketData.p);

      setData(currentPrice);
      setOldPrice((prevPrice) => {
        if (prevPrice !== null) {
          if (currentPrice > prevPrice) {
            priceRef.current.style.color = "green";
          } else if (currentPrice == prevPrice) {
            priceRef.current.style.color = "black";
          } else {
            priceRef.current.style.color = "red";
          }
        }
        return currentPrice;
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <h1>BTC :</h1>
      <div id="c_price" ref={priceRef}>
        {data !== null ? data.toFixed(2) : "Loading..."}
      </div>
    </>
  );
}

export default App;
