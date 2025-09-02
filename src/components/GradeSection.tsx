export async function getGrades() {

  const token = import.meta.env.VITE_REACT_APP_API_TOKEN;
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  try {
    const response = await fetch(apiUrl + "/Grades/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    
    if (!response.ok) {
      console.error(response);
      throw new Error("Failed to fetch grades. Please try again.");
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("An error occurred while getting grades:", error);
    alert("An error occurred. Please check the console for details.");
  }
};

