import React, { useEffect, useState } from "react";
import "../styles/LoanForm.scss"; // component scoped style
import { TextButton, TextBkgBox, InputDropdown, Deletable } from "./";
import { Modal } from 'reactstrap';
import { toISO, toDDMMYYYY } from "../utils/helpers";
import { useMediaQuery } from "react-responsive";

const LoanForm = (props) => {
  const [letSubmit, setLetSubmit] = useState(false);
  const [nameWarn, setNameWarn] = useState("");
  const [dateWarn, setDateWarn] = useState(false);
  const [loaneeOpen, setLoaneeOpen] = useState(false);

  const isTablet = useMediaQuery({ maxDeviceWidth: 1080 });
  const isMobile = useMediaQuery({ maxDeviceWidth: 670 });

  // show/hide loanee input dropdown
  const loaneeShow = () => {
    setLoaneeOpen((prevState) => !prevState)
  };

  // check if all entries have been put, and that return date is after loan date
  const checkSubmittable = () => {
    const form = document.getElementById("loanForm");
    const lneName = form.loanee.value;
    const lnDate = form.loanDate.value;
    const rtnDate = form.returnDate.value;
    
    setLetSubmit(
      lneName !== "" && (lneName in props.allLoanees) &&
      lnDate !== "" && rtnDate !== "" && toISO(lnDate) <= toISO(rtnDate)
    );

    if (lneName !== "" && !(lneName in props.allLoanees)) {
      if (lneName === props.ownName) setNameWarn("You cannot loan to yourself!");
      else setNameWarn(`User "${lneName}" does not exist.`);
    }
    else setNameWarn("");

    setDateWarn(lnDate !== "" && rtnDate !== "" && !(toISO(lnDate) <= toISO(rtnDate)))
  }

  // submits loan form to parent (item detail page)
  const submitHandler = async (e) => {
    e.preventDefault();

    props.onSubmit({
      loanee_name: e.target.loanee.value,
      loanee_id: props.allLoanees[e.target.loanee.value],
      loan_start_date: toISO(e.target.loanDate.value),
      intended_return_date: toISO(e.target.returnDate.value)
    });
  }

  // checks submittable upon edit
  useEffect(() => setLetSubmit(!props.newLoan), [props.newLoan]);

  return (
    <>
      <Modal wrapClassName={"loan-form"} centered isOpen={props.modal}
        toggle={() => {props.toggle(); setNameWarn(""); setDateWarn(false);}}
      >
        <TextBkgBox className={isTablet ? isMobile ? "mobile" : "tablet" : ""}>
          <h1>{props.newLoan ? "Loan Item" : "Edit Loan" }</h1>

          <form onSubmit={submitHandler} id="loanForm" onChange={checkSubmittable}>
            <table><tbody>
              { isTablet
                ?
                  <>
                    <tr><td><h3>Loanee:</h3></td></tr>
                    <tr>
                      <td>
                        <InputDropdown dropdownOpen={loaneeOpen} toggle={loaneeShow}
                          required name="loanee" value={props.loaneeValue} className={isMobile ? "mobile" : ""}
                          placeholder="Enter existing loanee..." changeOption={props.changeLoanee}
                        >
                          {props.suggestedLoanees.map((c) => {
                            return <Deletable field="loanee" key={`opt-${c}`}
                              canDel={false} hideOption={props.deleteLoanee}
                              selectOption={(e) => { loaneeShow(); props.selectLoanee(e) }}
                            >
                              {c}
                            </Deletable>
                          })}
                        </InputDropdown>
                      </td>
                    </tr>

                    {nameWarn !== "" ? <tr><td><h4 className="warning">{nameWarn}</h4></td></tr>: null}

                    <tr><td><h3>Loan date:</h3></td></tr>
                    <tr>
                      <td><input type="text" className={"input-box"} required value={props.lnDateValue}
                          id="loanDate" name="loanDate" placeholder="Enter date..."
                          onChange={e => { props.chgLnDate(e.target.value); checkSubmittable(); }}
                          onFocusCapture={e => {
                            props.chgLnDate(toISO(e.target.value));
                            e.target.type="date";
                          }}
                          onBlurCapture={e => {
                            e.target.type="text";
                            props.chgLnDate(toDDMMYYYY(e.target.value));
                            checkSubmittable();
                          }}
                        /></td>
                    </tr>

                    <tr><td><h3>Return by:</h3></td></tr>
                    <tr>
                      <td>
                          <input type="text" className={"input-box"} required
                            value={props.rtnDateValue} onChange={e => props.chgRtnDate(e.target.value)}
                            id="returnDate" name="returnDate" placeholder="Enter date..."
                            onFocusCapture={e => {
                              props.chgRtnDate(toISO(e.target.value));
                              e.target.type="date";
                            }}
                            onBlurCapture={e => {
                              e.target.type="text";
                              props.chgRtnDate(toDDMMYYYY(e.target.value));
                              checkSubmittable();
                            }}
                          />
                        </td>
                    </tr>
                    {dateWarn ? <tr><td><h4 className="warning">Return date must be<br />on or after loan date.</h4></td></tr> : null}
                  </>

                :
                  <>
                    <tr>
                      <td><h3>Loanee:</h3></td>
                      <td>
                        <InputDropdown dropdownOpen={loaneeOpen} toggle={loaneeShow}
                          required name="loanee" value={props.loaneeValue}
                          placeholder="Enter existing loanee..." changeOption={props.changeLoanee}
                        >
                          {props.suggestedLoanees.map((c) => {
                            return <Deletable field="loanee" key={`opt-${c}`}
                              canDel={false} hideOption={props.deleteLoanee}
                              selectOption={async (e) => { loaneeShow(); await props.selectLoanee(e); checkSubmittable() }}
                            >
                              {c}
                            </Deletable>
                          })}
                        </InputDropdown>
                      </td>
                    </tr>
                    {nameWarn !== "" ? <tr><td colSpan={2}><h4 className="warning">{nameWarn}</h4></td></tr>: null}

                    <tr>
                      <td><h3>Loan date:</h3></td>
                      <td><input type="text" className={"input-box"} required value={props.lnDateValue}
                        id="loanDate" name="loanDate" placeholder="Enter date..."
                        onChange={e => { props.chgLnDate(e.target.value); checkSubmittable(); }}
                        onFocusCapture={e => {
                          props.chgLnDate(toISO(e.target.value));
                          e.target.type="date";
                        }}
                        onBlurCapture={e => {
                          e.target.type="text";
                          props.chgLnDate(toDDMMYYYY(e.target.value));
                          checkSubmittable();
                        }}
                      /></td>
                    </tr>

                    <tr>
                      <td><h3>Return by:</h3></td>
                      <td>
                        <input type="text" className={"input-box"} required
                          value={props.rtnDateValue} onChange={e => props.chgRtnDate(e.target.value)}
                          id="returnDate" name="returnDate" placeholder="Enter date..."
                          onFocusCapture={e => {
                            props.chgRtnDate(toISO(e.target.value));
                            e.target.type="date";
                          }}
                          onBlurCapture={e => {
                            e.target.type="text";
                            props.chgRtnDate(toDDMMYYYY(e.target.value));
                            checkSubmittable();
                          }}
                        />
                      </td>
                    </tr>
                    {dateWarn ? <tr><td colSpan={2}><h4 className="warning">Return date must be on or after loan date.</h4></td></tr> : null}
                </>
              }
            </tbody></table>
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
