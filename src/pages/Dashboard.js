import React, { useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Spinner, Button } from 'reactstrap';
import '../styles/Dashboard.scss';
import { AiOutlineUnorderedList, AiFillPlusCircle, AiOutlineUserSwitch } from 'react-icons/ai';
import { TbLayoutGrid } from 'react-icons/tb';
import { MdQueryStats } from 'react-icons/md';
import { ItemCard } from '../components';
import API from '../utils/api';
import MultiSelect from 'react-multiple-select-dropdown-lite';
import { LOANER, userViewSwitch, compArr } from '../utils/helpers';
import dateFormat from 'dateformat';

const STATUS = "status";
const CATEGORY = "category"
const USER = "user";

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
    results: []
  });
  // eslint-disable-next-line
  const [loaneeFilters, setLoaneeFilters] = useState({
    categoryOptions: [],
    loanerOptions: [],
    results: []
  });

  const [filters, setFilters] = useState({
    status: [],
    category: [],
    user: []
  });



  const userId = sessionStorage.getItem('uid');

  useEffect(() => {
    API.get('/dashboard?user_id=' + userId)
      .then((res) => {
        console.log('dashboard api', res);
        const items = res.data;
        var loanerItemsLst = [];
        var loaneeItemsLst = [];
        // separate loaner and loanee items
        for (var item of items) {
          if (item.user_role === 'loaner') loanerItemsLst.push(item);
          else loaneeItemsLst.push(item);
        }
        setLoanerItems(loanerItemsLst);
        setLoaneeItems(loaneeItemsLst);
        setLoading(false);
        
        // get filter data
        var loaneeOptions = loanerItemsLst.map(item => item.loanee_name).filter(n => n) // remove null
        var loanerOptions = loaneeItemsLst.map(item => item.loaner_name).filter(n => n)
        
        // update loaner cate and loanee opt
        if (loanerItemsLst) {
          setLoanerFilters({
            ...loaneeFilters,
            categoryOptions: loanerItemsLst[0].item_categories,
            loaneeOptions: loaneeOptions,
            results: [...loanerItemsLst]
          })
        }

        // update loanee cate and loaner opt
        var loaneeCate = []  // get loanee cate
        for (var item of loaneeItemsLst) {
          if (!loaneeCate.includes(item.category)) {
            loaneeCate.push(item.category)
          }
        }
        if (loaneeItemsLst) {
          setLoaneeFilters({
            ...loaneeFilters,
            categoryOptions: loaneeCate,
            loanerOptions: loanerOptions,
            results: [...loaneeItemsLst]
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
      items = loanerFilters.results;
    } else {
      items = loaneeFilters.results;
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



  const handleUserSwitch = (e) => {
    const newView = userViewSwitch(userView);
    setUserView(newView);
    navigate(`/dashboard/${newView}`);
  };

  

  const handleFilters = (val, filter) => {
    const values = val.split(",");
    console.log('val', values, filter)

    setFilters({
      ...filters,
      [filter]: compArr(values, ['']) ? [] : [...values]
    })
  }

  const applyFilters = (e) => {
      // null: no filter selected
      // empty array: filter selected but no matched result
      var res1 = null;
      var res2 = null;
      var res3 = null;
      var results = null;
      
    if (userView === LOANER) {
      if (filters.status.length > 0) {
        res1 = loanerItems.filter(item => filters.status.includes(item.loan_status))
      }
      if (filters.category.length > 0) {
        res2 = loanerItems.filter(item => filters.category.includes(item.category))
        
      }
      if (filters.user.length > 0) {
        res3 = loanerItems.filter(item => filters.user.includes(item.loanee_name))
      }

      if (res1 === null && res2 === null && res3 === null) {
        // no filter selected
        results = loanerItems;
      } else {
        results = intersection(res1, res2);
        results = intersection(results, res3)
      }
    
      setLoanerFilters({
        ...loanerFilters,
        results: [...results]
      })

    } else {
      if (filters.status.length > 0) {
        res1 = loaneeItems.filter(item => filters.status.includes(item.loan_status))
      }
      if (filters.category.length > 0) {
        res2 = loaneeItems.filter(item => filters.category.includes(item.category))
      }
      if (filters.user.length > 0) {
        res3 = loaneeItems.filter(item => filters.user.includes(item.loaner_name))
      }

      if (res1 === null && res2 === null && res3 === null) {
        // no filter selected
        results = loaneeItems;
      } else {
        results = intersection(res1, res2);
        results = intersection(results, res3)
      }
      
      results = intersection(res1, res2);
      results = intersection(results, res3)

      setLoaneeFilters({
        ...loaneeFilters,
        results: [...results]
      })
    }


  }


  console.log('items', loanerItems)
  console.log('filters', filters)
  console.log('results', loanerFilters.results)


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
          <MultiSelect 
            placeholder="Status" 
            options={statusOptions} 
            onChange={val => handleFilters(val, STATUS)} 
          />
          <MultiSelect 
            placeholder="Category" 
            options={
              userView === LOANER ? 
              renderOptions(loanerFilters.categoryOptions) 
              : renderOptions(loaneeFilters.categoryOptions)
            } 
            onChange={val => handleFilters(val, CATEGORY)}
          />
          <MultiSelect 
            placeholder={userView === LOANER ? "Loanee" : "loaner" }
            options={
              userView === LOANER ? 
              renderOptions(loanerFilters.loaneeOptions) 
              : renderOptions(loaneeFilters.loanerOptions)
            } 
            onChange={val => handleFilters(val, USER)}
          />
          <Button onClick={applyFilters}>Apply Filters</Button>
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


const dateOptions = [
  { label: 'Start date ascending ↑', value: '1' },
  { label: 'Start date descending ↓', value: '2' },
  { label: 'End date ascending ↑', value: '3' },
  { label: 'End date ascending ↓', value: '4' },
];
const statusOptions = [
  { label: 'On Loan', value: 'Current' },
  { label: 'On-Time Return', value: 'On Time Return' },
  { label: 'Early Return', value: 'Early Return' },
  { label: 'Late Return', value: 'Late Return' },
  { label: 'Not Loaned', value: 'Not Loaned' },
];


const renderOptions = (list) => {
  var options = []
  for (var opt of list) {
    options.push({label: opt, value: opt})
  }

  return options
}


const intersection = (arr1, arr2) => {
  // null: no filter selected
  // empty array: filter selected but no matched result

  if (arr1 === null && arr2 === null) {
    return null
  }
  if (arr1 === null || arr2 === null) {
    if (arr1 === null) return arr2;
    else return arr1;
  }

  var res = [];
  for (var i of arr1) {
    if (arr2.includes(i)) {
      res.push(i)
    }
  }
  return res;
}