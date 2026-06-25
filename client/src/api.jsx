const API_URL = "/api/doubts";

async function request(path = "", options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  //Extract the JSON data from the server's response

  const data = await response.json();
  // If the server is not not responding
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function getDoubts() {
  return request();
}

// This is the function/login to create a new post
export function createDoubt(doubt) {
  return request("", {
    method: "POST",
    body: JSON.stringify(doubt),
  });
}

// This is the logic to toogle between whether the doubt is pending/solved

export function toggleSolved(id) {
  return request(`/${id}/toggle-solved`, {
    method: "PATCH",
  });
}

//DELETE RECORD/DOUBT
export function deleteDoubt(id) {
  return request(`/${id}`, {
    method: "DELETE",
  });
}
