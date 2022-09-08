import React, { useEffect, useState } from "react";
import "../styles/LoanForm.scss"; // component scoped style
import { TextButton, TextBkgBox, InputDropdown, Submitting } from "./";
import { Modal } from 'reactstrap';
import { fetchAllLoanees } from "../utils/loanHelpers";

const toLocale = (dateString) => {
  if (!dateString.includes("-")) return "";
  return (new Date(Date.parse(dateString))).toLocaleDateString();
}

// assume DD/MM/YYYY format
const toISO = (dateString) => {
  if (dateString.includes("-")) return dateString;
  else if (dateString.includes("/")) {
    let ds = dateString.split("/");
    return `${ds[2]}-${ds[1]}-${ds[0]}`;
  }
  else return "";
}

const LoanForm = (props) => {
  const [letSubmit, setLetSubmit] = useState(false);
  const [allLoanees, setAllLoanees] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSubmitting(false);
    fetchAllLoanees(setAllLoanees);
  }, []);

  const checkSubmittable = (e) => {
    let form = document.getElementById("loanForm");
    
    form.loanDate.value !== "" && (form.returnDate.min = form.loanDate.value);
    if (form.returnDate.value < form.loanDate.value)
      form.returnDate.value = "";

    setLetSubmit(
      form.loanee.value in allLoanees
      && form.loanDate.value !== ""
      && form.returnDate.value !== ""
    );
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("form submitted");

    setSubmitting(true);

    props.onSubmit({
      loanee_id: allLoanees[e.target.loanee.value],
      loan_start_date: toISO(e.target.loanDate.value),
      intended_return_date: toISO(e.target.returnDate.value)
    });
  }

  return (
    <>
      <Modal wrapClassName={"loan-form"} centered isOpen={props.modal} toggle={props.toggle}>
        <TextBkgBox>
          <h1>{props.newLoan ? "Loan Item" : "Edit Loan" }</h1>

          <form onSubmit={submitHandler} onChange={checkSubmittable} id="loanForm">
            <div className={"inline-flex"}>
              <h3>Loanee:</h3>
              <InputDropdown value={props.loaneeValue} required name="loanee"
                options={props.suggestedLoanees} selectOption={props.selectLoanee}
                deleteOption={props.deleteLoanee} changeOption={props.changeLoanee}
                placeholder={props.newLoan
                  ? "Enter existing loanee..."
                  : "(Optional) Change loanee..."}
              />
            </div>
            <div className={"inline-flex"}>
              <h3>Loan date:</h3>
              <input type="text" className={"input-box"} required
                value={props.lnDateValue} onChange={e => props.chgLnDate(e.target.value)}
                id="loanDate" name="loanDate"
                placeholder={props.newLoan
                  ? "Enter date..."
                  : "(Optional) Change loan date..."}
                onFocusCapture={e => {
                  props.chgLnDate(toISO(e.target.value));
                  e.target.type="date";
                }}
                onBlurCapture={e => {
                  e.target.type="text";
                  props.chgLnDate(toLocale(e.target.value));
                }}
              />
            </div>
            <div className={"inline-flex"}>
              <h3>Return by:</h3>
              <input type="text" className={"input-box"} required
                value={props.rtnDateValue} onChange={e => props.chgRtnDate(e.target.value)}
                id="returnDate" name="returnDate"
                placeholder={props.newLoan
                  ? "Enter date..."
                  : "(Optional) Change return date..."}
                onFocusCapture={e => {
                  props.chgRtnDate(toISO(e.target.value));
                  e.target.type="date";
                }}
                onBlurCapture={e => {
                  e.target.type="text";
                  props.chgRtnDate(toLocale(e.target.value));
                }}
              />
            </div>
            <div className={"btn-list"}>
              <TextButton altStyle type="button" onClick={props.toggle}>Cancel</TextButton>
              <TextButton disabled={!letSubmit} type="submit">Confirm</TextButton>
            </div>
          </form>
        </TextBkgBox>
      </Modal>
      <Submitting style={submitting ? {display: "flex"} : {display: "none"}} />
    </>
  );
};

export default LoanForm;
