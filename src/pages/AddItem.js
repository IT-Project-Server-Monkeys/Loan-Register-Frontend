import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/ItemPage.scss'
import { TextButton, InputDropdown } from '../components';
import { RiImageAddFill } from 'react-icons/ri'
import { fetchCategs, selectCategory, changeCategory, deleteCategory, changeImage, saveItem } from "../utils/itemHelpers";

const AddItem = (props) => {
  const redirect = useNavigate();
  const [itemImg, setItemImg] = useState(null);
  const [displayImg, setDisplayImg] = useState("https://picsum.photos/100/100");
  const [categList, setCategList] = useState([]);
  const [newCateg, setNewCateg] = useState("");

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
    saveItem(e, "", categList, itemImg, props.loginSession.userId, true);
    redirect(`/dashboard/loaner`);
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
                  <input required name="newName" autoComplete="off"
                    className={"input-box"} type="text"
                    placeholder="Enter name..."
                  />
                </td>
              </tr>
              <tr>
                <td>Category:</td>
                <td>
                  <InputDropdown required name="newCateg" value={newCateg}
                    placeholder="Enter category..." options={categList} field="category"
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
              <textarea name="newDesc" style={{width: "-webkit-fill-available"}} placeholder="(Optional) Enter description..." />
            </p>
          </form>
        </div>
      </div>

      <div className={"btn-list"}>
        <TextButton altStyle
          onClick={() => redirect(`/dashboard/loaner`)}
        >Cancel</TextButton>
        <TextButton form="editItem" type="submit">Save</TextButton>
      </div>

    </div>
  );
};

export default AddItem;