import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    await axios(`https://server-monkeys-backend-test.herokuapp.com/testingItem?item_owner=${props.loginSession.userId}&category=${categ}`)
      .then((res) => toDelCateg = res.data)
      .catch((err) => console.log(err));
    if (toDelCateg.length === 0) {
      console.log(`deletable categ ${categ}`); // TODO delete categ
    } else console.log(`categ ${categ} hidden from view`);
    setCategList((prev) => prev.filter((c) => c !== categ));
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

    let formData = new FormData();
    if (itemImg != null) formData.append("image", itemImg);
    if (newName != null) formData.append("item_name", newName);
    if (newCateg != null) formData.append("category", newCateg);
    if (newDesc != null) formData.append("description", newDesc);

    await axios.put(
        'https://server-monkeys-backend-test.herokuapp.com/', formData,
        {headers: { "Content-Type": "multipart/form-data" }}
      )
      .then(res => console.log(res))
      .catch(e => console.log(e));
      // TODO testing
      console.log(formData);

    redirect(`/dashboard/loaner`); // TODO get new item data & redirect to item page
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
                  <input name="newName" placeholder="Enter name..." className={"input-box"} type="text" />
                </td>
              </tr>
              <tr>
                <td>Category:</td>
                <td>
                  <InputDropdown name="newCateg" value={newCateg}
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