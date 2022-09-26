import API from "./api";
import dateFormat from 'dateformat';

// get all loanee names & ids from server (for loan form validation)
const fetchAllLoanees = async (setAllLoanees) => {
  let fetchedData = {};
  await API.get(`/users?all=1`)
    .then((res) => res.data.forEach((l) => {fetchedData[l.display_name] = l._id}))
    .catch((err) => console.log(err));

  setAllLoanees(fetchedData);
}

// get info on an item's current loan
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
    ...initItem, loan_id: fetchedData._id, loanee_name: loaneeName, loan_status: fetchedData.status,
    loan_start_date: dateFormat(fetchedData.loan_start_date, 'dd/mm/yyyy'),
    intended_return_date: dateFormat(fetchedData.intended_return_date, 'dd/mm/yyyy')
  }});
}

// given a new loan creation, complete form data
const createLoan = (input, onSuccess, onFailure) => {
  let formData = { ...input };

  const today = new Date();
  const dateDiff = today - new Date(Date.parse(formData.intended_return_date));
  if (dateDiff > 0) formData.status = "Overdue";
  else formData.status = "On Loan";

  saveLoan(formData, true, onSuccess, onFailure);

}

// given an existing loan edit, complete form data
const editLoan = (input, onSuccess, onFailure) => {
  let formData = { ...input };
  
  const today = new Date();
  const dateDiff = today - new Date(Date.parse(formData.intended_return_date));
  if (dateDiff > 0) formData.status = "Overdue";
  else formData.status = "On Loan";

  saveLoan(formData, false, onSuccess, onFailure)
};

// given an existing loan return, complete form data
const returnLoan = async (item, onSuccess, onFailure) => {
  const actual_return_date = new Date();
  const dateDiff = actual_return_date - new Date(Date.parse(item.intended_return_date));

  let formData = { _id: item.loan_id, actual_return_date: actual_return_date };
  if (dateDiff > 0) formData.status = "Late Return";
  else if (dateDiff > -86400000) formData.status = "On Time Return";
  else formData.status = "Early Return";

  saveLoan(formData, false, onSuccess, onFailure);
}

// sends completed loan form data to server
const saveLoan = async (formData, newItem, onSuccess, onFailure) => {

  // clean form
  for (const prop in formData)
    if (formData[prop] === "" || formData[prop] === null) delete formData[prop];

  console.log(formData);
  await API(`/loans`, {
    method: newItem ? "post" : "put", data: formData,
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {console.log(res); onSuccess();})
    .catch((err) => {console.log(err); onFailure();});
}

export { fetchAllLoanees, fetchLoan, createLoan, editLoan, returnLoan };