import { Permit } from 'permitio';
const permit = new Permit({
  // The token used for authenticating with the Permit.io API
  token: process.env.NEXT_PUBLIC_PERMIT_TOKEN,
  // The Policy Decision Point (PDP) URL that Permit.io uses to evaluate policies
  pdp: "https://cloudpdp.api.permit.io",
});
export default permit;
