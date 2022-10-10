import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Row, Col } from 'reactstrap';
import '../styles/ItemHistory.scss';
import API from '../utils/api';
import dateFormat from 'dateformat';
import { statusColor } from '../utils/constants';


const ItemHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loans, setLoans] = useState([]);

  const itemId = location.state ? location.state.itemId : '';
  const itemName = location.state ? location.state.itemName : '';

  useEffect(() => {
    API.get('/loans?item_id=' + itemId)
      .then((res) => {
        // console.log(res)
        var loans = res.data;
        // sort by end date
        loans.sort((a, b) => {
          return new Date(b.intended_return_date) - new Date(a.intended_return_date)
        })
        setLoans(loans);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [itemId]);

  console.log(loans)

  return (
    <div className="page-margin history">
      <span className="back-arrow">
        <AiOutlineArrowLeft size={40} color="var(--blue-color)" onClick={() => navigate(-1)} />
      </span>
      <div className='hist-container'>
        <h1>
          <span style={{color: 'var(--blue-color)'}}>{itemName} </span>
          Loan History
        </h1>
        {
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
        }
      </div>
    </div>
  );
};

export default ItemHistory;

const HistoryCard = (props) => {

  const {image, loanee, startDate, endDate, returnDate, status} = props;

  return (
    <Row className="item-card-long history-card">
      <Col md="4" style={{ paddingLeft: '0', height: '100%' }}>
        <div style={{ height: '100%' }}>
          {image && (
            <img alt="item-img" src={image} width="100%" height="100%" />
          )}
        </div>
      </Col>
      <Col md="8" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <Row className='card-details-row' style={{ alignItems: 'center' }}>
          <Col>
            <h4>{loanee}</h4>
            <p><span className='attribute'>Start Date:</span> {startDate}</p>
          </Col>
          <Col>
            <p><span className='attribute'>End Date:</span> {endDate}</p>
            {returnDate && <p><span className='attribute'>Return Date:</span> {returnDate}</p>}
          </Col>
          <Col
            md="4"
            className="justify-content-right"
            style={{ marginRight: '3rem' }}
          >
            <h3 style={{textAlign: 'end', color: statusColor[status]}}>
              {status}
            </h3>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
