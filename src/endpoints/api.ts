
const BASE_URL = "https://api.skilltrainer.org/";
const LOGIN_URL = `${BASE_URL}api/token/`;
const REFRESH_URL = `${BASE_URL}api/token/refresh/`
const REGISTER_URL = `${BASE_URL}register/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const AUTHENTICATE_URL = `${BASE_URL}authenticated/`;
const SUBMIT_TARGET_SCORE_URL = `${BASE_URL}games/target-scores/`;
const GET_TARGET_SCORE_URL = `${BASE_URL}games/target-scores/`;
const GET_TARGET_AGGREGATION_DATA_URL = `${BASE_URL}games/target-average/`;
const SUMBIT_REACTION_SCORE_URL = `${BASE_URL}games/reaction-scores/`;
const GET_REACTION_SCORE_URL = `${BASE_URL}games/reaction-scores/`;
const GET_REACTION_AGGREGATION_DATA_URL = `${BASE_URL}games/reaction-average/`;
const SUMBIT_TYPING_SCORE_URL = `${BASE_URL}games/typing-scores/`;
const GET_TYPING_SCORE_URL = `${BASE_URL}games/typing-scores/`;
const GET_TYPING_AGGREGATION_DATA_URL = `${BASE_URL}games/typing-average/`;

export async function submitTargetScore(
    time_elapsed: number,
    clicks: number,
    targets: number
): Promise<Response> {
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

export async function submitReactionScore(
    reaction_times: number[]
): Promise<Response> {
  let response = await fetch(SUMBIT_REACTION_SCORE_URL, {
    credentials: "include",
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reaction_times: reaction_times
    }),
  })

  if (response.status === 401) {
    console.log("access token failed, calling refresh");
    const refresh_response = await retryWithRefresh(submitReactionScore, [reaction_times])
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

export async function getLastReactionScores(): Promise<Response> {
  let response = await fetch(GET_REACTION_SCORE_URL, {
    credentials: "include",
    method: "GET"
  })

  if (response.status === 401) {
    const refresh_response = await retryWithRefresh(getLastReactionScores)

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

export async function getReactionScoresAggregation(data_size: number): Promise<Response> {
  let response = await fetch(GET_REACTION_AGGREGATION_DATA_URL, {
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
    const refresh_response = await retryWithRefresh(getReactionScoresAggregation, [data_size])

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


export async function submitTypingScore(
    wpm: number,
    accuracy: number,
    raw_wpm: number,
    time_mode: number
): Promise<Response> {
  let response = await fetch(SUMBIT_TYPING_SCORE_URL, {
    credentials: "include",
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
      wpm: wpm,
      accuracy: accuracy,
      raw_wpm: raw_wpm,
      time_mode: time_mode
    }),
  })

  if (response.status === 401) {
    console.log("access token failed, calling refresh");
    const refresh_response = await retryWithRefresh(submitTypingScore, [wpm, accuracy, raw_wpm, time_mode])
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

export async function getLastTypingScores(): Promise<Response> {
  let response = await fetch(GET_TYPING_SCORE_URL, {
    credentials: "include",
    method: "GET"
  })

  if (response.status === 401) {
    const refresh_response = await retryWithRefresh(getLastTypingScores)

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

export async function getTypingScoresAggregation(data_size: number): Promise<Response> {
  let response = await fetch(GET_TYPING_AGGREGATION_DATA_URL, {
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
    const refresh_response = await retryWithRefresh(getTypingScoresAggregation, [data_size])

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

  if (response.ok) {
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
): Promise<Response> {
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

  return response
}


export async function refreshToken(): Promise<Response> {
  const response = await fetch(REFRESH_URL, {
    credentials: "include",
    method: "POST"
  })

  return response
}

// Eslint doesn't allow the use of Function type because it allows any Function types to be accepted
// However retryWithRefresh purposely accepts a range of different functions: ignore error
// eslint-disable-next-line
async function retryWithRefresh(func: Function, args: unknown[] = []): Promise<Response | null> {
    const refreshResponse = await refreshToken();
    const refreshData = await refreshResponse.json();

    if (refreshData.refreshed) {
      const retryResponse = await func(...args);
      return retryResponse;
    }
    else
      return null;
}