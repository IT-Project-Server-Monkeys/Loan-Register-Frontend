import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import '../styles/ItemPage.scss'
import { TextButton, InputDropdown, Submitting, Deletable, NoAccess, Header } from '../components';
import { RiImageAddFill } from 'react-icons/ri'
import { fetchItem, fetchCategs, selectCategory, changeCategory, deleteCategory, changeImage, saveItem } from "../utils/itemHelpers";
import { noAccessRedirect } from "../utils/helpers";
import noImg from "../images/noImage_300x375.png";
import { checkAPI } from "../utils/api";

const ItemEdit = (props) => {
  // page navigation
  const navigate = useNavigate();
  const [noAccess, setNoAccess] = useState(false);
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [initLoad, setInitLoad] = useState(false);
  
  // original item information
  const itemId = useParams().id;
  const dbData = location.state ? location.state.item : null;
  const [item, setItem] = useState({
    item_name: "Loading...",
    category: "Loading...",
    description: "Loading..."
  });
  const [displayImg, setDisplayImg] = useState(noImg);
  const [sizeWarn, setSizeWarn] = useState(false);

  // new item image, name, category, description
  const [itemImg, setItemImg] = useState(null);
  const [newName, setNewName] = useState("Loading...");
  const [newCateg, setNewCateg] = useState("Loading...");
  const [newDesc, setNewDesc] = useState("Loading...");
  const [warning, setWarning] = useState("");

  // user category list for modifying & selecting
  const [categOpen, setCategOpen] = useState(false);
  const [categList, setCategList] = useState([]);
  const [delableCg, setDelableCg] = useState([]);
  const [ctgDeleting, setCtgDeleting] = useState(false);

  // item img changing
  const handleChgImg = (e) => {
    const img = e.target.files[0];
    if (img.size > 256000) setSizeWarn(true); // 250KB size limit
    else {
      setSizeWarn(false);
      changeImage(e.target.files[0], setItemImg, displayImg, setDisplayImg);
    }
  };

  // toggle category inputdropdown open/close
  const categShow = () => {
    if (delableCg.length !== 0) setCategOpen((prevState) => !prevState)
  };

  // typeable/selectable category changing via inputdropdown
  const handleSelCg = (categ) => selectCategory(categ, setNewCateg);
  const handleChgCg = (e) => changeCategory(e, setNewCateg);
  const handleDelCg = async (categ) => {
    setCtgDeleting(true);
    await checkAPI(
      async () => {
        console.log("token valid -> delete category");
        await deleteCategory(categ, setCategList, props.uid);
        setCtgDeleting(false);
      },
      () => {
        noAccessRedirect("/login", navigate, setNoAccess, props.onLogout);
        console.log("Session expired");
      }
    );
  }

  // save item and post to server
  const handleSaveItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let imgString = "";
    
    // disallow leading/trailing spaces
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

    // convert any new images into base64 string
    if (itemImg !== null) {
      imgString = await new Promise((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = () =>
          resolve(fileReader.result.replace('data:', '').replace(/^.+,/, ''));
        fileReader.readAsDataURL(itemImg);
      });
    }

    await checkAPI(
      async () => {
        console.log("token valid -> save item");

        if (await saveItem(e, itemId, categList, setCategList, imgString, props.uid, false))
          navigate(`/item-details/${itemId}`);
        else {
          setSubmitting(false);
    
          // TODO nicer alert
          alert("There was an error saving your item. Please try again later.");
        }
      },
      () => {
        noAccessRedirect("/login", navigate, setNoAccess, props.onLogout);
        console.log("Session expired");
      }
    );

  }
  
  // get and show item data
  // get list of potential categories for render & modification
  useEffect(() => {
    if (props.loggedIn !== true || props.uid == null || props.onLogout == null) return;

    if (dbData === null) {
      checkAPI(
        async () => {
          console.log("token valid -> fetch item from server, fetch category list");
          await fetchItem(itemId, setItem);
          fetchCategs(props.uid, setCategList, setDelableCg);
          setInitLoad(true);
        },
        () => {
          noAccessRedirect("/login", navigate, setNoAccess, props.onLogout);
          console.log("Session expired");
        }
      );
    }
    else { console.log("dbData", dbData); setItem(dbData); setInitLoad(true); }

  }, [props, itemId, dbData, navigate]);

  // redirect user away from page if user is not logged in
  useEffect(() => {
    if (props.loggedIn === false) {
      noAccessRedirect("/login", navigate, setNoAccess);
    }
  }, [props.loggedIn, navigate])

  // if user is not item owner, redirect them away from page
  // else, loan original information to display on page
  useEffect(() => {
    if (props.loggedIn !== true) return;
    if (item.item_owner == null) return;
    if (props.uid !== item.item_owner) {
      noAccessRedirect("/dashboard", navigate, setNoAccess);
      return;
    }

    setDisplayImg(item.image_url !== undefined ? item.image_url : noImg)
    setNewName(item.item_name);
    setNewCateg(item.category);
    setNewDesc(item.description);
  }, [item, props.uid, navigate, props.loggedIn])

  return (
    <><Header loggedIn={props.loggedIn} onLogout={props.onLogout} />
      {noAccess ? <NoAccess /> : 
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
            : null}
            <div className={"item-info"}>
              <form id="editItem" disabled={!initLoad || ctgDeleting}
                onSubmit={handleSaveItem} onChange={() => setWarning("")}
              >
                <table><tbody>
                  <tr>
                    <td>Name:</td>
                    <td>
                      <input name="newName" className={"input-box"} type="text"
                        value={newName} onChange={e => setNewName(e.target.value.slice(0, 36))}
                        placeholder="Enter name..." required
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
                  <textarea name="newDesc" style={{width: "-webkit-fill-available"}}
                    value={newDesc} onChange={e => setNewDesc(e.target.value)}
                    placeholder="(Optional) Enter description..." />
                </p>
              </form>
            </div>
          </div>
          <h4 className="warning">{warning}</h4>
          <div className={"btn-list"}>
            <Link to={`/item-details/${itemId}`}
              state={{item: dbData}}
            >
              <TextButton altStyle>Cancel</TextButton>
            </Link>
            <TextButton form="editItem" type="submit" disabled={!initLoad || ctgDeleting}>Save</TextButton>
          </div>
          
          {submitting ? <Submitting /> : null}
        </div>
      }
    </>
  );
};

export default ItemEdit;
