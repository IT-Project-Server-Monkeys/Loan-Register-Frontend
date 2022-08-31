import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../styles/ItemPage.scss'
import { TextButton, Deletable, InputDropdown } from '../components';
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

const ItemEdit = (props) => {
  const itemId = useParams().id;
  const [item, setItem] = useState({});
  const [categList, setCategList] = useState([]);
  const [newCateg, setNewCateg] = useState("");

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
  }, [itemId, item]);

  useEffect(() => {
    const fetchUser = async () => {
      let fetchedData = null;
      await axios.get(
        `https://server-monkeys-backend-test.herokuapp.com/testingUser?id=${props.loginSession.userId}`
        )
        .then((res) => fetchedData = res.data)
        .catch((err) => console.log(err));
      
      setCategList(fetchedData[0].item_categories);
    };
    fetchUser();
  }, [props.loginSession]);

  const selectCategory = (categ) => setNewCateg(categ);
  const deleteCategory = (categ) => {
    // TODO axios request, check if categ empty
    setCategList((prev) => prev.filter((c) => c != categ));
  }
  const changeCategory = (e) => setNewCateg(e.target.value);

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
          <form>
            <table><tbody>
              <tr>
                <td>Name:</td>
                <td>
                  <input placeholder={item.item_name} className={"input-box"} type="text" />
                </td>
              </tr>
              <tr>
                <td>Category:</td>
                <td>
                  <input
                    placeholder={item.category} value={newCateg} onChange={changeCategory}
                    className={"input-box"} type="text"
                  />
                  <InputDropdown>{categList.map((c) => {
                    return <Deletable
                      selectOption={selectCategory} deleteOption={deleteCategory}
                      key={c}>{c}
                    </Deletable>
                  })}</InputDropdown>
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
              </tbody></table>
            <p>Description:<br />
              <textarea style={{width: "-webkit-fill-available"}} placeholder={item.description} />
            </p>
          </form>
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
