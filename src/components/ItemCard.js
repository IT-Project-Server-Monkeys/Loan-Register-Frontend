import React from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap'

const ItemCard = (props) => {

  // const [image, title, categoty, loanee, startDate, endDate] = props;

  return (
    <Card className='item-card'>
      <img alt="Sample" src="https://picsum.photos/300/200" />
      <CardBody>
        <CardTitle tag="h3" style={{marginBottom: '0.5rem'}}>Card title</CardTitle>
        <CardText>
          <Row>
            <Col md='5'>
              <p className='card-subtitle'>Category: </p>
            </Col>
            <Col>
              <p>ssss</p>
            </Col>
          </Row>
          <Row>
            <Col md='5'>
              <p className='card-subtitle'>Current loanee: </p>
            </Col>
            <Col>
              <p>ssss</p>
            </Col>
          </Row>
          <Row>
            <Col md='5'>
              <p className='card-subtitle'>Start date: </p>
            </Col>
            <Col>
              <p>ssss</p>
            </Col>
          </Row>
          <Row>
            <Col md='5'>
              <p className='card-subtitle'>End date: </p>
            </Col>
            <Col>
              <p>ssss</p>
            </Col>
          </Row>
        </CardText>
      </CardBody>
    </Card>
  );
};

export default ItemCard;
