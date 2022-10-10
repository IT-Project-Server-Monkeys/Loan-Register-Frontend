import API from "./api";
import { noCaseCmp } from "./helpers";

// gets item from server
const fetchItem = async (itemId, setItem) => {
  let fetchedData = null;
  if (itemId == null) return;

  await API.get(`/items?_id=${itemId}`)
    .then((res) => {fetchedData = res.data})
    .catch((err) => console.log(err));

  if (fetchedData != null) setItem((i) => {return {
    ...i, ...fetchedData, item_id: itemId,
    loan_status: fetchedData.being_loaned ? null : "Available",
    image_url: fetchedData.image_url ? "" : fetchedData.image_url
  }});
}

// gets all items of a user from server
const fetchUserItems = async (uid, setItems) => {
  let fetchedData = null;
  if (uid == null) return;

  await API.get(`/items?item_owner=${uid}`)
    .then((res) => fetchedData = res.data)
    .catch((err) => console.log(err));
  
  setItems(fetchedData);
};

// gets user's available categories from server
const fetchCategs = async (uid, setCategList, setDelableCg) => {
  let fetchedData = null;
  if (uid == null) return;

  await API.get(`/users?id=${uid}`)
    .then((res) => fetchedData = res.data)
    .catch((err) => console.log(err));
  
  setCategList(fetchedData.item_categories.sort(noCaseCmp));
  fetchDelableCg(fetchedData.item_categories, uid, setDelableCg);
};

// gets the user's unused categories from server
const fetchDelableCg = async (categList, uid, setDelableCg) => {
  if (uid == null) return;
  let delable = [];

  await categList.forEach(async c => {
    await API.get(`/items?category=${c}&item_owner=${uid}`)
      .then(res => { if (res.data.length === 0) delable.push(c); })
      .catch(err => console.log(err))
  });
  setDelableCg(delable);
}

// category changing via click input of inputdropdown
const selectCategory = (categ, setNewCateg) => setNewCateg(categ);

// category changing via keyboard input of inputdropdown
const changeCategory = (e, setNewCateg) => setNewCateg(e.target.value.slice(0, 22));

// delete an unused category via inputdropdown deletable
const deleteCategory = async (categ, setCategList, uid) => {
  setCategList((prev) => prev.filter((c) => c !== categ));
  await API(`/users`, {
    method: "put", data: { _id: uid, delete_category: categ },
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

// selects an image
const changeImage = (img, setItemImg, displayImg, setDisplayImg) => {
  setItemImg(img);
  URL.revokeObjectURL(displayImg);
  setDisplayImg(URL.createObjectURL(img));
}

// saves new item information to server
const saveItem = async (e, itemId, categList, setCategList, imgString, uid, newItem) => {
  e.preventDefault();
  const newName = e.target.newName.value;
  const newCateg = e.target.newCateg.value;
  const newDesc = e.target.newDesc.value;

  let formData = newItem ? {
    item_owner: uid,
    being_loaned: false, loan_frequency: 0
  } : { _id: itemId } ;
  if (imgString !== "") formData.image_enc = imgString;
  if (newName !== "") formData.item_name = newName;
  if (newCateg !== "") formData.category = newCateg;
  formData.description = newDesc;

  // If new category not currently in user's available categories, put a request to user to add it
  if (newCateg !== "" && !(categList.includes(newCateg))) {
    setCategList((prevCgList) => { return [...prevCgList, newCateg] });

    await API(`/users`, {
      method: "put",
      data: { _id: uid, new_category: newCateg },
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => console.log(res))
      .catch((err) => {console.log(err); return false;});
  }

  // update item information
  await API(`/items`, {
    method: newItem ? "post" : "put", data: formData,
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => console.log(res))
    .catch((err) => {console.log(err); return false;});
  console.log(formData);

  return true;
}

export { fetchItem, fetchUserItems, fetchCategs, fetchDelableCg, selectCategory, changeCategory, deleteCategory, changeImage, saveItem };