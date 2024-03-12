import { Button } from "semantic-ui-react";
import "./incrementDecrementBtn.scss";
import PropTypes from "prop-types";

function IncrementDecrementBtn({ setCount, count }) {
  const handleDecrementCounter = () => {
    if (count > 0) {
      setCount((previousCount) => previousCount - 1);
    }
  };

  const handleIncrementCounter = () => {
    setCount((previousCount) => previousCount + 1);
  };

  return (
    <>
      <Button icon="minus" className="quantity-btn" onClick={handleDecrementCounter} />
      <span className="quantity__span">{count}</span>
      <Button icon="plus" className="quantity-btn" onClick={handleIncrementCounter} />
    </>
  );
}

IncrementDecrementBtn.propTypes = {
  setCount: PropTypes.func.isRequired, // setCount doit être une fonction et est obligatoire
  count: PropTypes.number.isRequired, // count doit être un nombre et est obligatoire
};

export default IncrementDecrementBtn;
