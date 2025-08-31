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

export const prepareIncomeBarChartData = (data) => {
  const incomeArray = Array.isArray(data) ? data : [];

  // Group by date
  const grouped = incomeArray.reduce((acc, item) => {
    const day = moment(item.date).format("YYYY-MM-DD"); // stable key for grouping
    if (!acc[day]) {
      acc[day] = { ...item, amount: 0 };
    }
    acc[day].amount += item.amount;
    return acc;
  }, {});

  // Convert grouped data back into array and sort by date
  const sortedData = Object.values(grouped).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Final format
  return sortedData.map((item) => ({
    month: moment(item.date).format("Do MMM"), // keep same formatting
    amount: item.amount,
    source: item.source, // if multiple sources in same day → last one kept
  }));
};


export const prepareExpenseLineChartData = (data = []) => {
  // Group by date
  const grouped = data.reduce((acc, item) => {
    const day = moment(item.date).format("YYYY-MM-DD"); // stable key for grouping
    if (!acc[day]) {
      acc[day] = { ...item, amount: 0 };
    }
    acc[day].amount += item.amount;
    return acc;
  }, {});

  // Convert grouped data back into array and sort by date
  const sortedData = Object.values(grouped).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Final format
  const chartData = sortedData.map((item) => ({
    month: moment(item.date).format("Do MMM"), // keep your format
    amount: item.amount,
    category: item.category, // optional, will just keep last category of that day
  }));

  return chartData;
};
