import React, { useEffect, useState } from "react";
import "../styles/LoanForm.scss"; // component scoped style
import { TextButton, TextBkgBox, InputDropdown } from "./";
import { Modal } from 'reactstrap';
import axios from "axios"; // eslint-disable-line no-unused-vars

const LoanForm = (props) => {
  const [today, setToday] = useState();
  const [loan, setLoan] = useState({
    loanee: "Enter loanee name...",
    loan_start_date: "Enter date loaned...",
    intended_return_date: "Enter date to return by..."
  });

  useEffect(() => setToday(new Date().toLocaleDateString()), []);

  useEffect(() => {
    if (!props.newLoan) setLoan({
      loanee: props.item.loanee,
      loan_start_date: props.item.loan_start_date,
      intended_return_date: props.item.intended_return_date
    });
  }, [props.item, props.newLoan]);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("form submitted");

    let fetchedLoanee = null;
    // if (props.loaneeValue !== "" && props.loaneeValue !== null) {
    //   await axios.get(
    //     `https://server-monkeys-backend-test.herokuapp.com/testingUser?display_name=${props.loaneeValue}`
    //     )
    //     .then((res) => fetchedLoanee = res.data)
    //     .catch((err) => console.log(err));
    //   if (fetchedLoanee === null || fetchedLoanee === []) {
    //     alert(`User ${props.loaneeValue} not found.`);
    //     return;
    //   }
    //   else (fetchedLoanee = fetchedLoanee[0]._id);
    // }

    // tester. TODO remove
    fetchedLoanee = "62ff5491723818548142d485";

    props.onSubmit({
      loanee_id: fetchedLoanee,
      loan_start_date: e.target.loanDate.value,
      intended_return_date: e.target.returnDate.value
    });
  }

  return (
    <Modal wrapClassName={"loan-form"} centered isOpen={props.modal} toggle={props.toggle}>
      <TextBkgBox>
        <h1>{props.newLoan ? "Loan Item" : "Edit Loan" }</h1>

        <form onSubmit={submitHandler}>
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
            <TextButton type="submit">Confirm</TextButton>
          </div>
        </form>
      </TextBkgBox>
    </Modal>
  );
};

export default LoanForm;
