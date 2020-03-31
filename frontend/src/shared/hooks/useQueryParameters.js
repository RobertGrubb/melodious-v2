import React, { useState, useEffect } from 'react';

export function useQueryParameters() {

  const retrieveParameters = () => {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
  }

  const [parameters, setParameters] = useState(retrieveParameters);

  useEffect(() => {
    const params = retrieveParameters();
    setParameters(params);
  }, [window.location.href]);

  return parameters;
}
