import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { baseUrl } from "./default";

export default function ({ setAttemptedLogin }) {
  const [password, setPassword] = useState("");
  const [value, setValue] = useState("Login");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedLogin((prev: boolean) => !prev);
    setPassword("");
    setValue("Logining...");
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        email: "",
        password,
      });
      if (response.data) {
        localStorage.setItem("token", response.data);
        setAttemptedLogin((prev) => !prev);
        setValue("Login");
      }
    } catch (error) {
      setValue("Login");
    }
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
        <input type="submit" value={value} />
      </form>
    </div>
  );
}
