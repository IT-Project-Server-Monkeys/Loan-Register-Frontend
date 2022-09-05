import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/ItemPage.scss'
import { TextButton, InputDropdown } from '../components';
import { RiImageAddFill } from 'react-icons/ri'
import { fetchItem, fetchCategs, selectCategory, changeCategory, deleteCategory, changeImage, saveItem } from "../utils/itemHelpers";

const ItemEdit = (props) => {
  const redirect = useNavigate();
  const itemId = useParams().id;
  const [item, setItem] = useState({
    item_name: "Loading...",
    category: "Loading...",
    description: "Loading..."
  });
  const [itemImg, setItemImg] = useState(null);
  const [displayImg, setDisplayImg] = useState("https://picsum.photos/100/100");
  const [categList, setCategList] = useState([]);
  const [newCateg, setNewCateg] = useState("");

  // get and show item info
  useEffect(() => {
    fetchItem(itemId, item, setItem);
  }, [itemId, item]);

  // get list of potential categs
  useEffect(() => {
    fetchCategs(props.loginSession, setCategList);
  }, [props.loginSession]);

  // categ changing
  const handleSelCg = (categ) => selectCategory(categ, setNewCateg);
  const handleChgCg = (e) => changeCategory(e, setNewCateg);
  const handleDelCg = (categ) => {
    // TODO popup window
    deleteCategory(categ, setCategList, props.loginSession.userId);
  }

  // item img changing
  const handleChgImg = (e) => changeImage(e, setItemImg, displayImg, setDisplayImg);

  // save item and post to server
  const handleSaveItem = (e) => {
    saveItem(e, itemId, newCateg, categList, setCategList, itemImg, props.loginSession.userId, false);
    redirect(`/item-details/${itemId}`);
  }

  return (
    <div className={"item-page"}>
      <div className={"item-details"}>
        <div className={"item-image"} style={{backgroundImage: `url(${displayImg})`}}>
          <label className={"add-img"}>
            <RiImageAddFill size={40} />
            <input
              type="file" accept="image/*" 
              name="newImg" style={{display: "none"}}
              onChange={handleChgImg} 
            />
          </label>
        </div>
        
        <p className={"item-status"}>&nbsp;</p>
        <div className={"item-info"}>
          <form id="editItem" onSubmit={handleSaveItem}>
            <table><tbody>
              <tr>
                <td>Name:</td>
                <td>
                  <input name="newName" placeholder={item.item_name} className={"input-box"} type="text" />
                </td>
              </tr>
              <tr>
                <td>Category:</td>
                <td>
                  <InputDropdown name="newCateg" value={newCateg}
                    placeholder={item.category} options={categList}
                    selectOption={handleSelCg}
                    changeOption={handleChgCg}
                    deleteOption={handleDelCg}
                  />
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
              </tbody></table>
            <p>Description:<br />
              <textarea name="newDesc" style={{width: "-webkit-fill-available"}} placeholder={item.description} />
            </p>
          </form>
        </div>
      </div>

      <div className={"btn-list"}>
        <TextButton altStyle
          onClick={() => redirect(`/item-details/${itemId}`)}
        >Cancel</TextButton>
        <TextButton form="editItem" type="submit">Save</TextButton>
      </div>

    </div>
  );
};

export default ItemEdit;
