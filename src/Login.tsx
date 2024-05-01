import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { baseUrl } from "./default";

export default function ({ setAttemptedLogin }) {
  const [password, setPassword] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedLogin((prev: boolean) => !prev);
    setPassword("");
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        email: "",
        password,
      });
      if (response.data) {
        localStorage.setItem("token", response.data);
      }
    } catch (error) {}
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="login"
          name="q"
          onChange={handleChange}
          placeholder="Enter password"
          required
        />
        <button type="submit">login</button>
      </form>
    </div>
  );
}
