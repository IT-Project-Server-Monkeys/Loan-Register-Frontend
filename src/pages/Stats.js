import React, { useEffect, useState } from 'react';
import '../styles/Stats.scss'
import { useNavigate } from 'react-router-dom';
import { ChartBox, Header, NoAccess } from '../components';
import { noAccessRedirect, noCaseCmp } from '../utils/helpers';
import Plot from 'react-plotly.js';
import { fetchUserItems } from '../utils/itemHelpers';
import { fetchUserLoans } from '../utils/loanHelpers';
import { useMediaQuery } from 'react-responsive';

const Stats = (props) => {
  const [noAccess, setNoAccess] = useState(false);
  const navigate = useNavigate();
  const isTablet = useMediaQuery({ maxDeviceWidth: 1320 });
  const isMobile = useMediaQuery({ maxDeviceWidth: 576 });

  const NoDataWrap = (props) => <div className="no-data-wrap"><p>{props.children}</p></div>;

  const pieData = {
    type: 'pie', marker: {colors: ["#0073e6", "#eb8f33"]},
    hoverlabel: {font: {size: isMobile ? 16 : 20}}
  }

  const pieLayout = {
    legend: {orientation: "h", xanchor: "center", x: 0.5},
    showlegend: true, font: {size: isMobile ? 16 : 24}, margin: {t: 0, r: 0, b: 0, l: 0},
    ...isMobile ? {height: 300} : {}
  }

  const barLayout = {
    showlegend: false, font: {size: isTablet ? isMobile ? 12 : 16 : 20},
    margin: {pad: 20, t: 0, r: 25, b: 0, l: isTablet ? isMobile ? 75 : 125 : 175},
    xaxis: {constrain: "domain"},
    width: isTablet ? isMobile ? 250 : 400 : 600, height: 225, autosize: false, bargap: 0.5
  }

  const barData = {
    type: 'bar', orientation: "h", marker: {color: "#0073e6"},
    cliponaxis: true, hoverlabel: {font: {size: isMobile ? 16 : 20}}
  }
  
  const [allItems, setAllItems] = useState([]);
  const [allLoans, setAllLoans] = useState([]);
  const [itemVals, setItemVals] = useState([0, 0]);
  const [loanVals, setLoanVals] = useState([0, 0]);
  const [rtnLnVals, setRtnLnVals] = useState([0, 0]);

  const [freqItems, setFreqItems] = useState({x: [], y: []});
  const [freqLoanees, setFreqLoanees] = useState({x: [], y: []});

  const clearItems = () => {
    setItemVals([0, 0]);
    setFreqItems({x: [], y: []});
  }

  const clearLoans = () => {
    setLoanVals([0, 0]);
    setRtnLnVals([0, 0]);
  }
  
  const clearLoanees = () => setFreqLoanees({x: [], y: []});

  const breakLine = (line) => {
    if (typeof(line) !== 'string') return line;

    let i;
    let curLen = 0;
    let brLine = ""
    let lines = line.split(/\s/);

    for (i=0; i<lines.length; i++) {
      if (curLen + lines[i].length > 10) {
        brLine += "<br>";
        curLen = 0;
      }
      brLine += lines[i] + " ";
      curLen += lines[i].length + 1;
    }

    return brLine.trimEnd();
  };

  // redirect user away from page if user is not logged in
  useEffect(() => {
    if (props.loggedIn === false) {
      noAccessRedirect("/login", navigate, setNoAccess);
    }
  }, [props.loggedIn, navigate])

  // get overall stats
  useEffect(() => {
    if (props.loggedIn !== true || props.uid == null) return;
    fetchUserItems(props.uid, setAllItems);
    fetchUserLoans(props.uid, setAllLoans);
  }, [props]);

  useEffect(() => {
    clearItems();
    if (allItems === []) return;

    for (let i=0; i<allItems.length; i++) {
      if (allItems[i].being_loaned) setItemVals(([unloaned, loaned]) => [unloaned, loaned+1])
      else setItemVals(([unloaned, loaned]) => [unloaned+1, loaned])
    }

    // reverse alphabet to ensure correct order
    allItems.sort((i0, i1) => noCaseCmp(i1.item_name, i0.item_name));
    allItems.sort((i0, i1) => (i0.loan_frequency >= i1.loan_frequency ? -1 : 1));
    for (let i=0; i<Math.min(allItems.length, 3); i++) {
      let iName = breakLine(allItems[i].item_name);

      setFreqItems(fi => {return {
        x: [allItems[i].loan_frequency].concat(fi["x"]),
        y: [iName].concat(fi["y"]),
      }});
    }
  }, [allItems]);

  useEffect(() => {
    clearLoans();
    clearLoanees();
    let lneCounts = {};
    let sortedLnes = [];

    if (allLoans === []) return;

    for (let i=0; i<allLoans.length; i++) {
      let loan = allLoans[i];

      if (loan.status === "On Loan" || loan.status === "Overdue")
        setLoanVals(([returned, unreturned]) => [returned, unreturned+1]);
      else {
        setLoanVals(([returned, unreturned]) => [returned+1, unreturned]);

        if (loan.status === "Late Return")
          setRtnLnVals(([timely, late]) => [timely, late+1]);
        else setRtnLnVals(([timely, late]) => [timely+1, late]);
      }

      if (Object.keys(lneCounts).includes(loan.loanee_name))
        lneCounts[loan.loanee_name] += 1;
      else lneCounts[loan.loanee_name] = 1;
    }

    sortedLnes = Object.entries(lneCounts); // [loanee_name, loan_frequency] pairs
    sortedLnes.sort((lne0, lne1) => noCaseCmp(lne0[0], lne1[0]));
    sortedLnes.sort((lne0, lne1) => lne0[1] > lne1[1] ? -1 : 1);

    for (let i=0; i<Math.min(sortedLnes.length, 3); i++) {
      
      let lName = breakLine(sortedLnes[i][0]);

      setFreqLoanees(fl => {return {
        x: [sortedLnes[i][1]].concat(fl["x"]),
        y: [lName].concat(fl["y"]),
      }});
    }

  }, [allLoans])

  return (
    <><Header loggedIn={props.loggedIn} onLogout={props.onLogout} />
      {noAccess ? <NoAccess /> :
        <div className={"stats-page"}>
          <h1>Statistics</h1>
          <ChartBox style={{gridArea: "ch1"}}>
            { itemVals[0] === 0 && itemVals[1] === 0
              ? <NoDataWrap>No data</NoDataWrap>
              : <Plot className="pie-chart" layout={pieLayout} useResizeHandler={true}
                data={[{...pieData, labels: ["Unloaned items", "Loaned items"], values: itemVals}]} 
              />
            }
          </ChartBox>
          <ChartBox style={{gridArea: "ch2"}}>
            { loanVals[0] === 0 && loanVals[1] === 0
              ? <NoDataWrap>No data</NoDataWrap>
              : <Plot className="pie-chart" layout={pieLayout} useResizeHandler={true}
                data={[{...pieData, labels: ["Returned loans", "Unreturned loans"], values: loanVals}]}
              />
            }
          </ChartBox>
          <ChartBox style={{gridArea: "ch3"}}>
            { rtnLnVals[0] === 0 && rtnLnVals[1] === 0
              ? <NoDataWrap>No data</NoDataWrap>
              : <Plot className="pie-chart" layout={pieLayout} useResizeHandler={true}
                data={[{...pieData, labels: ["Timely loans", "Late loans"], values: rtnLnVals}]}
              />
            }
          </ChartBox>
          <div className="bar-box">
            { freqItems.x.length === 0 || Math.max(freqItems.x) === 0
              ? <NoDataWrap>No data</NoDataWrap>
              : <Plot className="bar-plot"
                data={[{...barData, ...freqItems}]}
                layout={barLayout} useResizeHandler={true}
              />
            }
            { freqLoanees.x.length === 0 || Math.max(freqItems.x) === 0
              ? <NoDataWrap>No data</NoDataWrap>
              : <Plot className="bar-plot"
                data={[{...barData, ...freqLoanees}]}
                layout={barLayout} useResizeHandler={true}
              />
            }
          </div>
        </div>
      }
    </>
  );
};

export default Stats;