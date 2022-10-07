import React, { useEffect, useState } from 'react';
import '../styles/Stats.scss'
import API from '../utils/api';
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

  // get overall stats
  useEffect(() => {
    if (props.loggedIn !== true) return;
  }, [props.loggedIn]);

  return (
    <>{noAccess ? <NoAccess /> :
      <div className={"stats-page"}>
        <h1>Statistics</h1>
      </div>
    }</>
  );
};

export default Stats;