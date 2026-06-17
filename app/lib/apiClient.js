const BASE_URL = "https://dummyjson.com";

// REQUEST FUNCTION

async function request(
  endpoint,
  {
    method = "GET",
    body = null,
    headers = {},
    cache = "force-cache",
    revalidate = false, 
    tags = [],
  } = {}
) {
  try {
    const options = {
      method,

      headers: {
        "Content-Type": "application/json",
        ...headers,
      },

      cache,

      next: revalidate
      ? {
        revalidate,
        tags,
      }
      : undefined,
    };

    // Body
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(
      `${BASE_URL}${endpoint}`,
      options
    );

    // error
    if (!response.ok) {
      throw new Error(
        `Request Failed: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "API CLIENT ERROR:",
      error.message
    );

    throw error;
  }
  
}

// GET

export async function get(
  endpoint,
  options = {}
) {
  return request(endpoint, {
    method: "GET",
    ...options,
  });
}

// Post

export async function post(
  endpoint,
  body,
  options ={}
) {
  return request(endpoint, {
    method: "POST",
    body,
    cache: "no-store",
    ...options,
  });
}

// PUT

export async function put(
  endpoint,
  body,
  options = {}
) {
  return request(endpoint, {
    method: "PUT",
    body,
    cache: "no-store",
    ...options,
  });
}

// PATCH

export async function patch(
  endpoint,
  body,
  options = {}
) {
  return request(endpoint, {
    method: "PATCH",
    body,
    cache: "no-store",
    ...options,
  });
}

// Delete

export async function remove(
  endpoint,
  options = {}
) {
  return request(endpoint, {
    method: "DELETE",
    cache: "no-store",
    ...options,
  });
}

// Default export

const apiClient = {
  request,
  get,
  post,
  put,
  patch,
  remove,
};

export default apiClient;