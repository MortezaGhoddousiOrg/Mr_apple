import axios from "axios";

export const api = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_ENV === "development"
            ? `http://localhost:4000`
            : `${process.env.NEXT_PUBLIC_API_URL}/api`,
    withCredentials: true,
    timeout: 10000,
});
