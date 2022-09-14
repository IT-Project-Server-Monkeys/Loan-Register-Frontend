import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Spinner } from 'reactstrap';
import '../styles/Dashboard.scss';
import { AiOutlineUnorderedList, AiFillPlusCircle, AiOutlineUserSwitch } from 'react-icons/ai';
import { TbLayoutGrid } from 'react-icons/tb';
import { MdQueryStats } from 'react-icons/md';
import { ItemCard } from '../components';
import API from '../utils/api';
import MultiSelect from 'react-multiple-select-dropdown-lite';
import { LOANER, userViewSwitch } from '../utils/helpers';
import dateFormat from 'dateformat';

const image = 'https://picsum.photos/300/200';

const LoanerDashboard = (props) => {
  const navigate = useNavigate();
  const [gridView, setGridView] = useState(true);
  const [userView, setUserView] = useState(LOANER);
  const [loading, setLoading] = useState(true);

  const [loanerItems, setLoanerItems] = useState([]);
  const [loaneeItems, setLoaneeItems] = useState([]);

  // eslint-disable-next-line
  const [loanerFilters, setLoanerFilters] = useState({
    categoryOptions: [],
    loaneeOptions: [],
  });
  // eslint-disable-next-line
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
        var loanerItemsLst = [];
        var loaneeItemsLst = [];
        for (var item of items) {
          if (item.user_role === 'loaner') loanerItemsLst.push(item);
          else loaneeItemsLst.push(item);
        }
        setLoanerItems(loanerItemsLst);
        setLoaneeItems(loaneeItemsLst);
        setLoading(false);
        
        // get filter data
        var loaneeOptions = loanerItemsLst.map(item => item.loanee_name).filter(n => n) // remove null
        var loanerOptions = loanerItemsLst.map(item => item.loaner_name).filter(n => n)
        
        if (loanerItemsLst) {
          setLoanerFilters({
            categoryOptions: loanerItemsLst[0].item_categories,
            loaneeOptions: loaneeOptions
          })
        }

        // TODO: confirm if the loanee cate == user cate
        if (loaneeItemsLst) {
          setLoaneeFilters({
            categoryOptions: loaneeItemsLst[0].item_categories,
            loanerOptions: loanerOptions
          })
        }
        

      })
      .catch((e) => {
        console.log(e);
      });
      // eslint-disable-next-line
  }, []);

  // useEffect(() => {

  // }, [userView])

  // console.log(loanerFilters)

  const getItemById = (id) => {
    var item = loanerItems.filter(item => item.item_id === id);
    if (!item) {
      item = loaneeItems.filter(item => item.item_id === id);
    }

    if (item) return item[0];
    else return null;
  }

  const renderItems = (view) => {
    var items = [];
    if (view === LOANER) {
      items = loanerItems;
    } else {
      items = loaneeItems;
    }

    return items.map((item, i) => (
      <Col md={gridView ? 4 : 12} xs={gridView ? true : 12} key={i}>
        <Link to={`/item-details/${item.item_id}`} state={{item: getItemById(item.item_id)}}>
          <ItemCard
            image={image}
            title={item.item_name}
            category={item.category}
            person={item.loanee_name ? item.loanee_name : item.loaner_name}
            startDate={dateFormat(item.loan_start_date, 'dd/mm/yyyy')}
            endDate={dateFormat(item.intended_return_date, 'dd/mm/yyyy')}
            loanStatus={item.being_loaned}
            gridView={gridView}
          />
        </Link>
      </Col>
    ))
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
          {userView === LOANER ? 
            <MultiSelect placeholder="Loanee" options={loaneeOptions} />
          : 
            <MultiSelect placeholder="Loaner" options={loanerOptions} />
          }
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
          <Row>
            {loading ?
              <div className="m-5" style={{display: 'flex'}}>
                <Spinner color="primary" style={{width: '2.5rem', height: '2.5rem'}} />
                <h5 style={{margin: '0.5rem', color: 'var(--blue-color)'}}>Fetching items...</h5>
              </div> 
            : 
              renderItems(userView)
            }
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default LoanerDashboard;
