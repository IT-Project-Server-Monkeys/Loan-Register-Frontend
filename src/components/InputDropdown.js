import React, { useState } from "react";
import "../styles/InputDropdown.scss"; // component scoped style
import { default as Deletable } from "./Deletable";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const InputDropdown = (props) => {
  const [newVal, setNewVal] = useState("");
  const changeVal = (e) => setNewVal(e.target.value);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown className={"input-dropdown"} style={props.style} isOpen={dropdownOpen} toggle={toggle} direction="down">
      <DropdownToggle caret>
        <input
          placeholder={props.placeholder} value={newVal} onChange={changeVal}
          className={"input-box"} type="text"
        />
      </DropdownToggle>
      <DropdownMenu>
        {props.options.map((c) => { return <DropdownItem text key={c}>
          <Deletable
              selectOption={props.selectOption} deleteOption={props.deleteOption}
              >{c}
            </Deletable>
        </DropdownItem>})}
      </DropdownMenu>
    </Dropdown>
  );
};

export default InputDropdown;
