import React, { useEffect, useState } from "react";
import "../styles/LoanForm.scss"; // component scoped style
import { TextButton, TextBkgBox, InputDropdown } from "./";
import { Modal } from 'reactstrap';
import { fetchAllLoanees } from "../utils/loanHelpers";

const LoanForm = (props) => {
  const [letSubmit, setLetSubmit] = useState(false);
  const [today, setToday] = useState();
  const [allLoanees, setAllLoanees] = useState([]);
  const [loan, setLoan] = useState({
    loanee: "Enter an existing user...",
    loan_start_date: "Enter date loaned...",
    intended_return_date: "Enter date to return by..."
  });

  useEffect(() => {
    setToday(new Date().toLocaleDateString());
    fetchAllLoanees(setAllLoanees);
  }, []);

  useEffect(() => {
    if (!props.newLoan) setLoan({
      loanee: props.item.loanee,
      loan_start_date: props.item.loan_start_date,
      intended_return_date: props.item.intended_return_date
    });
  }, [props.item, props.newLoan]);

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

    props.onSubmit({
      loanee_id: allLoanees[e.target.loanee.value],
      loan_start_date: e.target.loanDate.value,
      intended_return_date: e.target.returnDate.value
    });
  }

  return (
    <Modal wrapClassName={"loan-form"} centered isOpen={props.modal} toggle={props.toggle}>
      <TextBkgBox>
        <h1>{props.newLoan ? "Loan Item" : "Edit Loan" }</h1>

        <form onSubmit={submitHandler} onChange={checkSubmittable} id="loanForm">
          <div className={"inline-flex"}>
            <h3>Loanee:</h3>
            <InputDropdown value={props.loaneeValue} placeholder={loan.loanee}
              options={props.suggestedLoanees} selectOption={props.selectLoanee}
              deleteOption={props.deleteLoanee} changeOption={props.changeLoanee}
              required={props.newLoan} name="loanee"
            />
          </div>
          <div className={"inline-flex"}>
            <h3>Loan date:</h3>
            <input type="text" className={"input-box"}
            onFocusCapture={e => e.target.type="date"} onBlurCapture={e => e.target.type="text"}
              id="loanDate" name="loanDate" placeholder={props.newLoan ? today : loan.loan_start_date}
            />
          </div>
          <div className={"inline-flex"}>
            <h3>Return by:</h3>
            <input type="text" className={"input-box"} required={props.newLoan}
            onFocusCapture={e => e.target.type="date"} onBlurCapture={e => e.target.type="text"}
              id="returnDate" name="returnDate" placeholder={loan.intended_return_date}
            />
          </div>
          <div className={"btn-list"}>
            <TextButton altStyle type="button" onClick={props.toggle}>Cancel</TextButton>
            <TextButton disabled={!letSubmit} type="submit">Confirm</TextButton>
          </div>
        </form>
      </TextBkgBox>
    </Modal>
  );
};

export default LoanForm;
