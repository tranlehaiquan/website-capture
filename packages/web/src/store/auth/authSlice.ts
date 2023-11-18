import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signOut } from "aws-amplify/auth";
import { fetchAuthSession } from "aws-amplify/auth";

async function currentSession() {
  const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};

  return {
    accessToken,
    idToken,
  };
}

type userInfo = {
  username: string;
  sub: string;
  email_verified: boolean;
  email: string;
};

export type AuthState = {
  authenticating: boolean;
  isAuthenticated: boolean;
  userInfo?: userInfo;
};

const initialState: AuthState = {
  authenticating: true,
  isAuthenticated: false,
  userInfo: undefined,
};

// create async thunk
export const initAuth = createAsyncThunk("auth/init", async () => {
  const response = (await fetchAuthSession()).tokens;

  if(!response) throw new Error("No user");

  return response?.idToken?.payload as any;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await signOut();
  } catch (e) {
    alert(e);
  }
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticating(state, action) {
      state.authenticating = action.payload;
    },
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initAuth.pending, (state) => {
      state.authenticating = true;
    });
    builder.addCase(initAuth.fulfilled, (state, action) => {
      state.authenticating = false;
      state.isAuthenticated = true;

      state.userInfo = action.payload;
    });
    builder.addCase(initAuth.rejected, (state) => {
      state.authenticating = false;
      state.isAuthenticated = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.authenticating = false;
      state.isAuthenticated = false;
      state.userInfo = undefined;
    });
  },
});

// export reducer
export const authReducer = slice.reducer;

// export actions
export const { setAuthenticating, setIsAuthenticated, setUserInfo } =
  slice.actions;
