import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "./default";

export default function Add({ fetchData, setMessage }) {
  const [input, setInput] = useState("");
  const [pLoad, setPLoad] = useState([{}]);
  const [error, setError] = useState(null);

  const handleInput = (e) => {
    setInput(() => e.target.value);
  };
  const createLoad = (e) => {
    e.preventDefault();
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
      if (response.status === 201) {
        fetchData();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    handleSubmit(pLoad);
  }, [pLoad]);
  return (
    <div>
      <form onSubmit={createLoad}>
        <input
          type="text"
          id="addGuests"
          name="q"
          value={input}
          onChange={handleInput}
          required
        />
        <button type="submit">add</button>
      </form>
    </div>
  );
}
