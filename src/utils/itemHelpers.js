import API from "./api";

const fetchItem = async (itemId, setItem, addOns={}) => {
  let fetchedData = null;
  if (itemId == null) return;

  await API.get(`/items?_id=${itemId}`)
    .then((res) => fetchedData = res.data)
    .catch((err) => console.log(err));

  if (fetchedData != null) setItem({...fetchedData, ...addOns});
}

const fetchCategs = async (uid, setCategList) => {
  let fetchedData = null;
  if (uid == null) return;

  await API.get(`/users?id=${uid}`)
    .then((res) => fetchedData = res.data)
    .catch((err) => console.log(err));
  
  setCategList(fetchedData.item_categories);
};

const fetchDelableCg = async (categList, uid, setDelableCg) => {
  if (uid == null) return;
  let delable = [];

  await categList.forEach(async c => {
    await API.get(`/items?category=${c}&item_owner=${uid}`)
      .then(res => { console.log(res.data); if (res.data.length === 0) delable.push(c); })
      .catch(err => console.log(err))
  });
  setDelableCg(delable);
}

// category changing
const selectCategory = (categ, setNewCateg) => setNewCateg(categ);

const changeCategory = (e, setNewCateg) => setNewCateg(e.target.value);

const deleteCategory = async (categ, setCategList, uid) => {
  setCategList((prev) => prev.filter((c) => c !== categ));
  await API(`/users`, {
    method: "put", data: { _id: uid, delete_category: categ },
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

// item image changing
const changeImage = (e, setItemImg, displayImg, setDisplayImg) => {
  setItemImg(e.target.files[0]);
  URL.revokeObjectURL(displayImg);
  setDisplayImg(URL.createObjectURL(e.target.files[0]));
}

const saveItem = async (e, itemId, categList, setCategList, itemImg, uid, newItem) => {
  e.preventDefault();
  const newName = e.target.newName.value;
  const newCateg = e.target.newCateg.value;
  const newDesc = e.target.newDesc.value;

  let formData = newItem ? {
    item_owner: uid,
    being_loaned: false, loan_frequency: 0
  } : { _id: itemId } ;
  if (itemImg !== null) formData.image = itemImg;
  if (newName !== "") formData.item_name = newName;
  if (newCateg !== "") formData.category = newCateg;
  if (newDesc !== "") formData.description = newDesc;
    else formData.description = "(No description.)";

  await API(`/items`, {
    method: newItem ? "post" : "put", data: formData,
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  console.log(formData);

  // if new category not in user current category, put request to user to add it
  if (newCateg !== "" && !(categList.includes(newCateg))) {
    setCategList((prevCgList) => { return [...prevCgList, newCateg] });

    await API(`/users`, {
      method: "put",
      data: { _id: uid, new_category: newCateg },
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
}

export { fetchItem, fetchCategs, fetchDelableCg, selectCategory, changeCategory, deleteCategory, changeImage, saveItem };