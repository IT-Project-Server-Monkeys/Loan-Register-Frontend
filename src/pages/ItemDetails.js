import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/ItemPage.scss'
import { TextButton } from '../components';
import { MdEdit } from 'react-icons/md';
import axios from "axios";
// import { Modal } from 'reactstrap'


// temporary data. TODO get real data from server
const tempItem = {
  "_id": {
      "$oid": "63084e1ebb2f12d6134fe1a4"
  },
  "item_name": "failed retrieval",
  "category": "uwu",
  "description": "fake data.",
  "item_owner": {
      "$oid": "62fd8a9df04410afbc6df31d"
  },
  "being_loaned": true,
  "loan_frequency": {
      "$numberInt": "0"
  }
}

const ItemDetails = () => {
  const itemId = useParams().id;
  const [item, setItem] = useState({});

  useEffect(() => {
    
    const fetchItem = async () => {
      let fetchedData = null;
  
      await axios.get(
        `https://server-monkeys-backend-test.herokuapp.com/testingItem?id=${itemId}`
        )
        .then((res) => fetchedData = res.data)
        .catch((err) => console.log(err));
  
        if (fetchedData != null) setItem(fetchedData);
        else setItem(tempItem);
    }
    fetchItem();

  }, [itemId])

  return (
    <div className={"item-page"}>

      <a href={`/item-details/${itemId}/edit`}><button className={"edit-item icon-blue"}>
        <MdEdit size={40} />
      </button></a>
      
      <div className={"item-details"}>

        <div className={"item-image"} style={{backgroundImage: "url('https://picsum.photos/400/400')" }} />
        
        <p className={"item-status"}>Status: {item.being_loaned ? "On Loan" : "Available"}</p>
        <div className={"item-info"}>
          <table><tbody>
            <tr>
              <td>Name:</td><td>{item.item_name}</td>
            </tr>
            <tr>
              <td>Category:</td><td>{item.category}</td>
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
