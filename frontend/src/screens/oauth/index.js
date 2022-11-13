import React, { useEffect } from "react";
import { navigate } from "hookrouter";
import { subscribe } from "react-contextual";

import { useQueryParameters } from "../../shared/hooks";
import twitch from "../../shared/libs/twitch";
import api from "../../shared/libs/api";
import Loader from "../../shared/components/loader";

const Oauth = (props) => {
  const { platform } = props;
  const params = useQueryParameters();

  /**
   * Handles the login from the API by passing the code
   * returned from Twitch, then the API handles all of the
   * userdata handling.
   */
  const login = async () => {
    try {
      // Wait for a response from api
      const res = await api.login(params.code);

      // If an error, abort.
      if (res.error) return navigate("/");

      // Set the session
      await props.setSession(res);
      navigate("/");
    } catch (error) {
      navigate("/");
    }
  };

  useEffect(() => {
    // If the platform is Twitch, and there is NOT a code in
    // the url, send them to twitch.
    if (platform === "twitch" && !params.code) {
      const authLink = twitch.authLink();
      return (window.location.href = authLink);
    }

    login();
  }, []);

  return <Loader />;
};

export default subscribe()(Oauth);
