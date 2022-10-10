import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/ItemPage.scss'
import { TextButton, InputDropdown, Submitting, Deletable, NoAccess } from '../components';
import { RiImageAddFill } from 'react-icons/ri'
import { fetchCategs, selectCategory, changeCategory, deleteCategory, changeImage, saveItem } from "../utils/itemHelpers";
import noImg from "../images/noImage_300x375.png";
import { noAccessRedirect } from "../utils/helpers";

const AddItem = (props) => {
  const [noAccess, setNoAccess] = useState(false);
  const navigate = useNavigate();

  const [itemImg, setItemImg] = useState(null);
  const [displayImg, setDisplayImg] = useState(noImg);

  const [categList, setCategList] = useState([]);
  const [delableCg, setDelableCg] = useState([]);
  const [newCateg, setNewCateg] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [warning, setWarning] = useState("");

  const [categOpen, setCategOpen] = useState(false);
  const categShow = () => {
    if (delableCg.length !== 0) setCategOpen((prevState) => !prevState)
  };

  useEffect(() => {
    if (props.loggedIn === false) {
      noAccessRedirect("/login", navigate, setNoAccess);
    }
  }, [props.loggedIn, navigate])

  // get list of potential categs
  useEffect(() => {
    fetchCategs(props.uid, setCategList, setDelableCg);
  }, [props.uid]);

  // category changing
  const handleSelCg = (categ) => selectCategory(categ, setNewCateg);
  const handleChgCg = (e) => changeCategory(e, setNewCateg);
  const handleDelCg = (categ) => {
    deleteCategory(categ, setCategList, props.uid);
  }

  // item img changing
  const handleChgImg = (e) => {
    changeImage(e.target.files[0], setItemImg, displayImg, setDisplayImg);
  };

  // save item and post to server
  const handleSaveItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    let imgString = "";

    // disallow leading/trailing spaces in names & categories
    if (/^\s/.test(e.target.newName.value) || /\s$/.test(e.target.newName.value)) {
      setWarning("No trailing or leading whitespaces allowed in item name.");
      setSubmitting(false);
      return;
    }
    if (/^\s/.test(e.target.newCateg.value) || /\s$/.test(e.target.newCateg.value)) {
      setWarning("No trailing or leading whitespaces allowed in item category.");
      setSubmitting(false);
      return;
    }

    if (itemImg !== null) {
      imgString = await new Promise((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = () =>
          resolve(fileReader.result.replace('data:', '').replace(/^.+,/, ''));
        fileReader.readAsDataURL(itemImg);
      });
    }

    await saveItem(e, null, categList, setCategList, imgString, props.uid, true);
    navigate(`/dashboard`);
  }

  return (
    <>{noAccess ? <NoAccess /> :
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
          
          <div className={"item-info"}>
            <form id="editItem" onSubmit={handleSaveItem} onChange={() => setWarning("")}>
              <table><tbody>
                <tr>
                  <td>Name:</td>
                  <td>
                    <input required name="newName" autoComplete="off"
                      className={"input-box"} type="text"
                      placeholder="Enter name..." maxLength={36}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Category:</td>
                  <td>
                    <InputDropdown dropdownOpen={categOpen} toggle={categShow}
                      name="newCateg" placeholder="Enter category..."
                      value={newCateg} changeOption={handleChgCg} required
                    >
                      {categList.map((c) => {
                        return <Deletable askRm
                          field="category" key={`opt-${c}`}
                          selectOption={(e) => {categShow(); handleSelCg(e)}}
                          deleteOption={handleDelCg} canDel={delableCg.includes(c)}
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
              <p><span>Description:</span><br />
                <textarea name="newDesc" style={{width: "-webkit-fill-available"}} placeholder="(Optional) Enter description..." />
              </p>
            </form>
          </div>
        </div>
        <h4 className="warning">{warning}</h4>
        <div className={"btn-list"}>
          <TextButton altStyle
            onClick={() => navigate(`/dashboard`)}
          >Cancel</TextButton>
          <TextButton form="editItem" type="submit">Save</TextButton>
        </div>
        {submitting ? <Submitting /> : null}
      </div>
    }</>
  );
};

export default AddItem;