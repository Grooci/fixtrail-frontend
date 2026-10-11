const CLOUD_NAME = "yratqhmj";
const UPLOAD_PRESET = "fixtrail_requests"; // must match your preset name exactly

export async function uploadPhoto(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("Photo upload failed. Check the upload preset name.");

  const data = await res.json();
  return data.secure_url as string;
}