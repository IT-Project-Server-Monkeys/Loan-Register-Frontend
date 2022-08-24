import React from 'react'
import { Row, Col } from 'reactstrap';
import '../styles/Dashboard.scss'
import { AiOutlineUnorderedList, AiFillPlusCircle, AiOutlineUserSwitch } from 'react-icons/ai'
import { MdQueryStats } from 'react-icons/md'

const LoanerDashboard = (props) => {
  return (
    <div className='page-margin dashboard'>
      <Row>
        <Col md='3' className='bg-light-blue' style={{minHeight: '30rem'}}>
          <div>
            Filters
          </div>
        </Col>
        <Col style={{marginLeft: '4rem'}}>
          <Row className='bg-light-blue' style={{height: '5rem'}}>
            <div className='dashboard-nav'>
              <div style={{width: '40%', maxWidth: '25rem'}}>
                <span className='icon-blue'>
                  <AiOutlineUnorderedList size={30} />
                </span>
                <div>
                  <input type="search" placeholder='Search for items' />
                </div>
                <span className='icon-plus' style={{borderRadius: '50%'}}>
                  <AiFillPlusCircle size={45} color='#0073e6' />
                </span>
              </div>             
              <div style={{width: '12%', maxWidth: '8rem'}}>
                <span className='icon-blue'>
                  <MdQueryStats size={30} />
                </span>
                <span className='icon-blue'>
                  <AiOutlineUserSwitch size={30} />
                </span>
              </div>
              
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default LoanerDashboard