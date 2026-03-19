export const getProfile = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/partners/profile`,
    { credentials: "include" },
  );

  if (!res.ok) throw new Error("Failed profile");

  return res.json();
};

export const updateProfile = async (data: any) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/partners/profile`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) throw new Error("Update failed");

  return res.json();
};

export const getProfileStats = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/partners/profile/stats`,
    { credentials: "include" },
  );

  if (!res.ok) throw new Error("Failed stats");

  return res.json();
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/partners/profile/avatar`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
  );

  if (!res.ok) throw new Error("Avatar upload failed");

  return res.json();
};
