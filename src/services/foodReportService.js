const API_URL = "http://canteen.benzyinfotech.com/api/v3/customer/report";
const TOKEN = import.meta.env.VITE_API_TOKEN;
console.log("Authorization Token:", TOKEN);

export const getFoodReport = async (month) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ month })
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Failed to fetch food report: ${errorDetails.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching food report:", error);
    throw error;
  }
};
