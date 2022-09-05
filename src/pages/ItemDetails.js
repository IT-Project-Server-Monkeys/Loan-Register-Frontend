import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/ItemPage.scss'
import { LoanForm, TextButton, Loading } from '../components';
import { MdEdit } from 'react-icons/md';
import { fetchItem } from "../utils/itemHelpers";
import { fetchLoan, createLoan, editLoan, returnLoan } from "../utils/loanHelpers";

const ItemDetails = (props) => {
  const itemId = useParams().id;
  const [item, setItem] = useState({
    being_loaned: false, item_name: <Loading />,
    category: <Loading />, description: <Loading />
  });

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [loanee, setLoanee] = useState("");
  const [suggestedLoanees, setSuggestedLoanees] = useState(["placeholder", "loanee", "suggestions"]);
  const selectLoanee = (ln) => setLoanee(ln);
  const deleteLoanee = (ln) => setSuggestedLoanees((prev) => prev.filter((lns) => lns !== ln));
  const changeLoanee = (e) => setLoanee(e.target.value);

  const handleCrtLn = (input) => createLoan(input, props.loginSession.userId);
  const handleEdtLn = (input) => editLoan(item, input);
  const handleRtnLn = () => returnLoan(item);

  // get and show item data
  useEffect(() => {
    fetchItem(itemId, setItem, {
      loanee: <Loading />,
      loan_start_date: <Loading />,
      intended_return_date: <Loading />
    });
  }, [itemId]);

  // get and shows loan information
  useEffect (() => {
    if (item.being_loaned) fetchLoan(itemId, setItem);
  }, [itemId, item.being_loaned])

  return (
    <div className={"item-page"}>

      <a href={`/item-details/${itemId}/edit`}><button className={"edit-item icon-blue"}>
        <MdEdit size={40} />
      </button></a>
      
      <div className={"item-details"}>

        <div className={"item-image"} style={{backgroundImage: "url('https://picsum.photos/400/400')" }} />
        
        <p className={"item-status"}>Status: {item.being_loaned ? "On Loan" : "Available"}</p>
        <div className={"item-info"}>
          <table><tbody>
            <tr>
              <td>Name:</td><td>{item.item_name}</td>
            </tr>
            <tr>
              <td>Category:</td><td>{item.category}</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
            </tr>
            { item.being_loaned ? <>
              <tr>
                <td>Loanee:</td><td>{item.loanee}</td>
              </tr>
              <tr>
                <td>Date loaned:</td><td>{item.loan_start_date}</td>
              </tr>
              <tr>
                <td>Expected return:</td><td>{item.intended_return_date}</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
            </> : null}
            </tbody></table>
          <p>Description:<br />{item.description}</p>
        </div>
      </div>

      <div className={"btn-list"}>
        <a href="/history"><TextButton>History</TextButton></a>
        {item.being_loaned ? <>
          <TextButton onClick={toggle}>Edit Loan</TextButton>
          <TextButton onClick={handleRtnLn}>{"Mark Return"}</TextButton>
        </> :
          <TextButton onClick={toggle}>Loan Item</TextButton>
        }
      </div>

      <LoanForm modal={modal} toggle={toggle} item={item}
        newLoan={!item.being_loaned} loaneeValue={loanee}
        onSubmit={item.being_loaned ? handleEdtLn : handleCrtLn}
        suggestedLoanees={suggestedLoanees} changeLoanee={changeLoanee}
        selectLoanee={selectLoanee} deleteLoanee={deleteLoanee}
      />

    </div>
  );
};

export default ItemDetails;
