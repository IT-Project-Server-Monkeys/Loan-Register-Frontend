import React, { useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Spinner, Button } from 'reactstrap';
import '../styles/Dashboard.scss';
import { AiOutlineUnorderedList, AiFillPlusCircle, AiOutlineUserSwitch } from 'react-icons/ai';
import { TbLayoutGrid } from 'react-icons/tb';
import { MdQueryStats } from 'react-icons/md';
import { ItemCard, NoAccess } from '../components';
import API from '../utils/api';
import MultiSelect from 'react-multiple-select-dropdown-lite';
import { userViewSwitch, compArr, noAccessRedirect } from '../utils/helpers';
import { LOANER } from '../utils/constants';
import dateFormat from 'dateformat';
import ReactTooltip from 'react-tooltip';

/* constants */
const STATUS = "status";
const CATEGORY = "category"
const USER = "user";
const SA = "start date ascending"
const SD = "start date decending"
const EA = "end date ascending"
const ED = "end date decending"
const ALL = "all"
const HIDDEN = "hidden"
const VISIBLE = "visible"

const dateOptions = [
  { label: 'Start date ascending ↑', value: SA },
  { label: 'Start date descending ↓', value: SD },
  { label: 'End date ascending ↑', value: EA },
  { label: 'End date decending ↓', value: ED },
];
const statusOptions = [
  { label: 'On Loan', value: 'On Loan' },
  { label: 'On-Time Return', value: 'On Time Return' },
  { label: 'Early Return', value: 'Early Return' },
  { label: 'Late Return', value: 'Late Return' },
  { label: 'Overdue', value: 'Overdue' },
  { label: 'Available', value: null },
];

const displayOptions = [
  { label: 'Show all items', value: ALL },
  { label: 'Show hidden items', value: HIDDEN },
  { label: 'Show visible items', value: VISIBLE },
]


const LoanerDashboard = (props) => {
  const [noAccess, setNoAccess] = useState(false);
  const navigate = useNavigate();

  const [gridView, setGridView] = useState(true);
  const [userView, setUserView] = useState(LOANER);
  const [loading, setLoading] = useState(true);

  // master lists for loaner's and loanee's items, 
  // should be logically immutable except for atrribute "visible"
  const [loanerItems, setLoanerItems] = useState([]);
  const [loaneeItems, setLoaneeItems] = useState([]);

  // side bar options
  const [loanerFilters, setLoanerFilters] = useState({
    categoryOptions: [],
    loaneeOptions: [],
  });
  const [loaneeFilters, setLoaneeFilters] = useState({
    categoryOptions: [],
    loanerOptions: [],
  });

  // filters inputted from the side bar
  const [filters, setFilters] = useState({
    sortedItems: [],
    status: [],
    category: [],
    user: []
  });

  const [searchText, setSearchText] = useState('');

  // only for loaner
  const [visibilityController, setVisibilityController] = useState({
    visibleItems: [],
    hiddenItems: [],
  })

  // items displayed to the user
  const [displayItems, setDisplayItems] = useState({
    loanerItems: [],
    loaneeItems: []
  });  

  // redirect user away from page if user is not logged in
  useEffect(() => {
    if (props.loggedIn === false) {
      noAccessRedirect("/login", navigate, setNoAccess);
    }
  }, [props.loggedIn, navigate])

  const userId = sessionStorage.getItem('uid');

  useEffect(() => {
    if (props.loggedIn !== true || userId == null) return;
    API.get('/dashboard?user_id=' + userId)
      .then((res) => {
        console.log('dashboard api', res);
        const items = res.data;
        var loanerItemsLst = [];
        var loaneeItemsLst = [];
        // separate loaner and loanee items
        for (var item of items) {
          if (item.user_role === LOANER) {
            loanerItemsLst.push(item);
          }
          else loaneeItemsLst.push(item);
        }
        setLoanerItems(loanerItemsLst);
        setLoaneeItems(loaneeItemsLst);
        setLoading(false);

        // update visible items
        setVisibilityController({
          ...visibilityController,
          visibleItems: loanerItemsLst,
        })
        
        // set items to display
        setDisplayItems({
          loanerItems: loanerItemsLst,
          loaneeItems: loaneeItemsLst
        })
        
        // get filter data
        var loaneeOptions = loanerItemsLst.map(item => item.loanee_name).filter(n => n) // remove null
        var loanerOptions = loaneeItemsLst.map(item => item.loaner_name).filter(n => n)
        
        // update loaner cate and loanee opt
        if (loanerItemsLst.length > 0) {
          setLoanerFilters({
            ...loanerFilters,
            categoryOptions: loanerItemsLst[0].item_categories,
            loaneeOptions: loaneeOptions,
          })
        }

        // update loanee cate and loaner opt
        var loaneeCate = []  // get loanee cate
        for (item of loaneeItemsLst) {
          if (!loaneeCate.includes(item.category)) {
            loaneeCate.push(item.category)
          }
        }
        if (loaneeItemsLst.length > 0) {
          setLoaneeFilters({
            ...loaneeFilters,
            categoryOptions: loaneeCate,
            loanerOptions: loanerOptions,
          })
        }
        

      })
      .catch((e) => {
        console.log(e);
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loggedIn]);


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
      items = displayItems.loanerItems;
    } else {
      items = displayItems.loaneeItems;
    }

    return items.map((item, i) => (
      <Col lg={gridView ? {size: 4, offset: 0} : 12} md={gridView ? {size: 6, offset: 0} : 12} xs={gridView ? {size: 8, offset: 2} : 12} key={i}>
        <Link to={`/item-details/${item.item_id}`}
          state={{item: {...getItemById(item.item_id), item_owner: userId}}}
        >
          <ItemCard
            itemId={item.item_id}
            image={item.image_url}
            title={item.item_name}
            category={item.category}
            user={item.loanee_name ? item.loanee_name : item.loaner_name}
            startDate={
              item.loan_start_date &&
              dateFormat(item.loan_start_date, 'dd/mm/yyyy')
            }
            endDate={
              item.intended_return_date &&
              dateFormat(item.intended_return_date, 'dd/mm/yyyy')
            }
            loanStatus={item.loan_status}
            gridView={gridView}
            searchText={searchText}
          />
        </Link>
      </Col>
    ))


  };





  const handleUserSwitch = (e) => {
    const newView = userViewSwitch(userView);
    setUserView(newView);
  };



  const handleSortByDate = (val) => {
    var res = userView === LOANER ? displayItems.loanerItems : displayItems.loaneeItems;
    switch (val) {
      case SA:
        res.sort((a, b) => {
          return new Date(a.loan_start_date) - new Date(b.loan_start_date);
        })
        break;
      case SD:
        res.sort((a, b) => {
          return new Date(b.loan_start_date) - new Date(a.loan_start_date);
        })
        break;
      case EA:
        res.sort((a, b) => {
          return new Date(a.intended_return_date) - new Date(b.intended_return_date);
        })
        break;
      case ED:
        res.sort((a, b) => {
          return new Date(b.intended_return_date) - new Date(a.intended_return_date);
        })
        break;
      default:
        res = []
        break;
    }

    setFilters({
      ...filters,
      sortedItems: res
    })
  }

  

  const handleFilters = (val, filter) => {
    const values = val.split(",");
    console.log('val', values, filter)

    setFilters({
      ...filters,
      [filter]: compArr(values, ['']) ? [] : [...values]  // if no value, use empty array
    })
  }

  const applyFilters = (e) => {
    // null: no filter selected
    // empty array: filter selected but no matched result
    var res1 = null;     // status
    var res2 = null;     // category
    var res3 = null;     // user
    var results = null;  // final results
      
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
        // console.log('???', loanerItems)
      } else {
        results = intersection(res1, res2);
        results = intersection(results, res3)
      }

      if (filters.sortedItems.length > 0) {
        // console.log('!!!')
        results = intersection(filters.sortedItems, results)
      }
    
      setDisplayItems({
        ...displayItems,
        loanerItems: results
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

      if (filters.sortedItems.length > 0) {
        results = intersection(filters.sortedItems, results)
      }
      

      setDisplayItems({
        ...displayItems,
        loaneeItems: results
      })
    }


  }

  const handleSearch = (e) => {
    const currText = e.target.value;
    setSearchText(currText)
    const items = userView === LOANER ? loanerItems : loaneeItems;

    const resItems = items.filter(item => {
      if (
        (item.item_name && item.item_name.toLowerCase().includes(currText)) ||
        (item.category && item.category.toLowerCase().includes(currText)) ||
        (item.loanee_name && item.loanee_name.toLowerCase().includes(currText)) ||
        (item.loaner_name && item.loaner_name.toLowerCase().includes(currText)) 
      ) {
        return item
      } else {
        return null;
      }
    })

    // console.log('search items', resItems)

    if (userView === LOANER) {
      setLoanerFilters({
        ...loanerFilters,
        results: resItems
      })
    } else {
      setLoaneeFilters({
        ...loaneeFilters,
        results: resItems
      })
    }

  }

  const handleDisplay = (val) => {
    switch (val) {
      case ALL:
        setDisplayItems({
          ...displayItems,
          loanerItems: loanerItems
        })
        return;
      case VISIBLE:
        setDisplayItems({
          ...displayItems,
          loanerItems: loanerItems.filter(item => item.visible === true)
        })
        return;
      case HIDDEN:
        setDisplayItems({
          ...displayItems,
          loanerItems: loanerItems.filter(item => item.visible === false)
        })
        return;
      default:
        return;
    }
  }


  // console.log('items', loanerItems)
  // console.log('filters', filters)
  // console.log('loaner results', loanerFilters.results)

 
  return (
    <>{noAccess ? <NoAccess /> :
      <div className="page-margin dashboard">
        <Row>
          <Col className="bg-light-blue filter-container">
            <h4 style={{ marginBottom: '2rem' }}>
              View as: <span style={{ color: 'var(--blue-color)' }}>{userView}</span>
            </h4>
            {
              userView === LOANER &&
              <>
                <h4>Item Display</h4>
                <MultiSelect 
                  placeholder="View hidden/visible items"
                  singleSelect={true} 
                  options={displayOptions} 
                  onChange={val => handleDisplay(val)}
                />
              </>
              
            }
            
            <h4 style={{ marginTop: '1rem' }}>Sort by</h4>
            <MultiSelect 
              placeholder="Loan Date" 
              singleSelect={true} 
              options={dateOptions} 
              onChange={handleSortByDate}
            />
            <h4 style={{ marginTop: '1rem' }}>Filter by</h4>
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
          <Col md='8'>
            <Row className="bg-light-blue" style={{ height: '5rem' }}>
              <div className="dashboard-nav">
                <div style={{ width: '40%', maxWidth: '25rem' }}>
                  <span 
                    className="icon-blue" 
                    data-for={gridView ? 'item-view' : 'item-view'} 
                    data-tip 
                    onClick={() => setGridView(!gridView)}
                  >
                    {
                      gridView ? 
                        <AiOutlineUnorderedList size={30} /> 
                      : 
                        <TbLayoutGrid size={30} />
                    }
                  </span>
                  <ReactTooltip id='item-view'>
                    <span>{gridView ? 'List view' : 'Grid view'}</span>
                  </ReactTooltip>
                  <div style={{marginLeft: '1rem', marginRight: '1rem'}}>
                    <input type="search" onChange={handleSearch} placeholder="Search for items" />
                  </div>
                  <Link to="/add-item">
                    <span className="icon-plus" data-for='add-item' data-tip='Add item'>
                      <AiFillPlusCircle size={45} color="#0073e6" />
                    </span>
                  </Link>
                  <ReactTooltip id='add-item' />
                  
                </div>
                <div style={{ width: '12%', maxWidth: '8rem' }}>
                  <Link to="/stats" style={{display: 'flex'}}>
                    <span className="icon-blue" data-for='view-stats' data-tip='View statistics'>
                      <MdQueryStats size={30} />
                    </span>
                  </Link>
                  <ReactTooltip id='view-stats' />
                  <span style={{marginLeft: '1rem'}} className="icon-blue" onClick={handleUserSwitch} data-for='user-view' data-tip >
                    <AiOutlineUserSwitch size={30} />
                  </span>
                  <ReactTooltip id='user-view'>
                    <span>{userView === LOANER ? 'View as loanee' : 'View as loaner'}</span>
                  </ReactTooltip>
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
    }</>
  );
};

export default LoanerDashboard;






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