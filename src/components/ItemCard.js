import React from 'react';
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap'
import { LOANER } from '../utils/helpers';
import Highlighter from "react-highlight-words";

const ItemCard = (props) => {

  const {image, title, category, user, startDate, endDate, loanStatus, gridView, searchText} = props;

  const userView = window.location.pathname.slice(-6);

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
  
  return (
    <>
      {
        gridView ?
          <Card className='item-card'>
            <img alt="item-img" src={image} />
            <CardBody>
              <CardTitle tag="h3" style={{marginBottom: '0.5rem'}}>{renderText(title)}</CardTitle>
              <div>
                <Row>
                  <Col>
                    <p className='attribute'>Category: </p>
                  </Col>
                  <Col>
                    <p>{renderText(category)}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className='attribute'>Loan Status: </p>
                  </Col>
                  <Col>
                    <p>{loanStatus ? "On loan" : "Not loaned"}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className='attribute'>Current {userView === LOANER ? 'loanee' : 'loaner'}: </p>
                  </Col>
                  <Col>
                    <p>{user}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className='attribute'>Start date: </p>
                  </Col>
                  <Col>
                    <p>{startDate}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className='attribute'>End date: </p>
                  </Col>
                  <Col>
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
                <img alt="item-img" src={image} height='100%' width='100%' />
              </div>
            </Col>
            <Col style={{paddingTop: '1.5rem', paddingBottom: '1rem'}}>
              <Row>
                <h3>{title}</h3>
              </Row>
              <Row style={{alignItems: 'center'}}>
                <Col>
                <Row>
                  <Col>
                    <p className='attribute'>Category: </p>
                  </Col>
                  <Col>
                    <p>{category}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className='attribute'>Current {userView === LOANER ? 'loanee' : 'loaner'}: </p>
                  </Col>
                  <Col>
                    <p>{user}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className='attribute'>Start date: </p>
                  </Col>
                  <Col>
                    <p>{startDate}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className='attribute'>End date: </p>
                  </Col>
                  <Col>
                    <p>{endDate}</p>
                  </Col>
                </Row>
                </Col>
                <Col className='d-flex justify-content-end' style={{marginRight: '3rem', marginTop: '-1.5rem'}}>
                  <h3>{loanStatus ? "On loan" : "Not loaned"}</h3>
                </Col>
              </Row>
            </Col>
          </Row>
      }
    </>
  );
};

export default ItemCard;
