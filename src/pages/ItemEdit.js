import React, { useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/ItemPage.scss'
import { TextButton } from '../components';
import { RiImageAddFill } from 'react-icons/ri'
// import { Modal } from 'reactstrap'


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
  const [itemId, setItemId] = useState(useParams().id);
  console.log(itemId);
  // TODO get item from server
  const item = tempItem;



  return (
    <div className={"item-page"}>
      
      <div className={"item-details"}>

        <div className={"item-image"}>
          <img alt="Sample" src="https://picsum.photos/300/200" />
          <label className={"add-img"}>
            <RiImageAddFill size={30} />
            <input type="file" accept="image/*" style={{display: "none"}} />
          </label>
        </div>
        
        <p className={"item-status"}>Status: {item.being_loaned ? "On Loan" : "Available"}</p>
        <div className={"item-info"}>
          <table><tbody>
            <tr>
              <td>Name:</td> <td>{item.item_name}</td>
            </tr>
            <tr>
              <td>Category:</td> <td>{item.category}</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
            </tr>
            { item.being_loaned ? <>
              <tr>
                <td>Loanee:</td>
              </tr>
              <tr>
                <td>Date loaned:</td>
              </tr>
              <tr>
                <td>Expected return:</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
            </> : null}
            </tbody></table>
          <p>Description:<br />{item.description}</p>
        </div>
      </div>

      <div className={"btn-list"}>
        <a href={`/item-details/${itemId}`}><TextButton altStyle>Cancel</TextButton></a>
        <a href={`/item-details/${itemId}`}><TextButton>Save</TextButton></a>
      </div>

    </div>
  );
};

export default ItemDetails;
