import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Row, Col, Card, CardBody, CardTitle, Spinner} from 'reactstrap';
import '../styles/ItemHistory.scss';
import { checkAPI, API } from '../utils/api';
import dateFormat from 'dateformat';
import { statusColor } from '../utils/constants';
import { Header, Loading, NoAccess } from '../components';
import { noAccessRedirect } from '../utils/helpers';
import { useMediaQuery } from 'react-responsive'
import { fetchItem } from '../utils/itemHelpers';


const ItemHistory = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [noAccess, setNoAccess] = useState([false, false]);

  const itemId = useParams().id;
  const [item, setItem] = useState({item_name: <Loading />, item_owner: null});
  const dbData = location.state ? location.state.item : null;

  const [loans, setLoans] = useState([]);
  const [initLoad, setInitLoad] = useState(false);

  // const itemName = location.state ? location.state.item.item_name : '';
  // const itemOwner = location.state ? location.state.item.item_owner : null;

  // redirect user away from page if user is not logged in
  useEffect(() => {
    if (props.loggedIn === false) {
      noAccessRedirect("/login", navigate, setNoAccess);
    }
  }, [props.loggedIn, navigate])

  // get item
  useEffect(() => {
    if (props.loggedIn !== true || props.uid == null || props.onLogout == null) return;
    if (dbData === null) {
      checkAPI(props.uid,
        async () => {
          console.log("token valid -> fetch item from server");
          await fetchItem(itemId, setItem, () => {
            noAccessRedirect("/dashboard", navigate, setNoAccess);
            return;
          });
        },
        () => {
          noAccessRedirect("/login", navigate, setNoAccess, props.onLogout);
        }
      );
    }
    else { console.log("dbData", dbData); setItem(dbData); }

  }, [props, itemId, dbData, navigate])

  useEffect(() => {
    console.log(item);
    
    if (item.item_owner == null || props.onLogout == null || props.uid == null) return;
    if (props.uid !== item.item_owner) {
      noAccessRedirect("/dashboard", navigate, setNoAccess);
      return;
    }

    checkAPI(props.uid,
      async () => {
        console.log("token valid -> fetch item history");
        
        await API.get('/loans?item_id=' + itemId)
        .then((res) => {
          // console.log(res)
          var loans = res.data;
          // sort by end date
          loans.sort((a, b) => {
            return new Date(b.intended_return_date) - new Date(a.intended_return_date)
          })
          setLoans(loans);
          setInitLoad(true);
        })
        .catch((e) => {
          console.log(e);
        });
      },
      () => {
        noAccessRedirect("/login", navigate, setNoAccess, props.onLogout);
      }
    );

  }, [props, itemId, item, navigate]);

  return (
    <><Header loggedIn={props.loggedIn} onLogout={props.onLogout} />
      {noAccess[0] ? <NoAccess sessionExpired={noAccess[1]} /> :
        <div className="page-margin history">
          <span className="back-arrow">
            <AiOutlineArrowLeft size={40} color="var(--blue-color)" onClick={() => navigate(-1)} />
          </span>
          <div className='hist-container'>
            <h1>
              <span style={{color: 'var(--blue-color)'}}>{item.item_name} </span>
              Loan History
            </h1>
            { initLoad ?
              loans.map((loan, i) => (
                <HistoryCard
                  key={i}
                  image={loan.item_image}
                  loanee={loan.loanee_name}
                  startDate={dateFormat(loan.loan_start_date, 'dd/mm/yyyy')}
                  endDate={dateFormat(loan.intended_return_date, 'dd/mm/yyyy')}
                  returnDate={loan.actual_return_date && dateFormat(loan.actual_return_date, 'dd/mm/yyyy')}
                  status={loan.status}
                />
              ))
              : <div className="m-5" style={{display: 'flex'}}>
                  <Spinner color="primary" style={{width: '2.5rem', height: '2.5rem'}} />
                  <h5 style={{margin: '0.5rem', color: 'var(--blue-color)'}}>Fetching loans...</h5>
                </div> 
            }
          </div>
        </div>
      }
    </>
  );
};

export default ItemHistory;

const HistoryCard = (props) => {

  const {image, loanee, startDate, endDate, returnDate, status} = props;

  const isMobileView = useMediaQuery({ query: '(max-width: 576px)' })

  return (
    
    !isMobileView ?
    <Row className="item-card-long history-card">
      <Col md="4" sm='3' style={{ paddingLeft: '0', height: '100%' }}>
        <div style={{ height: '100%' }}>
          {image && (
            <img alt="item-img" src={image} width="100%" height="100%" />
          )}
        </div>
      </Col>
      <Col md="8" sm='9' style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <Row className='card-details-row' style={{ alignItems: 'center' }}>
          <Col>
            <Row>
              <Col lg='6' md={true} sm={true}>
                <h4>{loanee}</h4>
                <p><span className='attribute'>Start Date:</span> {startDate}</p>
              </Col>
              <Col lg='6' md={true} sm={true}>
                <p><span className='attribute'>End Date:</span> {endDate}</p>
                {returnDate && <p><span className='attribute'>Return Date:</span> {returnDate}</p>}
              </Col>
            </Row>
          </Col>
          
          <Col lg="4" md='5' sm='5'>
            <h3 style={{textAlign: 'center', color: statusColor[status]}}>
              {status}
            </h3>
          </Col>
        </Row>
      </Col>
    </Row>
    :
    <Row style={{paddingLeft: '10px', paddingRight: '10px'}}>
      <Col xs='12'>
        <Card
          style={{
            width: '100%',
            margin: 'auto',
            marginTop: '1.5rem'
          }}
          className='item-card history-card'
        >
          <div style={{height: '10rem'}}>
            <img
              alt="Sample"
              src={image}
              width='100%'
              height='100%'
            />
          </div>
          
          <CardBody style={{backgroundColor: 'white'}}>
            <CardTitle tag="h4">
              {loanee}
            </CardTitle>
            
            <Row>
              <Col xs='6' sm='6'>
                <p className='attribute'>Start Date: </p>
              </Col>
              <Col xs='6' sm='6'>
                <p style={{textAlign: 'center'}}>{startDate}</p>
              </Col>
            </Row>
            <Row>
              <Col xs='6' sm='6'>
                <p className='attribute'>End Date: </p>
              </Col>
              <Col xs='6' sm='6'>
                <p style={{textAlign: 'center'}}>{endDate}</p>
              </Col>
            </Row>
            <Row>
              <Col xs='6' sm='6'>
                <p className='attribute'>Return Date: </p>
              </Col>
              <Col xs='6' sm='6'>
                <p style={{textAlign: 'center'}}>{returnDate}</p>
              </Col>
            </Row>
            <h4 style={{textAlign: 'center', color: statusColor[status], marginBottom: '0', marginTop: '10px'}}>
              {status}
            </h4>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
