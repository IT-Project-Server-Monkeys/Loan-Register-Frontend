import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/ItemPage.scss'
import { TextButton, InputDropdown } from '../components';
import { RiImageAddFill } from 'react-icons/ri'
import axios from "axios";

const AddItem = (props) => {
  const redirect = useNavigate();
  const [itemImg, setItemImg] = useState(null);
  const [displayImg, setDisplayImg] = useState("https://picsum.photos/100/100");
  const [categList, setCategList] = useState([]);
  const [newCateg, setNewCateg] = useState("");

  // get list of potential categs
  useEffect(() => {
    const fetchUser = async () => {
      let fetchedData = null;
      if (props.loginSession == null) return;
      await axios.get(
        `https://server-monkeys-backend-test.herokuapp.com/testingUser?id=${props.loginSession.userId}`
        )
        .then((res) => fetchedData = res.data)
        .catch((err) => console.log(err));
      
      setCategList(fetchedData[0].item_categories);
    };
    fetchUser();
  }, [props.loginSession]);

  // categ changing
  const selectCategory = (categ) => setNewCateg(categ);
  const deleteCategory = async (categ) => {
    let toDelCateg;
    setCategList((prev) => prev.filter((c) => c !== categ));
    await axios(`https://server-monkeys-backend-test.herokuapp.com/testingItem?item_owner=${props.loginSession.userId}&category=${categ}`)
      .then((res) => toDelCateg = res.data)
      .catch((err) => console.log(err));
    if (toDelCateg.length === 0) {
      console.log(`deletable categ ${categ}`); // TODO delete categ
    } else console.log(`categ ${categ} hidden from view`);
  }
  const changeCategory = (e) => setNewCateg(e.target.value);

  // item img changing
  const changeImage = (e) => {
    setItemImg(e.target.files[0]);
    URL.revokeObjectURL(displayImg);
    setDisplayImg(URL.createObjectURL(e.target.files[0]));
  }

  // save item and post to db
  const saveItem = async (e) => {
    e.preventDefault();
    const newName = e.target.newName.value;
    const newDesc = e.target.newDesc.value;

    let formData = {
      item_owner: props.loginSession.userId,
      being_loaned: false, loan_frequency: 0
    };

    // TODO upload image to arweave and get url
    let imgUrl = "";
    if (itemImg != null);

    formData.image_url = imgUrl;
    formData.item_name = newName;
    formData.category = newCateg;
    if (newDesc !== "") formData.description = newDesc;
      else formData.description = "(Description not set.)";

    await axios({
      method: "post", data: formData,
      url: "https://server-monkeys-backend-test.herokuapp.com/testingItem",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    console.log(formData);

    // if new category not in user current category, put request to user to add it
    if (!(newCateg in categList)) await axios({
      method: "put", data: {
        _id: props.loginSession.userId,
        item_categories: [...categList, newCateg]
      },
      url: "https://server-monkeys-backend-test.herokuapp.com/testingUser",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    redirect(`/dashboard/loaner`); // TODO get new item data & redirect to item page
    // options: get item by name (unique name check?)
    // options: getAllItemByItemOwner, find most recent one (less efficient(?))
    // options: redirect to dashboard
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
              onChange={changeImage} 
            />
          </label>
        </div>
        
        <p className={"item-status"}>&nbsp;</p>
        <div className={"item-info"}>
          <form id="editItem" onSubmit={saveItem}>
            <table><tbody>
              <tr>
                <td>Name:</td>
                <td>
                  <input required name="newName" placeholder="Enter name..." className={"input-box"} type="text" />
                </td>
              </tr>
              <tr>
                <td>Category:</td>
                <td>
                  <InputDropdown required name="newCateg" value={newCateg}
                    placeholder="Enter category..." options={categList}
                    selectOption={selectCategory}
                    deleteOption={deleteCategory}
                    changeOption={changeCategory}
                  />
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
              </tbody></table>
            <p>Description:<br />
              <textarea name="newDesc" style={{width: "-webkit-fill-available"}} placeholder="Enter description..." />
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