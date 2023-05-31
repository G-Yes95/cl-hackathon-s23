export default function formatAccounting(number) {
  // Check if the number is a valid float
  if (isNaN(number) || !isFinite(number)) {
    return "Invalid number";
  }

  // Convert the number to accounting format
  const formattedNumber = number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return '$' + formattedNumber;
}