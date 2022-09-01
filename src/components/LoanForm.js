import React, { useEffect, useState } from "react";
import "../styles/LoanForm.scss"; // component scoped style
import { TextButton, TextBkgBox, InputDropdown } from "./";
import { Modal } from 'reactstrap';

const LoanForm = (props) => {
  const [loan, setLoan] = useState({
    loanee: "Enter loanee name...",
    loan_start_date: "Enter date loaned...",
    intended_return_date: "Enter date to return by..."
  });

  useEffect(() => {
    if (!props.newLoan) setLoan({
      loanee: props.item.loanee,
      loan_start_date: props.item.loan_start_date,
      intended_return_date: props.item.intended_return_date
    });
  }, [props.item, props.newLoan]);

  return (
    <Modal wrapClassName={"loan-form"} centered isOpen={props.modal} toggle={props.toggle}>
      <TextBkgBox>
        <h1>{props.newLoan ? "Loan Item" : "Edit Loan" }</h1>

        <div className={"inline-flex"}>
          <h3>Loanee:</h3>
          <InputDropdown value={props.loaneeValue} placeholder={loan.loanee}
            options={props.suggestedLoanees}
            selectOption={props.selectLoanee}
            deleteOption={props.deleteLoanee}
            changeOption={props.changeLoanee}
          />
        </div>
        <div className={"inline-flex"}>
          <h3>Loan date:</h3>
          <input type="text" className={"input-box"}
          onFocusCapture={e => e.target.type="date"} onBlurCapture={e => e.target.type="text"}
            id="loanDate" name="loanDate" placeholder={loan.loan_start_date}
          />
        </div>
        <div className={"inline-flex"}>
          <h3>Return by:</h3>
          <input type="text" className={"input-box"}
          onFocusCapture={e => e.target.type="date"} onBlurCapture={e => e.target.type="text"}
            id="returnDate" name="returnDate" placeholder={loan.intended_return_date}
          />
        </div>
        <div className={"btn-list"}>
          <TextButton altStyle onClick={props.toggle}>Cancel</TextButton>
          <TextButton>Confirm</TextButton>
        </div>
      </TextBkgBox>
    </Modal>
  );
};

export default LoanForm;
