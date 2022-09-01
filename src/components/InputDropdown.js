import React, { useState } from "react";
import "../styles/InputDropdown.scss"; // component scoped style
import { default as Deletable } from "./Deletable";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const InputDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown className={"input-dropdown"} isOpen={dropdownOpen} toggle={toggle} direction="down">
      <DropdownToggle caret>
        <input onKeyDown={(e) => {if (e.key === "Enter") e.preventDefault()}}
          placeholder={props.placeholder} value={props.value} onChange={props.changeOption}
          className={"input-box"} type="text" name={props.name}
        />
        <span>▾</span>
      </DropdownToggle>
      <DropdownMenu>
        {props.options.map((c) => { return <DropdownItem text key={c}>
          <Deletable
            selectOption={props.selectOption}
            deleteOption={props.deleteOption}
          >{c}</Deletable>
        </DropdownItem>})}
      </DropdownMenu>
    </Dropdown>
  );
};

export default InputDropdown;
