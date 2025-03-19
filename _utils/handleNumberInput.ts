export const handleNumberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  setter: (value: number | "") => void,
  type = "float"
) => {
  const value = e.target.value;
  if (value === "") {
    setter("");
  } else {
    const number = type === "float" ? parseFloat(value) : parseInt(value);
    if (!isNaN(number) && number >= 0) {
      setter(number);
    }
  }
};
