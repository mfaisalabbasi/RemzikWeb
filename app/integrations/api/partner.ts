import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Uploads Business Documents to the backend.
 * Path: /partners/verify-business
 */
export const uploadBusinessDocs = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${API_URL}/partners/verify-business`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Business Doc Upload Error:",
      error.response?.data || error.message,
    );
    throw (
      error.response?.data || new Error("Failed to upload business documents")
    );
  }
};

/**
 * Fetches the current business profile status
 * Path: /partners/business-profile
 */
export const getBusinessProfileStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/partners/business-profile`, {
      withCredentials: true,
    });
    return response.data; // Expected: { status, hasCr, hasTax }
  } catch (error) {
    console.error("Status fetch error:", error);
    return { status: "UNVERIFIED" };
  }
};
