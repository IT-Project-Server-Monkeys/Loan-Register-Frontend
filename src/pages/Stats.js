import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NoAccess } from '../components';
import { noAccessRedirect } from '../utils/helpers';

const Stats = (props) => {
  const [noAccess, setNoAccess] = useState(false);
  const navigate = useNavigate();

  // redirect user away from page if user is not logged in
  useEffect(() => {
    if (props.loggedIn === false) {
      noAccessRedirect("/login", navigate, setNoAccess);
    }
  }, [props.loggedIn, navigate])

  return (
    <>{noAccess ? <NoAccess /> :
      <div>Stats</div>
    }</>
  );
};

export default Stats;