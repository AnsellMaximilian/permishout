import { Permit } from "permitio";
const permit = new Permit({
  token: process.env.PERMIT_SDK_KEY,
  pdp: process.env.PERMIT_PDP_URL,
  apiUrl: process.env.PERMIT_API_URL || "https://api.permit.io",
});

export default permit;
