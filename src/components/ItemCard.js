import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Row, Col, Button } from 'reactstrap'
import { LOANER } from '../utils/constants';
import Highlighter from "react-highlight-words";
import dateFormat from 'dateformat';
import { statusColor } from '../utils/constants';

const ItemCard = (props) => {

  const {item, gridView, userView, searchText, updateVisibility} = props;

  const [onHover, setOnHover] = useState(false);
  
  const userName = item.loanee_name ? item.loanee_name : item.loaner_name;
  const startDate = item.loan_start_date && dateFormat(item.loan_start_date, 'dd/mm/yyyy')
  const endDate = item.intended_return_date && dateFormat(item.intended_return_date, 'dd/mm/yyyy')
  

  const renderText = (text) => {
    return <Highlighter
              highlightStyle={{
                backgroundColor: 'var(--orange-color)',
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape={true}
              textToHighlight={text}
            />
  }

  const cardStatusHandler = (e) => {
    e.preventDefault();  // prevent from navigating
    console.log(item.visible)
    if (item.visible === undefined || item.visible === true) {
      updateVisibility(item.item_id, false)
    } else {
      updateVisibility(item.item_id, true)
    }
    
  }
  
  return (
    <>
      {
        gridView ?
          <Card className='item-card'
            onMouseEnter={()=>setOnHover(true)}
            onMouseLeave={()=>setOnHover(false)}
          >
            <div style={{height: '13rem', position: 'relative'}}>
              {
                item.loan_status === "Available" && onHover &&
                <Button onClick={cardStatusHandler} className='hide-btn'>
                  {item.visible === false ? 'Unhide' : 'Hide'}
                </Button>
              }
              {
                item.image_url !== undefined && <img alt="item-img" src={item.image_url} width='100%' height='100%' />
              }
            </div>
            <CardBody>
              <CardTitle tag="h3" style={{marginBottom: '0.5rem', width:'100%'}}>{renderText(item.item_name)}</CardTitle>
              <div>
                <Row>
                  <Col xs='6' sm='6'>
                    <p className='attribute'>Category: </p>
                  </Col>
                  <Col xs='6' sm='6'>
                    <p>{renderText(item.category)}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xs='6' sm='6'>
                    <p className='attribute'>Loan Status: </p>
                  </Col>
                  <Col xs='6' sm='6'>
                    <p>{item.loan_status ? item.loan_status : "Available"}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xs='6' sm='6'>
                    <p className='attribute'>Current {userView === LOANER ? 'loanee' : 'loaner'}: </p>
                  </Col>
                  <Col xs='6' sm='6'>
                    <p>{userName}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xs='6' sm='6'>
                    <p className='attribute'>Start date: </p>
                  </Col>
                  <Col xs='6' sm='6'>
                    <p>{startDate}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xs='6' sm='6'>
                    <p className='attribute'>End date: </p>
                  </Col>
                  <Col xs='6' sm='6'>
                    <p>{endDate}</p>
                  </Col>
                </Row>
                
              </div>
            </CardBody>
          </Card>
        :
          <Row className='item-card-long'>
            <Col md='4' style={{paddingLeft: '0', height: '100%'}}>
              <div style={{height: '100%'}}>
              {
                item.image_url !== undefined && <img alt="item-img" src={item.image_url} width='100%' height='100%' />
              }
              </div>
            </Col>
            <Col md='8' style={{paddingTop: '1.5rem', paddingBottom: '1rem'}}>
              <Row>
                <h3>{renderText(item.item_name)}</h3>
              </Row>
              <Row style={{alignItems: 'center'}}>
                <Col>
                  <Row>
                    <Col md='5'>
                      <p className='attribute'>Category: </p>
                    </Col>
                    <Col>
                      <p>{renderText(item.category)}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md='5'>
                      <p className='attribute'>Current {userView === LOANER ? 'loanee' : 'loaner'}: </p>
                    </Col>
                    <Col>
                      <p>{userName}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md='5'>
                      <p className='attribute'>Start date: </p>
                    </Col>
                    <Col>
                      <p>{startDate}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md='5'>
                      <p className='attribute'>End date: </p>
                    </Col>
                    <Col>
                      <p>{endDate}</p>
                    </Col>
                  </Row>
                </Col>
                <Col md='4' className='d-flex justify-content-end' style={{marginRight: '3rem', marginTop: '-1.5rem'}}>
                  <h3 style={{color: statusColor[item.loan_status]}}>{item.loan_status}</h3>
                </Col>
              </Row>
            </Col>
          </Row>
      }
    </>
  );
};

export default ItemCard;
