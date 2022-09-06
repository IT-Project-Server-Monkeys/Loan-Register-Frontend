import axios from "axios";

const fetchItem = async (itemId, setItem, addOns={}) => {
  let fetchedData = null;

  await axios.get(
    `https://server-monkeys-backend-test.herokuapp.com/testingItem?_id=${itemId}`
    )
    .then((res) => fetchedData = res.data)
    .catch((err) => console.log(err));

    if (fetchedData != null) setItem({...fetchedData, ...addOns});
}

const fetchCategs = async (loginSession, setCategList) => {
  let fetchedData = null;
  if (loginSession == null) return;
  await axios.get(
    `https://server-monkeys-backend-test.herokuapp.com/testingUser?id=${loginSession.userId}`
    )
    .then((res) => fetchedData = res.data)
    .catch((err) => console.log(err));
  
  setCategList(fetchedData[0].item_categories);
};

// category changing
const selectCategory = (categ, setNewCateg) => setNewCateg(categ);

const changeCategory = (e, setNewCateg) => setNewCateg(e.target.value);

const deleteCategory = async (categ, setCategList, uid) => {
  setCategList((prev) => prev.filter((c) => c !== categ));
  await axios({
    method: "put", data: { _id: uid, delete_category: categ },
    url: "https://server-monkeys-backend-test.herokuapp.com/testingUser",
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

  await axios({
    method: newItem ? "post" : "put", data: formData,
    url: "https://server-monkeys-backend-test.herokuapp.com/testingItem",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  console.log(formData);

  // if new category not in user current category, put request to user to add it
  if (newCateg !== "" && !(categList.includes(newCateg))) {
    setCategList([...categList, newCateg]);
    await axios({
      method: "put", data: {
        _id: uid,
        new_category: newCateg
      },
      url: "https://server-monkeys-backend-test.herokuapp.com/testingUser",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
}

export { fetchItem, fetchCategs, selectCategory, changeCategory, deleteCategory, changeImage, saveItem };