import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../styles/ItemPage.scss'
import { TextButton } from '../components';
import { RiImageAddFill } from 'react-icons/ri'
import axios from "axios";


// temporary data. TODO get real data from server
const tempItem = {
  "_id": {
      "$oid": "63084e1ebb2f12d6134fe1a4"
  },
  "item_name": "failed retrieval",
  "category": "Books",
  "description": "hohoho.",
  "item_owner": {
      "$oid": "62fd8a9df04410afbc6df31d"
  },
  "being_loaned": true,
  "loan_frequency": {
      "$numberInt": "0"
  }
}

const ItemEdit = () => {
  const itemId = useParams().id;
  const [item, setItem] = useState({});

  const [category, setCategory] = useState();

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

    setCategory(item.category);
    
  }, [itemId, item])

  return (
    <div className={"item-page"}>
      
      <div className={"item-details"}>

        <div className={"item-image"} style={{backgroundImage: "url('https://picsum.photos/100/100')" }}>
          <label className={"add-img"}>
            <RiImageAddFill size={40} />
            <input type="file" accept="image/*" style={{display: "none"}} />
          </label>
        </div>
        
        <p className={"item-status"}>Status: {item.being_loaned ? "On Loan" : "Available"}</p>
        <div className={"item-info"}>
          <table><tbody>
            <tr>
              <td>Name:</td><td><input value={item.item_name} className={"input-box"} type="text" /></td>
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
        <a href={`/item-details/${itemId}`}><TextButton altStyle>Cancel</TextButton></a>
        <a href={`/item-details/${itemId}`}><TextButton>Save</TextButton></a>
      </div>

    </div>
  );
};

export default ItemEdit;
