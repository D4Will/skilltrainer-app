
const BASE_URL = "http://127.0.0.1:8000/";
const SUBMIT_TARGET_SCORE_URL = `${BASE_URL}games/target-scores/`;
const GET_TARGET_SCORE_URL = `${BASE_URL}games/target-scores/`;
const GET_TARGET_AGGREGATION_DATA_URL = `${BASE_URL}games/target-average/`;
const LOGIN_URL = `${BASE_URL}api/token/`;
const REFRESH_URL = `${BASE_URL}api/token/refresh/`
const REGISTER_URL = `${BASE_URL}register/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const AUTHENTICATE_URL = `${BASE_URL}authenticated/`;

export async function submitTargetScore(
    time_elapsed: number,
    clicks: number,
    targets: number
): Promise<number | null> {
  let response = await fetch(SUBMIT_TARGET_SCORE_URL, {
    credentials: "include",
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
    time_elapsed: time_elapsed / 1000,
    clicks: clicks,
    targets: targets
    }),
  })

  if (response.status === 401) {
    console.log("access token failed, calling refresh");
    const refresh_response = await retryWithRefresh(submitTargetScore, [time_elapsed, clicks, targets])
    if(!refresh_response) {
      console.log("refresh failed")
      return null;
    }
    else {
    // Refresh succeeded but the response is of status 400 so json function fails.
    // The response is 400 because the arguments are not passed in the recall 
      console.log("refresh succeeded");
      response = refresh_response;
    }
  }
  
  if (response.ok) {
    const result = await response.json();
    console.log(result);
  }
  
  return response.status
}


export async function login(
    username: string,
    password: string
): Promise<boolean> {
  const response = await fetch(LOGIN_URL, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  if (response.ok) {
    const result = await response.json();
    console.log("login\n", result);
    return result.success
  }

  return false
}


export async function loggedIn(): Promise<Response> {
  let response = await fetch(AUTHENTICATE_URL, {
    credentials: "include",
    method: "POST"
  })

  if (response.status === 401) {

    const refresh_response = await retryWithRefresh(loggedIn)

    if(!refresh_response) {
      console.log("refresh failed")
      return response;
    }
    else {
      console.log("refresh succeeded");
      response = refresh_response;
    }
  }

  if (response.status === 200) {
    console.log("auth check succeeded");
  }

  console.log("auth check failed");
  return response;
}

// Need to call retryWithRefresh because the logout endpoint requires auth
// Done, need to test
export async function logout(): Promise<boolean> {
  let response = await fetch(LOGOUT_URL, {
    credentials: "include",
    method: "POST"
  });

  if (response.status === 401) {

    const refresh_response = await retryWithRefresh(loggedIn)

    if(!refresh_response) {
      console.log("refresh failed")
      return false;
    }
    else {
      console.log("refresh succeeded");
      response = refresh_response;
    }
  }

  if (response.ok) {
    const result = await response.json();
    console.log("logout\n", result);
    return true;
  }

  return false;
}


export async function register(
    username: string,
    email: string,
    password: string
): Promise<number> {
  const response = await fetch(REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),    
  });

  if (response.ok) {
    const result = await response.json();
    console.log("register\n", result); 
  }

  return response.status
}

export async function getLastTargetScores(): Promise<Response> {
  let response = await fetch(GET_TARGET_SCORE_URL, {
    credentials: "include",
    method: "GET"
  })

  if (response.status === 401) {
    const refresh_response = await retryWithRefresh(submitTargetScore)

    if(!refresh_response) {
      console.log("refresh failed")
      return response;
    }
    else {
      console.log("refresh succeeded");
      response = refresh_response;
    }
  }

  return response
}

export async function getTargetScoresAggregation(data_size: number): Promise<Response> {
  let response = await fetch(GET_TARGET_AGGREGATION_DATA_URL, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      score_amount: data_size
    })
  })

  if (response.status === 401) {
    const refresh_response = await retryWithRefresh(getTargetScoresAggregation, [data_size])

    if(!refresh_response) {
      console.log("refresh failed")
      return response;
    }
    else {
      console.log("refresh succeeded");
      response = refresh_response;
    }
  }

  return response
}


export async function refreshToken(): Promise<Response> {
  const response = await fetch(REFRESH_URL, {
    credentials: "include",
    method: "POST"
  })

  return response
}


async function retryWithRefresh(func: Function, args: any[] = []): Promise<Response | null> {
    const refreshResponse = await refreshToken();
    const refreshData = await refreshResponse.json();

    if (refreshData.refreshed) {
      const retryResponse = await func(...args);
      return retryResponse;
    }
    else
      return null;
}