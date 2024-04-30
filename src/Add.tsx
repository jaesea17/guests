import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "./default";

export default function Add({ fetchData }) {
  const [input, setInput] = useState("");
  const [pLoad, setPLoad] = useState([{}]);
  const [error, setError] = useState(null);

  const handleInput = (e) => {
    setInput(() => e.target.value);
  };
  const createLoad = () => {
    const loads = input.split(",");
    const arrCont: Record<string, string>[] = [];
    for (const load of loads) {
      const container = { name: load };
      arrCont.push(container);
    }
    setPLoad(arrCont);
    setInput("");
  };

  const handleSubmit = async (payload: Record<string, string>[]) => {
    try {
      const response = await axios.post(`${baseUrl}/guests`, payload);
      console.log({ response });
      if (response.status === 201) fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    handleSubmit(pLoad);
  }, [pLoad]);
  return (
    <div>
      <input
        type="text"
        id="addGuests"
        name="q"
        value={input}
        onChange={handleInput}
      />
      <button type="submit" onClick={createLoad}>
        add
      </button>
    </div>
  );
}
