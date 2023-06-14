import LoginPage from "@/components/LoginPage";
import { getRequestCookie } from "@/lib/getRequestCookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {
    const admin = await getRequestCookie(cookies());

    if (admin) {
        redirect('/');
    }

    
    return (
        <>
            <LoginPage />
        </>
    )
}