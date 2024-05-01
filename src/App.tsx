// App.js

import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { ReturnedData, baseUrl } from "./default";
import Login from "./Login";
import Add from "./Add";

function App() {
  const [remove, setRemove] = useState("remove");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState({});
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [attemptedLogin, setAttemptedLogin] = useState(false);

  //functions
  const fetchData = async (param = "") => {
    try {
      const response = await axios.get(
        `${baseUrl}/guests?page=${page}&pageSize=${pageSize}&search=${param}`
      );
      setData(response.data.guests);
    } catch (error) {
      setMessage(error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const check = async (id: string, payload: boolean) => {
    try {
      const response = await axios.patch(`${baseUrl}/guests/${id}`, {
        payload,
      });
      if (response.status === 200) fetchData();
    } catch (error) {
      setMessage(error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (id: string) => {
    setIsChecked((prevState) => {
      return {
        ...prevState,
        [id]: !prevState[id],
      };
    });
  };

  const handlDelete = async (id: string) => {
    setRemove("removing...");
    try {
      const response = await axios.delete(`${baseUrl}/guests/${id}`);
      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      setMessage(error.message);
      setError(error.message);
    }
  };

  const handleInput = (e) => {
    setQuery(() => e.target.value);
  };

  const debounceSearch = () => {
    let fired = false;
    const debounce = setTimeout(() => {
      fetchData(query);
      fired = true;
    }, 1000);
    if (fired) clearTimeout(debounce);
  };
  const verifyLogin = () => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
    console.log({ isLoggedIn });
  };
  //useEffects
  useEffect(() => {
    fetchData();
    verifyLogin();
  }, []);

  useEffect(() => {
    verifyLogin();
  }, [attemptedLogin]);

  useEffect(() => {
    debounceSearch();
  }, [query]);

  useEffect(() => {
    const id = Object.keys(isChecked).at(-1) as string;
    const value = Object.values(isChecked).at(-1) as boolean;
    check(id, value);
  }, [isChecked]);

  return (
    <div id="parent">
      <div id="display">
        <div>
          <input
            type="text"
            id="search"
            name="q"
            placeholder="Enter your search term"
            value={query}
            onChange={handleInput}
          />
        </div>
        {isLoading && <div>Loading...</div>}
        {data?.map((info: ReturnedData) => {
          return (
            <div key={info?.id}>
              <input
                type="checkbox"
                checked={info?.isChecked}
                onChange={() => handleCheckboxChange(info?.id)}
              />
              {info?.name}
              {isLoggedIn && (
                <input
                  type="button"
                  value={remove}
                  onClick={() => handlDelete(info.id)}
                />
              )}
            </div>
          );
        })}
      </div>
      <div id="addGuest">
        {/* Pass fetchData function as a prop to Add component */}
        {isLoggedIn && <Add fetchData={fetchData} setMessage={setMessage} />}
      </div>
      <div id="login">
        <Login setAttemptedLogin={setAttemptedLogin} />
      </div>
      {message && <div>{message}</div>}
    </div>
  );
}

export default App;
