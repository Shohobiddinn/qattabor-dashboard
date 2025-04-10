import { alertWarning } from './alertWarning'
export default async function handleError(error: any) {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    if (error.code === "ERR_NETWORK") {
        alertWarning("warning", "Internet bilan aloqa yo'q!");
    } else if (status) {
        if (status === 400) {
            if (detail !== "Inactive user" && detail !== "Token error") {
                alertWarning("warning", detail);
            }
        } else if (status === 401) {
            if (!window.location.href.includes("/sign-in")) {
                // navigateTo("/sign-in");
            }
        }
    }
}
