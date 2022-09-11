import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import '../styles/Dashboard.scss';
import { AiOutlineUnorderedList, AiFillPlusCircle, AiOutlineUserSwitch } from 'react-icons/ai';
import { TbLayoutGrid } from 'react-icons/tb';
import { MdQueryStats } from 'react-icons/md';
import { ItemCard } from '../components';
import API from '../utils/api';
import MultiSelect from 'react-multiple-select-dropdown-lite';
import { LOANER, userViewSwitch } from '../utils/helpers';
import dateFormat, { masks } from "dateformat";

const image = 'https://picsum.photos/300/200';

const LoanerDashboard = (props) => {
  const navigate = useNavigate();
  const [gridView, setGridView] = useState(true);
  const [userView, setUserView] = useState(LOANER);

  const [loanerItems, setLoanerItems] = useState([]);
  const [loaneeItems, setLoaneeItems] = useState([]);

  const [loanerFilters, setLoanerFilters] = useState({
    categoryOptions: [],
    loaneeOptions: [],
  });
  const [loaneeFilters, setLoaneeFilters] = useState({
    categoryOptions: [],
    loanerOptions: [],
  });

  const userId = sessionStorage.getItem('uid');


  useEffect(() => {
    API.get('/dashboard?user_id=' + userId)
      .then((res) => {
        console.log('dashboard api', res);
        const items = res.data;
        var loanerItemsLst = [],
          loaneeItemsLst = [];
        for (var item of items) {
          if (item.user_role === 'loaner') loanerItemsLst.push(item);
          else loaneeItemsLst.push(item);
        }
        setLoanerItems(loanerItemsLst);
        setLoaneeItems(loaneeItemsLst);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);



  const renderItems = (view) => {
    var items = []
    if (view === LOANER) {
      items = loanerItems;
    } else {
      items = loaneeItems;
    }

    return gridView
      ? items.map((item, i) => (
            <Col md="4" key={i}>
              <Link to={`/item-details/${item.item_id}`}>
                <ItemCard
                  image={image}
                  title={item.item_name}
                  category={item.category}
                  person={item.loanee_name ? item.loanee_name : item.loaner_name}
                  startDate={dateFormat(item.loan_start_date, "mm/dd/yyyy")}
                  endDate={dateFormat(item.intended_return_date, "mm/dd/yyyy")}
                  loanStatus={item.being_loaned}
                  gridView={gridView}
                />
              </Link>
            </Col>
          
        ))
      : items.map((item, i) => (
          <Col xs="12" key={i}>
            <Link to={`/item-details/${item.item_id}`}>
                <ItemCard
                  image={image}
                  title={item.item_name}
                  category={item.category}
                  person={item.loanee_name ? item.loanee_name : item.loaner_name}
                  startDate={dateFormat(item.loan_start_date, "mm/dd/yyyy")}
                  endDate={dateFormat(item.intended_return_date, "mm/dd/yyyy")}
                  loanStatus={item.being_loaned}
                  gridView={gridView}
                />
              </Link>
          </Col>
        ));
  };

  const dateOptions = [
    { label: 'Start date ascending ↑', value: '1' },
    { label: 'Start date descending ↓', value: '2' },
    { label: 'End date ascending ↑', value: '3' },
    { label: 'End date ascending ↓', value: '4' },
  ];
  const statusOptions = [
    { label: 'On Loan', value: 'Current' },
    { label: 'On-Time Return', value: 'On Time Return' },
    { label: 'Early Return', value: 'Late Return' },
    { label: 'Late Return', value: 'Early Return' },
  ];
  const categoryOptions = [
    { label: 'Option 1', value: 'status_1' },
    { label: 'Option 2', value: 'status_2' },
    { label: 'Option 3', value: 'status_3' },
    { label: 'Option 4', value: 'status_4' },
  ];
  const loanerOptions = [
    { label: 'Option 1', value: 'status_1' },
    { label: 'Option 2', value: 'status_2' },
    { label: 'Option 3', value: 'status_3' },
    { label: 'Option 4', value: 'status_4' },
  ];
  const loaneeOptions = [
    { label: 'Option 1', value: 'status_1' },
    { label: 'Option 2', value: 'status_2' },
    { label: 'Option 3', value: 'status_3' },
    { label: 'Option 4', value: 'status_4' },
  ];

  const handleUserSwitch = (e) => {
    const newView = userViewSwitch(userView);
    setUserView(newView);
    navigate(`/dashboard/${newView}`);
  };

  return (
    <div className="page-margin dashboard">
      <Row>
        <Col md="3" className="bg-light-blue filter-container">
          <h3 style={{ marginBottom: '2rem' }}>
            View as: <span style={{ color: 'var(--blue-color)' }}>{userView}</span>
          </h3>
          <h3>Sort by</h3>
          <MultiSelect placeholder="Loan Date" singleSelect={true} options={dateOptions} />
          <h3 style={{ marginTop: '2rem' }}>Filter by</h3>
          <MultiSelect placeholder="Status" options={statusOptions} />
          <MultiSelect placeholder="Category" options={categoryOptions} />
          {userView === LOANER ? (
            <MultiSelect placeholder="Loanee" options={loaneeOptions} />
          ) : (
            <MultiSelect placeholder="Loaner" options={loanerOptions} />
          )}
        </Col>
        <Col style={{ marginLeft: '4rem' }}>
          <Row className="bg-light-blue" style={{ height: '5rem' }}>
            <div className="dashboard-nav">
              <div style={{ width: '40%', maxWidth: '25rem' }}>
                <span className="icon-blue" onClick={() => setGridView(!gridView)}>
                  {gridView ? <AiOutlineUnorderedList size={30} /> : <TbLayoutGrid size={30} />}
                </span>
                <div>
                  <input type="search" placeholder="Search for items" />
                </div>
                <a className="icon-plus" href="/add-item">
                  <AiFillPlusCircle size={45} color="#0073e6" />
                </a>
              </div>
              <div style={{ width: '12%', maxWidth: '8rem' }}>
                <span className="icon-blue">
                  <MdQueryStats size={30} />
                </span>
                <span className="icon-blue" onClick={handleUserSwitch}>
                  <AiOutlineUserSwitch size={30} />
                </span>
              </div>
            </div>
          </Row>
          <Row>{renderItems(userView)}</Row>
        </Col>
      </Row>
    </div>
  );
};

export default LoanerDashboard;
