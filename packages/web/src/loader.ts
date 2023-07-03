export const getCapture = async (id: string) => {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/capture/${id}?preSigned=true`);
  const data = await response.json();
  return data;
}

export const captureLoader = async ({ params }: any) => {
  const capture = await getCapture(params.id);
  return { capture };
};