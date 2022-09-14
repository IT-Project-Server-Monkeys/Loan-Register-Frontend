import React, { useEffect, useState } from "react";
import "../styles/LoanForm.scss"; // component scoped style
import { TextButton, TextBkgBox, InputDropdown, Deletable } from "./";
import { Modal } from 'reactstrap';
import { fetchAllLoanees } from "../utils/loanHelpers";

const toLocale = (dateString) => {
  if (!dateString.includes("-")) return "";
  return (new Date(Date.parse(dateString))).toLocaleDateString();
}

// assume locale DD/MM/YYYY format
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

  const [loaneeOpen, setLoaneeOpen] = useState(false);
  const loaneeShow = () => {
    setLoaneeOpen((prevState) => !prevState)
  };

  useEffect(() => {
    fetchAllLoanees(setAllLoanees);
  }, []);

  useEffect(() => setLetSubmit(!props.newLoan), [props.newLoan]);

  const checkSubmittable = (e) => {
    let form = document.getElementById("loanForm");
    
    toISO(form.loanDate.value) !== "" && (form.returnDate.min = toISO(form.loanDate.value));
    if (toISO(form.returnDate.value) < toISO(form.loanDate.value))
      props.chgRtnDate("");

    setLetSubmit(
      form.loanee.value in allLoanees
      && form.loanDate.value !== ""
      && form.returnDate.value !== ""
    );
  }

  const submitHandler = async (e) => {
    e.preventDefault();

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
              <InputDropdown dropdownOpen={loaneeOpen} toggle={loaneeShow}
                required name="loanee" value={props.loaneeValue} 
                placeholder="Enter existing loanee..." changeOption={props.changeLoanee}
              >
                {props.suggestedLoanees.map((c) => {
                  return <Deletable field="loanee" key={`opt-${c}`}
                    canDel={false} hideOption={props.deleteLoanee}
                    selectOption={(e) => {loaneeShow(); props.selectLoanee(e)}}
                  >
                    {c}
                  </Deletable>
                })}
              </InputDropdown>
            </div>
            <div className={"inline-flex"}>
              <h3>Loan date:</h3>
              <input type="text" className={"input-box"} required
                value={props.lnDateValue} onChange={e => props.chgLnDate(e.target.value)}
                id="loanDate" name="loanDate" placeholder="Enter date..."
                onFocusCapture={e => {
                  props.chgLnDate(toISO(e.target.value));
                  e.target.type="date";
                }}
                onKeyDownCapture={e => e.target.blur()}
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
                id="returnDate" name="returnDate" placeholder="Enter date..."
                onFocusCapture={e => {
                  props.chgRtnDate(toISO(e.target.value));
                  e.target.type="date";
                }}
                onKeyDownCapture={e => e.target.blur()}
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
    </>
  );
};

export default LoanForm;
