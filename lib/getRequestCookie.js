import { unsealData } from "iron-session";  

export async function getRequestCookie(cookies) {
    const cookieName = "nextsession";
    const found = cookies.get(cookieName);

    if (!found) return null;
    const { state } = await unsealData(found.value, { password: process.env.COOKIE_PASSWORD });
    return state; 
}