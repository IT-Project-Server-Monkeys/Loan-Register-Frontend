import React, { useRef, useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Spinner, Button } from 'reactstrap';
import '../styles/Dashboard.scss';
import { AiOutlineUnorderedList, AiFillPlusCircle, AiOutlineUserSwitch } from 'react-icons/ai';
import { TbLayoutGrid } from 'react-icons/tb';
import { MdQueryStats, MdOutlineKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { Header, ItemCard, NoAccess } from '../components';
import API from '../utils/api';
import MultiSelect from 'react-multiple-select-dropdown-lite';
import { userViewSwitch, compArr, noAccessRedirect, noCaseCmp } from '../utils/helpers';
import { LOANER } from '../utils/constants';
import ReactTooltip from 'react-tooltip';
import { useMediaQuery } from 'react-responsive'

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
  // Bruce's original code below
  // { label: 'Available', value: null },
  { label: 'Available', value: 'Available' },
];

const displayOptions = [
  { label: 'Show all items', value: ALL },
  { label: 'Show visible items', value: VISIBLE },
  { label: 'Show hidden items', value: HIDDEN },
]


const LoanerDashboard = (props) => {
  const searchRef = useRef();

  const [noAccess, setNoAccess] = useState(false);
  const navigate = useNavigate();

  const [gridView, setGridView] = useState(true);
  const [userView, setUserView] = useState(LOANER);
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(false);

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
  const [curSort, setCurSort] = useState("");

  const [searchText, setSearchText] = useState('');

  // only for loaner
  const [visibilityController, setVisibilityController] = useState({
    visibleItems: [],
    hiddenItems: [],
    display: VISIBLE
  })
  const [curVis, setCurVis] = useState(VISIBLE);

  // items displayed to the user
  const [displayItems, setDisplayItems] = useState({
    loanerItems: [],
    loaneeItems: []
  });  

  const [filterExpanded, setFilterExpanded] = useState(false);


  const isSmallScreen = useMediaQuery({ query: '(max-width: 996px)' })
  const isMobileView = useMediaQuery({ query: '(max-width: 576px)' })
  const breakNav = useMediaQuery({ query: '(max-width: 920px)' })


  // redirect user away from page if user is not logged in
  useEffect(() => {
    if (props.loggedIn === false) {
      noAccessRedirect("/login", navigate, setNoAccess);
    }
  }, [props.loggedIn, navigate])

  // get all items 
  useEffect(() => {
    setLoading(true);
    if (props.loggedIn !== true || props.uid == null) return;
    API.get('/dashboard?user_id=' + props.uid)
      .then((res) => {
        // console.log('dashboard api', res);
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
        // setLoading(false);

        // setDisplayItems({
        //   loanerItems: loanerItemsLst,
        //   loaneeItems: loaneeItemsLst
        // })

        // update visible items
        setVisibilityController({
          display: VISIBLE,
          visibleItems: loanerItemsLst.filter(item => item.visible === true),
          hiddenItems: loanerItemsLst.filter(item => item.visible === false),
        })
        // console.log('ttt', loanerItemsLst)
        
        // get filter data
        var loaneeOptions = loanerItemsLst.map(item => item.loanee_name).filter(n => n) // remove null
        var loanerOptions = loaneeItemsLst.map(item => item.loaner_name).filter(n => n)
        
        // update loaner cate and loanee opt
        if (loanerItemsLst.length > 0) {
          setLoanerFilters({
            ...loanerFilters,
            categoryOptions: [...new Set(loanerItemsLst[0].item_categories)].sort(noCaseCmp),
            loaneeOptions: [...new Set(loaneeOptions)].sort(noCaseCmp),
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
            categoryOptions: [...new Set(loaneeCate)].sort(noCaseCmp),
            loanerOptions: [...new Set(loanerOptions)].sort(noCaseCmp),
          })
        }
        
        setInitLoad(true);
      })
      .catch((e) => {
        // console.log(e);
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);


  // const getItemById = (id) => {
  //   var item = loanerItems.find(item => item.item_id === id);
  //   if (!item) {
  //     item = loaneeItems.find(item => item.item_id === id);
  //   }

  //   if (item) return item[0];
  //   else return null;
  // }


  const renderItems = (view) => {
    var items = [];
    if (view === LOANER) {
      items = displayItems.loanerItems;
    } else {
      items = displayItems.loaneeItems;
    }

    return items.map((item, i) => (
      <Col 
        xl={gridView ? {size: 4, offset: 0} : 12} 
        lg={gridView ? {size: 6, offset: 0} : 12} 
        md={gridView ? {size: 9, offset: 1} : 12} 
        key={i}
      >
        <Link 
          to={`/item-details/${item.item_id}`}
          state={{item: item}}
        >
          <ItemCard
            item={item}           
            gridView={gridView}
            userView={userView}
            searchText={searchText}
            updateVisibility={updateVisibility}
          />
        </Link>
      </Col>
    ))


  };

  // update item's visibility
  const updateVisibility = (id, visible) => {
    setLoading(true);
    API({
      method: 'PUT',
      url: '/items',
      data: {
        _id: id,
        visible: visible
      }
    }).then(res => {
      setLoanerItems(lnrItems => lnrItems.map((i) => {
        return i.item_id !== id ? i : {...i, visible: visible}
      }))
      // console.log(res)
      const item = loanerItems.find(item => item.item_id === id);
      if (visible) {
        // show the item
        setVisibilityController(visCon => {return {
          ...visCon,
          visibleItems: [...visCon.visibleItems, item],
          hiddenItems: [...visCon.hiddenItems].filter(item => item.item_id !== id),
        }})

      } else {
        // hide the item
        setVisibilityController(visCon => {return {
          ...visCon,
          visibleItems: [...visCon.visibleItems].filter(item => item.item_id !== id),
          hiddenItems: [...visCon.hiddenItems, item]
        }})
      }
    }).catch(e => {
      // console.log(e)
    })

  }

  useEffect(() => {
    resetFilters();
    setLoading(true);
    // if (props.loggedIn !== true || props.uid == null) return;
    // API.get('/dashboard?user_id=' + props.uid)
    // .then(res => {
    //   // console.log('dashboard api', res);
    //     const items = res.data;
    //     var loanerItemsLst = [];
    //     // update loaner items
    //     for (var item of items) {
    //       if (item.user_role === LOANER) {
    //         loanerItemsLst.push(item);
    //       }
    //     }
    //     setLoanerItems(loanerItemsLst);
    //     setLoading(false);

    // }).catch(e => {
    //   // console.log(e)
    // })
    // update display items
    switch(visibilityController.display) {
      case ALL:
        setDisplayItems({
          ...displayItems,
          loanerItems: loanerItems
        })
        break;
      case VISIBLE:
        setDisplayItems({
          ...displayItems,
          loanerItems: loanerItems.filter(item => item.visible === undefined || item.visible === true)
        })
        break;
      case HIDDEN:
        setDisplayItems({
          ...displayItems,
          loanerItems: loanerItems.filter(item => item.visible !== undefined && item.visible === false)
        })
        break;
      default:
        break
    }
    // setLoading(false);
    
  // eslint-disable-next-line
  }, [props, visibilityController])

  // console.log('control', visibilityController)
  // console.log('display', displayItems)

  useEffect(() => setLoading(!initLoad), [initLoad, displayItems])


  const handleUserSwitch = (e) => {
    const newView = userViewSwitch(userView);
    setUserView(newView);

    setCurVis(VISIBLE);
    resetFilters();
  };

  const resetFilters = () => {
    // reset sort/filter in order to be consistent
    setCurSort("");
    setFilters(ftr => {return {...ftr, status: [], category: [], user: []}});
    setDisplayItems({
      loanerItems: loanerItems.filter(item => item.visible === true),
      loaneeItems: loaneeItems
    });
  }

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
    setCurSort(val);

    setFilters({
      ...filters,
      sortedItems: res
    })
  }

  

  const handleFilters = (val, filter) => {
    const values = val.split(",");
    // console.log('val', values, filter)

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
        // // console.log('???', loanerItems)
      } else {
        results = intersection(res1, res2);
        results = intersection(results, res3)
      }

      if (filters.sortedItems.length > 0) {
        // // console.log('!!!')
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

  useEffect(() => searchRef.current.focus(), [searchText])

  const handleSearch = (e) => {
    const currText = e.target.value;
    setSearchText(currText);
    var items;
    if (userView === LOANER) {
      switch (visibilityController.display) {
        case VISIBLE:
          items = visibilityController.visibleItems
          break;
        case HIDDEN:
          items = visibilityController.hiddenItems
          break
        default:
          items = loanerItems
          break;
      }
    } else {
      items = loaneeItems
    }

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

    // // console.log('search items', resItems)

    if (userView === LOANER) {
      setDisplayItems({
        ...displayItems,
        loanerItems: resItems
      })
    } else {
      setDisplayItems({
        ...displayItems,
        loaneeItems: resItems
      })
    }

  }

  const handleDisplay = (val) => {
    switch (val) {
      case ALL:
        setVisibilityController({
          ...visibilityController,
          display: ALL
        })
        // setDisplayItems({
        //   ...displayItems,
        //   loanerItems: loanerItems
        // })
        break;
      case VISIBLE:
        setVisibilityController({
          ...visibilityController,
          display: VISIBLE
        })
        // setDisplayItems({
        //   ...displayItems,
        //   loanerItems: loanerItems.filter(item => item.visible === undefined || item.visible === true)
        // })
        break;
      case HIDDEN:
        setVisibilityController({
          ...visibilityController,
          display: HIDDEN
        })
        // setDisplayItems({
        //   ...displayItems,
        //   loanerItems: loanerItems.filter(item => item.visible !== undefined && item.visible === false)
        // })
        break;
      default:
        return;
    }
    setCurVis(val);
  }


  // // console.log('items', loanerItems)
  // // console.log('filters', filters)
  // // console.log('loaner results', loanerFilters.results)

  const FilterSection = () => {
    return (
      <>
        <h4 style={{ marginBottom: '2rem' }}>
          View as: <span style={{ color: 'var(--blue-color)' }}>{userView}</span>
        </h4>
        {
          userView === LOANER &&
          <>
            <h4>Item Display</h4>
            <MultiSelect 
              // placeholder='Show all items'
              disabled={!initLoad}
              singleSelect={true} 
              options={displayOptions} 
              onChange={val => handleDisplay(val)}
              defaultValue={curVis}
              clearable={false}
            />
          </>
          
        }
        
        <h4 style={{ marginTop: '1rem' }}>Sort by</h4>
        <MultiSelect 
          disabled={!initLoad}
          placeholder="Loan Date" 
          singleSelect={true} 
          options={dateOptions} 
          onChange={handleSortByDate}
          defaultValue={curSort}
        />
        <h4 style={{ marginTop: '1rem' }}>Filter by</h4>
        <MultiSelect 
          disabled={!initLoad}
          placeholder="Status" 
          options={statusOptions} 
          onChange={val => handleFilters(val, STATUS)} 
          defaultValue={filters.status}
        />
        <MultiSelect 
          disabled={!initLoad}
          placeholder="Category" 
          options={
            userView === LOANER ? 
            renderOptions(loanerFilters.categoryOptions) 
            : renderOptions(loaneeFilters.categoryOptions)
          } 
          onChange={val => handleFilters(val, CATEGORY)}
          defaultValue={filters.category}
        />
        <MultiSelect 
          disabled={!initLoad}
          placeholder={userView === LOANER ? "Loanee" : "loaner" }
          options={
            userView === LOANER ? 
            renderOptions(loanerFilters.loaneeOptions) 
            : renderOptions(loaneeFilters.loanerOptions)
          } 
          onChange={val => handleFilters(val, USER)}
          defaultValue={filters.user}
        />
        <Button onClick={applyFilters} disabled={!initLoad}>Apply Filters</Button>
      </>
    )
  }

  const DashboardNav = () => {
    return (
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
            <input type="search" onChange={handleSearch} placeholder="Search for items" value={searchText} ref={searchRef} />
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
    )
  }

  const wrapNav = () => {
    return breakNav === true && isMobileView === false;
  }

  const MobileDashboardNav = () => {
    return (
      <div className="dashboard-nav" style={{width: '100%'}}>
        <Row style={{width: '100%'}}>
          <Col style={{
            display: 'flex', 
            justifyContent: isMobileView || wrapNav() ? 'center' : 'start',
            paddingBottom: isMobileView || wrapNav() ? '0.5rem' : '0',
            paddingLeft: isMobileView || wrapNav() ? 'auto' : '2rem'
          }}>
            <input type="search" onChange={handleSearch} placeholder="Search for items" />
          </Col>
          <Col style={{maxWidth: '250px', margin: 'auto'}}>
            {/* <div>
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
            </div> */}
            <div>
              <Link to="/add-item">
                <span className="icon-plus" data-for='add-item' data-tip='Add item'>
                  <AiFillPlusCircle size={45} color="#0073e6" />
                </span>
              </Link>
              <ReactTooltip id='add-item' />
            </div>
            <div>
              <Link to="/stats" style={{display: 'flex'}}>
                <span className="icon-blue" data-for='view-stats' data-tip='View statistics'>
                  <MdQueryStats size={30} />
                </span>
              </Link>
              <ReactTooltip id='view-stats' />
            </div>
            <div>
              <span className="icon-blue" onClick={handleUserSwitch} data-for='user-view' data-tip >
                <AiOutlineUserSwitch size={30} />
              </span>
              <ReactTooltip id='user-view'>
                <span>{userView === LOANER ? 'View as loanee' : 'View as loaner'}</span>
              </ReactTooltip>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  const CardsRenderer = () => {
    return (
      loading ?
        <div className="m-5" style={{display: 'flex'}}>
          <Spinner color="primary" style={{width: '2.5rem', height: '2.5rem'}} />
          <h5 style={{margin: '0.5rem', color: 'var(--blue-color)'}}>Fetching items...</h5>
        </div> 
      : 
        renderItems(userView)
    )
  }

 
  return (
    <><Header loggedIn={props.loggedIn} onLogout={props.onLogout} />
      {noAccess ? <NoAccess /> :       
        <div className="page-margin dashboard">
          {
            isMobileView ?
            <>
              <div className="bg-light-blue" style={{marginBottom: '1rem'}}>
                <MobileDashboardNav />
              </div>
              <div 
                className="bg-light-blue filter-bar" 
                onClick={()=>setFilterExpanded(!filterExpanded)}
              >
                {/* <h4>
                  View as: <span style={{ color: 'var(--blue-color)' }}>{userView}</span>
                </h4> */}
                <div>
                  <h4>Filter</h4>
                  {
                    filterExpanded ?
                      <MdKeyboardArrowUp size={25} />
                    : <MdOutlineKeyboardArrowDown size={25} />
                  }
                </div>
              </div>
              {
                filterExpanded &&
                <div className="bg-light-blue filter-container">
                  <FilterSection />
                </div>
              }
              <div style={{width: '90%', margin: 'auto', marginTop: '1rem'}}>
                <CardsRenderer />
              </div>
            </>
            :          
            <Row>
              <Col lg='3' md='4' sm='5' className="bg-light-blue filter-container">
                <FilterSection />
              </Col> 
              <Col lg={{size: 8, offset: 0}} md={{size: 7, offset: 1}} sm={{size: 6, offset: 1}}>
                <Row className="bg-light-blue">
                  {
                    isSmallScreen ?
                      <MobileDashboardNav />
                    :
                      <DashboardNav />
                  }
                </Row>
                <Row>
                  <CardsRenderer />
                </Row>
              </Col>
            </Row>
          }
        </div>
      }
    </>
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