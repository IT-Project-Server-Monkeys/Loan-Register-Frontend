import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/ItemPage.scss'
import { TextButton, InputDropdown, Submitting, Deletable, NoAccess, Header } from '../components';
import { RiImageAddFill } from 'react-icons/ri'
import { fetchCategs, selectCategory, changeCategory, deleteCategory, changeImage, saveItem } from "../utils/itemHelpers";
import noImg from "../images/noImage_300x375.png";
import { noAccessRedirect } from "../utils/helpers";
import { checkAPI } from "../utils/api";

const AddItem = (props) => {
  const [noAccess, setNoAccess] = useState([false, false]);
  const navigate = useNavigate();

  const [itemImg, setItemImg] = useState(null);
  const [displayImg, setDisplayImg] = useState(noImg);
  const [sizeWarn, setSizeWarn] = useState(false);

  const [categList, setCategList] = useState([]);
  const [delableCg, setDelableCg] = useState([]);
  const [newCateg, setNewCateg] = useState("");
  const [ctgDeleting, setCtgDeleting] = useState(false);
  
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
    if (props.loggedIn !== true || props.uid == null || props.onLogout == null) return;

    checkAPI(props.uid,
      () => {
        // console.log("token valid -> fetch category list");
        fetchCategs(props.uid, setCategList, setDelableCg);
      },
      () => { // invalid token
        noAccessRedirect("/login", navigate, setNoAccess, props.onLogout);
      }
    );

  }, [props, navigate]);

  // category changing
  const handleSelCg = (categ) => selectCategory(categ, setNewCateg);
  const handleChgCg = (e) => changeCategory(e, setNewCateg);
  const handleDelCg = async (categ) => {
    setCtgDeleting(true);
    await checkAPI(props.uid,
      () => {
        // console.log("token valid -> delete category");
        deleteCategory(categ, setCategList, props.uid);
        setCtgDeleting(false);
      },
      () => {
        noAccessRedirect("/login", navigate, setNoAccess, props.onLogout);
      }
    );
  }

  // item img changing
  const handleChgImg = (e) => {
    const img = e.target.files[0];
    if (img.size > 256000) setSizeWarn(true); // 250KB size limit
    else {
      setSizeWarn(false);
      changeImage(e.target.files[0], setItemImg, displayImg, setDisplayImg);
    }
  };

  // save item and post to server
  const handleSaveItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let imgString = "";

    const newName = e.target.newName.value;
    const newCateg = e.target.newCateg.value;
    const newDesc = e.target.newDesc.value != null ? e.target.newDesc.value : "";

    // disallow leading/trailing spaces in names & categories
    if (/^\s/.test(newName) || /\s$/.test(newName)) {
      setWarning("No trailing or leading whitespaces allowed in item name.");
      setSubmitting(false);
      return;
    }
    if (/^\s/.test(newCateg) || /\s$/.test(newCateg)) {
      setWarning("No trailing or leading whitespaces allowed in item category.");
      setSubmitting(false);
      return;
    }
    
    // disallow some special characters
    if (/["\\/{};<>`]/.test(newName)) {
      setWarning(`The special characters "\\/{};<>\` are not allowed in item name.`);
      setSubmitting(false);
      return;
    }
    if (/["\\/{};<>`]/.test(newCateg)) {
      setWarning(`The special characters "\\/{};<>\` are not allowed in item category.`);
      setSubmitting(false);
      return;
    }
    if (/["\\/{};<>`]/.test(newDesc)) {
      setWarning(`The special characters "\\/{};<>\` are not allowed in item description.`);
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

    await checkAPI(props.uid,
      async () => {
        // console.log("token valid -> save item");

        if (await saveItem(e, null, categList, setCategList, imgString, props.uid, true))
          navigate(`/dashboard`);
        else {
          setSubmitting(false);
    
          // TODO nicer alert
          alert("There was an error saving your item. Please try again later.");
        }
      },
      () => {
        noAccessRedirect("/login", navigate, setNoAccess, props.onLogout);
      }
    );
  }

  return (
    <><Header loggedIn={props.loggedIn} onLogout={props.onLogout} />
      {noAccess[0] ? <NoAccess sessionExpired={noAccess[1]} /> :
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
            
            {sizeWarn ?
              <h4 className={"big-img-warn warning"}>Image must be under 250KB.</h4>
            : <span></span>}
            <div className={"item-info"}>
              <form id="editItem" disabled={ctgDeleting}
                onSubmit={handleSaveItem} onChange={() => setWarning("")}
              >
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
            <TextButton form="editItem" type="submit" disabled={ctgDeleting}>Save</TextButton>
          </div>
          {submitting ? <Submitting /> : null}
        </div>
      }
    </>
  );
};

export default AddItem;