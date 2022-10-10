import API from "./api";
import dateFormat from 'dateformat';
import { toISO } from "./helpers";

// get all loanee names & ids from server
const fetchAllUsernames = async (setAllUsers, byUID = false) => {
  let fetchedData = {};
  await API.get(`/users?all=1`)
    .then((res) => res.data.forEach((l) => {
      if (byUID) fetchedData[l._id] = l.display_name;
      else fetchedData[l.display_name] = l._id;
    }))
    .catch((err) => console.log(err));

  setAllUsers(fetchedData);
}

// gets all loans of a loaner from server
const fetchUserLoans = async (uid, setLoans) => {
  let fetchedData = null;
  if (uid == null) return;

  await API.get(`/loans?loaner_id=${uid}`)
    .then((res) => fetchedData = res.data)
    .catch((err) => console.log(err));

  for (let i=0; i<fetchedData.length; i++) {
    if (fetchedData[i].loanee_name == null) {
      await API.get(`/users?id=${fetchedData[i].loanee_id}`)
        // eslint-disable-next-line
        .then((res) => fetchedData[i].loanee_name = res.data.display_name)
        .catch(err => console.log(err))
    }
  }
  
  setLoans(fetchedData);
};

// get info on an item's current loan
const fetchCurLoan = async (itemId, setItem) => {
  let fetchedData = null;

  await API.get(`/loans?item_id=${itemId}&status=current`)
    .then((res) => fetchedData = res.data[0])
    .catch((err) => console.log(err));

  if (fetchedData.loanee_name == null) {
    await API.get(`/users?id=${fetchedData.loanee_id}`)
      .then((res) => fetchedData.loanee_name = res.data.display_name)
      .catch(err => console.log(err))
  }

  setItem((initItem) => {return {
    ...initItem, loan_id: fetchedData._id, loanee_name: fetchedData.loanee_name, loan_status: fetchedData.status,
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
  const dateDiff = actual_return_date - new Date(toISO(item.intended_return_date));

  let formData = { _id: item.loan_id, actual_return_date: actual_return_date };

  if (Math.abs(dateDiff) < 86400000) formData.status = "On Time Return";
  else if (dateDiff < 0) formData.status = "Early Return";
  else formData.status = "Late Return";

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

export { fetchAllUsernames, fetchUserLoans, fetchCurLoan, createLoan, editLoan, returnLoan };