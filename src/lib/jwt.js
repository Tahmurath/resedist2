export default function decodeJWT(token) {
    function base64UrlDecode(str) {
        // تبدیل Base64Url به Base64
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // اضافه کردن padding در صورت نیاز
        const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
        // رمزگشایی Base64
        return atob(padded);
    }

    try {
        // جدا کردن بخش‌های توکن
        const [header, payload, signature] = token.split('.');

        // رمزگشایی Header و Payload
        const decodedHeader = JSON.parse(base64UrlDecode(header));
        const decodedPayload = JSON.parse(base64UrlDecode(payload));

        // console.log('Header:', decodedHeader);
        // console.log('Payload:', decodedPayload);
        return decodedPayload;
    } catch (error) {
        console.error('Invalid JWT:', error);
        return null;
    }
}

export function getTokenFromCookie() {
    if (typeof window !== "undefined") {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find((row) => row.startsWith('Bearer='));
    //console.info(tokenCookie.split('=')[1])
    return tokenCookie ? tokenCookie.split('=')[1] : null;
    }
}

export function saveTokenToCookie(token) {
    if (typeof window !== "undefined") {
        document.cookie = `Bearer=${token}; max-age=${7 * 24 * 60 * 60}`;
    }
}

export function getUserFromToken() {

    const token2 = getTokenFromCookie()
    if (token2) {
        const tokendata = decodeJWT(token2)
        return tokendata
    }
}

export function isExpiredJwt() {
    const token = getTokenFromCookie()
    if (token) {
        const tokendata = decodeJWT(token)
        const ExpireAt = tokendata.ExpireAt
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (currentTimestamp > ExpireAt) {
            //console.log("منقضی شده است.");
            return false;
        } else {
            //console.log("هنوز منقضی نشده است.");
            return token;
        }
    } else {
        return false;
    }

}