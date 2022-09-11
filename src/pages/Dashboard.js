import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import '../styles/Dashboard.scss';
import { AiOutlineUnorderedList, AiFillPlusCircle, AiOutlineUserSwitch } from 'react-icons/ai';
import { TbLayoutGrid } from 'react-icons/tb';
import { MdQueryStats } from 'react-icons/md';
import { ItemCard } from '../components';
import API from '../utils/api';
import MultiSelect from 'react-multiple-select-dropdown-lite';
import { LOANER, userViewSwitch } from '../utils/helpers';

const image = 'https://picsum.photos/300/200';


const LoanerDashboard = (props) => {
  const navigate = useNavigate();
  const [gridView, setGridView] = useState(true);
  const [userView, setUserView] = useState(LOANER);

  // const userId = sessionStorage.getItem('loginSession')

  const items = [
    <ItemCard
      image={image}
      title="Card Title"
      category="Plant"
      person="Bruce"
      startDate="01/01/2022"
      endDate="31/12/2022"
      gridView={gridView}
    />,
    <ItemCard
      image={image}
      title="Card Title"
      category="Plant"
      person="Bruce"
      startDate="01/01/2022"
      endDate="31/12/2022"
      gridView={gridView}
    />,
    <ItemCard
      image={image}
      title="Card Title"
      category="Plant"
      person="Bruce"
      startDate="01/01/2022"
      endDate="31/12/2022"
      gridView={gridView}
    />,
    <ItemCard
      image={image}
      title="Card Title"
      category="Plant"
      person="Bruce"
      startDate="01/01/2022"
      endDate="31/12/2022"
      gridView={gridView}
    />,
    <ItemCard
      image={image}
      title="Card Title"
      category="Plant"
      person="Bruce"
      startDate="01/01/2022"
      endDate="31/12/2022"
      gridView={gridView}
    />,

  ];

  useEffect(() => {
    API.get('/users')
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const dateOptions = [
    { label: 'Start date ascending ↑', value: '1' },
    { label: 'Start date descending ↓', value: '2' },
    { label: 'End date ascending ↑', value: '3' },
    { label: 'End date ascending ↓', value: '4' },
  ];
  const statusOptions = [
    { label: 'Option 1', value: 'status_1' },
    { label: 'Option 2', value: 'status_2' },
    { label: 'Option 3', value: 'status_3' },
    { label: 'Option 4', value: 'status_4' },
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
  }


  return (
    <div className="page-margin dashboard">
      <Row>
        <Col md="3" className="bg-light-blue filter-container">
          <h3 style={{marginBottom: '2rem'}}>View as: <span style={{color: 'var(--blue-color)'}}>{userView}</span></h3>
          <h3>Sort by</h3>
          <MultiSelect placeholder="Loan Date" singleSelect={true} options={dateOptions} />
          <h3 style={{ marginTop: '2rem' }}>Filter by</h3>
          <MultiSelect placeholder="Status" options={statusOptions} />
          <MultiSelect placeholder="Category" options={categoryOptions} />
          {
            userView === LOANER ? <MultiSelect placeholder="Loanee" options={loaneeOptions} />
            : <MultiSelect placeholder="Loaner" options={loanerOptions} />
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
            {gridView
              ? items.map((item, i) => (
                  <Col md="4" key={i}>
                    {item}
                  </Col>
                ))
              : items.map((item, i) => (
                  <Col xs={12} key={i}>
                    {item}
                  </Col>
                ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default LoanerDashboard;