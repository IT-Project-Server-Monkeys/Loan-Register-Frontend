import React, { useEffect, useState } from 'react';
import '../styles/Stats.scss'
// import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { ChartBox, NoAccess } from '../components';
import { noAccessRedirect } from '../utils/helpers';
import Plot from 'react-plotly.js';

const pieLayout = {
  legend: {orientation: "h", xanchor: "center", x: 0.5},
  showlegend: true, font: {size: 24}, margin: {t: 0, r: 0, b: 0, l: 0}
}

const pieStyle = { width: "80%", height: "80%", margin: "auto" };

const barLayout = { showlegend: false, font: {size: 24}, margin: {t: 0, r: 0, b: 0, l: 200} }

const barStyle = {}

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
        <h1>Statistics with fake data<br />TODO add real data</h1>
        <ChartBox style={{gridArea: "ch1"}}>
          <Plot
            data={[{
              type: 'pie', marker: {colors: ["#0073e6", "#eb8f33"]},
              labels: ["Loaned items", "Unloaned items"],
              values: [69, 420]
            },]}
            layout={pieLayout} useResizeHandler={true} style={pieStyle}
        />
        </ChartBox>
        <ChartBox style={{gridArea: "ch2"}}>
          <Plot
            data={[{
              type: 'pie', marker: {colors: ["#0073e6", "#eb8f33"]},
              labels: ["Returned loans", "Unreturned loans"],
              values: [69, 420]
            },]}
            layout={pieLayout} useResizeHandler={true} style={pieStyle}
         />
        </ChartBox>
        <ChartBox style={{gridArea: "ch3"}}>
          <Plot
            data={[{
              type: 'pie', marker: {colors: ["#0073e6", "#eb8f33"]},
              labels: ["Timely loans", "Late loans"],
              values: [69, 420]
            },]}
            layout={pieLayout} useResizeHandler={true} style={pieStyle}
          />
        </ChartBox>
        <div className="bar-box">
          <Plot className="bar-plot"
            data={[{
              type: 'bar', orientation: "h", marker: {color: "#0073e6"},
              x: [1, 2, 3], y: ["Loanee A", "Loanee B", "Loanee C"], cliponaxis: false
            },]}
            layout={barLayout} useResizeHandler={true} style={barStyle}
          />
          <Plot
            data={[{
              type: 'bar', orientation: "h", marker: {color: "#0073e6"},
              x: [1, 2, 3], y: ["Loanee A", "Loanee B", "Loanee C"], cliponaxis: false
            },]}
            layout={barLayout} useResizeHandler={true} style={barStyle}
          />
        </div>
      </div>
    }</>
  );
};

export default Stats;