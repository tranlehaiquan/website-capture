import { signal, effect } from "@preact/signals-react";
import { Auth } from "aws-amplify";

type userInfo = {
  username: string;
  attributes: {
    sub: string;
    email_verified: boolean;
    email: string;
  }
}

const auth = signal({
  authenticating: false,
  isAuthenticated: false,
  userInfo: {},
  username: "",
} as {
  authenticating: boolean;
  isAuthenticated: boolean;
  userInfo: userInfo;
  username: string;
});

const init = async () => {
  try {
    auth.value = {
      ...auth.value,
      authenticating: true,
    };
    
    await Auth.currentSession();
    auth.value = {
      ...auth.value,
      isAuthenticated: true,
    };

    const user = await Auth.currentUserInfo();
    auth.value = {
      ...auth.value,
      userInfo: user,
    }
  } catch (e) {
    if (e !== "No current user") {
      alert(e);
    }
  } finally {
    auth.value = {
      ...auth.value,
      authenticating: false,
    };
  }
};

init();

effect(() => {
  console.log("auth changed", auth.value);
});

export type Auth = typeof auth;

export default auth;
