import API from "./api";
import dateFormat from 'dateformat';

const fetchAllLoanees = async (setAllLoanees) => {
  let fetchedData = {};
  await API.get(`/users?all=1`)
    .then((res) => res.data.forEach((l) => {fetchedData[l.display_name] = l._id}))
    .catch((err) => console.log(err));
  setAllLoanees(fetchedData);
}

const fetchLoan = async (itemId, setItem) => {
  let fetchedData = null;
  let loaneeName = "";

  await API.get(`/loans?item_id=${itemId}&status=current`)
    .then((res) => fetchedData = res.data[0])
    .catch((err) => console.log(err));

  await API.get(`/users?id=${fetchedData.loanee_id}`)
    .then((res) => loaneeName = res.data.display_name)
    .catch(err => console.log(err))

  setItem((initItem) => {return {
    ...initItem, loan_id: fetchedData._id, loanee_name: loaneeName,
    loan_start_date: dateFormat(fetchedData.loan_start_date, 'dd/mm/yyyy'),
    intended_return_date: dateFormat(fetchedData.intended_return_date, 'dd/mm/yyyy')
  }});
}

const createLoan = (input, redirect) => {
  let formData = { status: "Current", ...input };
  if (input.loan_start_date === null || input.loan_start_date === "")
    formData.loan_start_date = new Date();
  saveLoan(formData, true, redirect);

}

const editLoan = (formData, redirect) => saveLoan(formData, false, redirect);

const returnLoan = async (item, redirect) => {
  const actual_return_date = new Date();
  const dateDiff = actual_return_date - new Date(Date.parse(item.intended_return_date));

  let loanFormData = { _id: item.loan_id, actual_return_date: actual_return_date };
  if (dateDiff > 0) saveLoan({...loanFormData, status: "Late Return"});
  else if (dateDiff > -86400000) saveLoan({...loanFormData, status: "On Time Return"});
  else saveLoan({...loanFormData, status: "Early Return"}, false, redirect);
}

const saveLoan = async (formData, newItem, redirect) => {

  // clean form
  for (const prop in formData)
    if (formData[prop] === "" || formData[prop] === null) delete formData[prop];

  console.log(formData);
  await API(`/loans`, {
    method: newItem ? "post" : "put", data: formData,
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  redirect();
}

export { fetchAllLoanees, fetchLoan, createLoan, editLoan, returnLoan };