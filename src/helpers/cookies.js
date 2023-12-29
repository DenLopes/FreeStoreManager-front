/**
 * Retrieves all cookies from the document and returns them as an object.
 * @returns {Object} An object with cookie names as keys and their values.
 */
export function getAllCookies() {
  const cookiesObj = {}
  document.cookie.split('; ').forEach((cookie) => {
    const [name, value] = cookie.split('=')
    cookiesObj[name] = decodeURIComponent(value)
  })
  return cookiesObj
}

/**
 * Retrieves a specific cookie value by its key.
 * @param {string} key - The name of the cookie to retrieve.
 * @returns {string} The value of the specified cookie.
 */
export function getCookie(key) {
  return getAllCookies()[key]
}

/**
 * Deletes a specific cookie by its key.
 * @param {string} key - The name of the cookie to delete.
 */
export function deleteCookie(key) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

/**
 * Saves a single cookie with the given name and value.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {Object} [options] - Optional configurations for the cookie.
 * @param {number} [options.days] - The number of days until the cookie expires.
 * @param {string} [options.path] - The path where the cookie is accessible.
 * @param {string} [options.domain] - The domain where the cookie is accessible.
 * @param {boolean} [options.secure] - Flag to specify if the cookie transmission requires a secure protocol.
 * @param {boolean} [options.httpOnly] - Flag to indicate that the cookie is accessible only through the HTTP protocol.
 * @param {string} [options.sameSite] - SameSite attribute for the cookie ('Strict', 'Lax', or 'None').
 */
export function saveCookie(name, value, options = {}) {
  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (options.days) {
    const date = new Date();
    date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  cookieString += options.path ? `; path=${options.path}` : '; path=/';
  cookieString += options.domain ? `; domain=${options.domain}` : '';
  cookieString += options.secure ? '; Secure' : '';
  cookieString += options.httpOnly ? '; HttpOnly' : '';
  cookieString += options.sameSite ? `; SameSite=${options.sameSite}` : '';

  document.cookie = cookieString;
}

