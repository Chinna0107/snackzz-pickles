const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function uploadToCloudinary(
  file: File,
  folder: "snackzee/products" | "snackzee/banners" = "snackzee/products"
): Promise<{ url: string; public_id: string }> {
  const token = localStorage.getItem("snackzee_token");
  const folderParam = folder === "snackzee/banners" ? "banners" : "products";

  // Step 1: get signature from backend (tiny JSON, no file)
  const sigRes = await fetch(`${BACKEND_URL}/upload/sign?folder=${folderParam}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!sigRes.ok) throw new Error("Could not get upload signature");
  const { signature, timestamp, api_key, cloud_name, folder: signedFolder } = await sigRes.json();

  // Step 2: upload directly from browser to Cloudinary using the signature
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", signedFolder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Cloudinary upload failed (${uploadRes.status})`);
  }

  const data = await uploadRes.json();
  return { url: data.secure_url, public_id: data.public_id };
}
