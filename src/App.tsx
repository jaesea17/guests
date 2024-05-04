// App.js

import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { ReturnedData, baseUrl, returnedData } from "./default";
import Login from "./Login";
import Add from "./Add";

function App() {
  const [data, setData] = useState([returnedData]);
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
      response.data.guests.length
        ? setData(response.data.guests)
        : setPage((prev) => --prev);
    } catch (error) {
      setMessage(error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const check = async (id: string, payload: boolean) => {
    const index = data.findIndex((obj: Record<string, any>) => obj.id === id);
    try {
      const response = await axios.patch(`${baseUrl}/guests/${id}`, {
        payload,
      });
      if (response.data.affected > 0) {
        setData((prev) => {
          prev[index].isChecked = payload;
          return [...prev];
        });
      }
    } catch (error) {
      setMessage(error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlDelete = async (id: string) => {
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
    fetchData();
  }, [page]);

  if (isLoading) {
    return <div>LOADING...</div>;
  }

  return (
    <div id="parent">
      <div id="display">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            name="q"
            placeholder="Search"
            value={query}
            onChange={handleInput}
          />
        </div>
        {data?.map((info: ReturnedData) => {
          return (
            <div key={info?.id}>
              <input
                type="checkbox"
                checked={info?.isChecked}
                onChange={() => check(info?.id, !info?.isChecked)}
              />
              {info?.name}
              {isLoggedIn && (
                <input
                  type="button"
                  value="remove"
                  onClick={() => handlDelete(info.id)}
                />
              )}
            </div>
          );
        })}
        <input
          type="button"
          value="back"
          onClick={() => setPage((prev) => --prev)}
        />
        <input
          type="button"
          value="next"
          onClick={() => setPage((prev) => ++prev)}
        />
      </div>
      <div id="addGuest">
        {/* Pass fetchData function as a prop to Add component */}
        {isLoggedIn && <Add fetchData={fetchData} setMessage={setMessage} />}
      </div>
      <div id="login">
        {!isLoggedIn && <Login setAttemptedLogin={setAttemptedLogin} />}
      </div>
      {message && <div>{message}</div>}
    </div>
  );
}

export default App;
