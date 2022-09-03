import React, { useEffect, useState } from 'react'
import { Row, Col } from 'reactstrap';
import '../styles/Dashboard.scss'
import { AiOutlineUnorderedList, AiFillPlusCircle, AiOutlineUserSwitch } from 'react-icons/ai'
import { TbLayoutGrid } from 'react-icons/tb'
import { MdQueryStats } from 'react-icons/md'
import { ItemCard } from '../components';
import axios from 'axios';

const image='https://picsum.photos/300/200';

const LoanerDashboard = (props) => {

  const [gridView, setGridView] = useState(true);



  const items = [
    <ItemCard image={image} title="Card Title" category="Plant" loanee="Bruce" startDate='01/01/2022' endDate="31/12/2022" gridView={gridView} />,
    <ItemCard image={image} title="Card Title" category="Plant" loanee="Bruce" startDate='01/01/2022' endDate="31/12/2022" gridView={gridView} />,
    <ItemCard image={image} title="Card Title" category="Plant" loanee="Bruce" startDate='01/01/2022' endDate="31/12/2022" gridView={gridView} />,
    <ItemCard image={image} title="Card Title" category="Plant" loanee="Bruce" startDate='01/01/2022' endDate="31/12/2022" gridView={gridView} />,
    <ItemCard image={image} title="Card Title" category="Plant" loanee="Bruce" startDate='01/01/2022' endDate="31/12/2022" gridView={gridView} />,
    <ItemCard image={image} title="Card Title" category="Plant" loanee="Bruce" startDate='01/01/2022' endDate="31/12/2022" gridView={gridView} />,
  ]


  useEffect(() => {
    axios.get('https://server-monkeys-backend-test.herokuapp.com/users')
    .then(res => {
      console.log(res)
    }).catch(e => {
      console.log(e)
    })

  }, [])
  


  return (
    <div className='page-margin dashboard'>
      <Row>
        <Col md='3' className='bg-light-blue filter-box' style={{height: '30rem'}}>
          <h3>Sort by</h3>
          <h3>Filter by</h3>
        </Col>
        <Col style={{marginLeft: '4rem'}}>
          <Row className='bg-light-blue' style={{height: '5rem'}}>
            <div className='dashboard-nav'>
              <div style={{width: '40%', maxWidth: '25rem'}}>
                <span className='icon-blue' onClick={() => setGridView(!gridView)}>
                  { gridView ? <AiOutlineUnorderedList size={30} /> : <TbLayoutGrid size={30} /> }
                </span>
                <div>
                  <input type="search" placeholder='Search for items' />
                </div>
                <a className='icon-plus' href="/add-item">
                  <AiFillPlusCircle size={45} color='#0073e6' />
                </a>
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
          <Row>
            {
              items.map((item, i) => <Col md={gridView ? 3 : 12} key={i}>{item}</Col>)
            }
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default LoanerDashboard