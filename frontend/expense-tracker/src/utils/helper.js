import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if(!name) return "";

  const words = name.split(" ");
  let initials = "";
  
  for(let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};

export const AddThousandsSeparator = (num) => {
  if(num === null || isNaN(num)) return "";
  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fractionalPart ? `${formattedIntegerPart}.${fractionalPart}` : formattedIntegerPart;
};

// export const prepareExpenseBarChartData = (data = []) => {
//   const chartData = data.map((item) => ({
//     category: item?.category,
//     amount: item?.amount,
//   }));

//   return chartData;
// };
export const prepareExpenseBarChartData = (data = []) => {
  if (!Array.isArray(data)) return [];

  const today = moment();
  const last30 = today.clone().subtract(30, "days");

  // 1. Filter last 30 days only
  const filtered = data.filter(item => {
    const date = moment(item.date);
    return date.isValid() && date.isBetween(last30, today, "day", "[]");
  });

  // 2. Group by category
  const grouped = {};
  filtered.forEach(item => {
    const category = item.category || "Other";
    grouped[category] = (grouped[category] || 0) + item.amount;
  });

  // 3. Convert to array for recharts
  return Object.keys(grouped).map(category => ({
    category,      // 👈 X-axis label
    amount: grouped[category],
  }));
};


// export const prepareIncomeBarChartData = (data = []) => {
//   const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

//   const chartData = sortedData.map((item) => ({
//     month: moment(item?.date).format("Do MMM"),
//     amount: item?.amount,
//     source: item?.source,
//   }));

//   return chartData;
// };

export const prepareIncomeBarChartData = (data) => {
  const incomeArray = Array.isArray(data) ? data : [];

  const sortedData = [...incomeArray].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount,
    source: item?.source,
  }));
};
