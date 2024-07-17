
export const isTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = atob(token);
    const payload = JSON.parse(atob(decodedToken.split('.')[1])); // Decode the JWT payload
    // console.log(payload,"<<payload-data")
    // console.log(payload.exp,"<<payload-exp")
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > exp;
};