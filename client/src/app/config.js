import axios from "axios";

export const api = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_ENV === "development"
            ? `http://localhost:4000`
            : `${process.env.NEXT_PUBLIC_API_URL}/api`,
    withCredentials: true,
    timeout: 10000,
});

export const MEDIA_URL =
  process.env.NEXT_PUBLIC_ENV === "development"
    ? "http://localhost:4000"
    : process.env.NEXT_PUBLIC_API_URL;

// import axios from "axios";

// console.log("ENV:", process.env.NEXT_PUBLIC_ENV);
// console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);

// export const api = axios.create({
//   baseURL: "http://localhost:4000",
//   withCredentials: true,
//   timeout: 10000,
// });