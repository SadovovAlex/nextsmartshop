interface Amount {
  amount: number;
}

const FormattedPrice = ({ amount }: Amount) => {
  const formattedAmount = new Number(amount).toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  });
  return <span>{formattedAmount}</span>;
};


export default FormattedPrice;
