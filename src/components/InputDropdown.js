import React from "react";
import "../styles/InputDropdown.scss"; // component scoped style
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

// an input with custom suggestions as a dropdown menu
const InputDropdown = (props) => {

  return (
    <Dropdown className={`input-dropdown ${props.className != null ? props.className : ""}`} toggle={props.toggle}
      isOpen={props.dropdownOpen && props.children.length !== 0} direction="down">
      <DropdownToggle caret>
        <input onKeyDown={(e) => {if (e.key === "Enter") e.preventDefault()}}
          placeholder={props.placeholder} value={props.value}
          onChange={(e) => props.changeOption(e)}
          type="text" name={props.name} required={props.required} autoComplete="off"
        />
        <span>▾</span>
      </DropdownToggle>
      <DropdownMenu modifiers={ [
        { name: "eventListeners", options: { scroll: false } },
        { name: "preventOverflow", options: { mainAxis: false } }
      ] }>
        {props.children.map((d) => { return <DropdownItem
          text key={`drop-${d.key}`}>
            {d}
          </DropdownItem>
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default InputDropdown;
