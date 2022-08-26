import React from "react";
import { useParams } from "react-router-dom";
import '../styles/ItemDetails.scss'
import { TextButton } from '../components';
import { RiImageAddFill } from 'react-icons/ri'
import { Modal } from 'reactstrap'


// temporary data. TODO get real data from server
const tempItem = {
  "_id": {
      "$oid": "63084e1ebb2f12d6134fe1a4"
  },
  "item_name": "Harry Potter",
  "category": "Books",
  "description": "The Philosopher's Stone.",
  "item_owner": {
      "$oid": "62fd8a9df04410afbc6df31d"
  },
  "being_loaned": true,
  "loan_frequency": {
      "$numberInt": "0"
  }
}

const ItemDetails = (props) => {
  let { itemId } = useParams();
  console.log(itemId);
  // TODO get item from server
  const item = tempItem;



  return (
    <div className={"item-page"}>
      
      <div className={"item-details"}>

        <div className={"item-image"}>
          <img alt="Sample" src="https://picsum.photos/300/200" />
          <span><RiImageAddFill size={30} /></span>
        </div>
        
        <p className={"item-status"}>Status: {item.being_loaned ? "On Loan" : "Available"}</p>
        <div className={"item-info"}>
          <table>
            <tr>
              <td>Name:</td> <td>{item.item_name}</td>
            </tr>
            <tr>
              <td>Category:</td> <td>{item.category}</td>
            </tr>
            { item.being_loaned ? <>
              <tr>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>Loanee:</td>
              </tr>
              <tr>
                <td>Date loaned:</td>
              </tr>
              <tr>
                <td>Expected return:</td>
              </tr>
            </> : null}
          </table>
          <p>Description:<br />{item.description}</p>
        </div>
      </div>

      <div className={"btn-list"}>
        <a href="/history"><TextButton>History</TextButton></a>
        {item.being_loaned ? <>
          <TextButton>Edit Loan</TextButton>
          <TextButton>Mark Return</TextButton>
        </> :
          <TextButton>Loan Item</TextButton>
        }
      </div>

    </div>
  );
};

export default ItemDetails;
