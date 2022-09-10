import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/ItemPage.scss'
import { TextButton, InputDropdown, Submitting, Deletable } from '../components';
import { RiImageAddFill } from 'react-icons/ri'
import { fetchItem, fetchCategs, fetchDelableCg, selectCategory, changeCategory, deleteCategory, changeImage, saveItem } from "../utils/itemHelpers";

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
  const [delableCg, setDelableCg] = useState([]);
  const [newName, setNewName] = useState("");
  const [newCateg, setNewCateg] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // get and show item info
  useEffect(() => {
    fetchItem(itemId, setItem);
  }, [itemId]);

  useEffect(() => {
    if (item.item_owner == null) return;
    if (props.uid == null || props.uid !== item.item_owner) {
      // TODO show that user does not have permission to view item
      if (props.uid == null) redirect("/login");
      else redirect("/dashboard/loaner");
      return;
    }

    setNewName(item.item_name);
    setNewCateg(item.category);
    setNewDesc(item.description);
  }, [item, props.uid, redirect])

  // get list of potential categs
  useEffect(() => {
    fetchCategs(props.uid, setCategList);
  }, [props.uid]);

  useEffect(() => {
    fetchDelableCg(categList, props.uid, setDelableCg);
  }, [categList, props.uid])

  // categ changing
  const handleSelCg = (categ) => selectCategory(categ, setNewCateg);
  const handleChgCg = (e) => changeCategory(e, setNewCateg);
  const handleDelCg = (categ) => {
    deleteCategory(categ, setCategList, props.uid);
  }

  // item img changing
  const handleChgImg = (e) => changeImage(e, setItemImg, displayImg, setDisplayImg);

  // save item and post to server
  const handleSaveItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await saveItem(e, itemId, categList, setCategList, itemImg, props.uid, false);
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
                  <input name="newName" className={"input-box"} type="text"
                    value={newName} onChange={e => setNewName(e.target.value)}
                    placeholder="Enter name..."
                  />
                </td>
              </tr>
              <tr>
                <td>Category:</td>
                <td>
                  <InputDropdown
                    name="newCateg" placeholder="Enter category..."
                    value={newCateg} changeOption={handleChgCg}
                  >
                    {categList.map((c) => {
                      return <Deletable
                        field="category" key={`opt-${c}`}
                        selectOption={handleSelCg} deleteOption={handleDelCg}
                        canDel={delableCg.includes(c)}
                        hideOption={(categ) => setCategList(
                            (prev) => prev.filter((c) => c !== categ)
                          )} >
                        {c}
                      </Deletable>
                    })}
                  </InputDropdown>
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
              </tbody></table>
            <p>Description:<br />
              <textarea name="newDesc" style={{width: "-webkit-fill-available"}}
                value={newDesc} onChange={e => setNewDesc(e.target.value)}
                placeholder="(Optional) Enter description..." />
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

      <Submitting style={submitting ? {display: "flex"} : {display: "none"}} />
    </div>
  );
};

export default ItemEdit;
