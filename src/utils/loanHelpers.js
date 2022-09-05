import axios from "axios";

const fetchLoan = async (itemId, setItem) => {
  let fetchedData = null;
  let loaneeName = "";

  await axios.get(`https://server-monkeys-backend-test.herokuapp.com/testingLoan?item_id=${itemId}&status=current`)
    .then((res) => fetchedData = res.data[0])
    .catch((err) => console.log(err));

  await axios.get(`https://server-monkeys-backend-test.herokuapp.com/testingUser?id=${fetchedData.loanee_id}`)
    .then((res) => loaneeName = res.data[0].display_name)
    .catch(err => console.log(err))

  setItem((initItem) => {return {
    ...initItem, loan_id: fetchedData._id, loanee: loaneeName,
    loan_start_date: new Date(Date.parse(fetchedData.loan_start_date)).toLocaleDateString(),
    intended_return_date: new Date(Date.parse(fetchedData.intended_return_date)).toLocaleDateString()
  }});
}

const createLoan = (input, uid) => {
  let loanFormData = { status: "Current", loaner_id: uid, ...input};
  if (input.loan_start_date === null || input.loan_start_date === "")
    loanFormData.loan_start_date = new Date();
  saveLoan(loanFormData, true);
}

const editLoan = (formData) => {
  saveLoan(formData, false);
}

const returnLoan = async (item) => {
  const actual_return_date = new Date();
  const dateDiff = actual_return_date - new Date(Date.parse(item.intended_return_date));

  let loanFormData = { _id: item.loan_id, actual_return_date: actual_return_date };
  if (dateDiff > 0) saveLoan({...loanFormData, status: "Late Return"});
  else if (dateDiff > -86400000) saveLoan({...loanFormData, status: "On Time Return"});
  else saveLoan({...loanFormData, status: "Early Return"}, false);
}

const saveLoan = async (formData, newItem) => {

  // clean form
  for (const prop in formData)
    if (formData[prop] === "" || formData[prop] === null) delete formData[prop];

  console.log(formData);
  await axios({
    method: newItem ? "post" : "put", data: formData,
    url: "https://server-monkeys-backend-test.herokuapp.com/testingLoan",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  window.location.reload();
}

export { fetchLoan, createLoan, editLoan, returnLoan };