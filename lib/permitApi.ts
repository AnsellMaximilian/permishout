"server only";

import axios from "axios";

const permitApi = axios.create({
  baseURL: process.env.PERMIT_API_URL || "https://api.permit.io",
  headers: {
    Authorization: `Bearer ${process.env.PERMIT_SDK_KEY}`,
    "Content-Type": "application/json",
  },
});

export default permitApi;
