import axios from 'axios';

export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number }> {
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GOOGLE_GEOCODING_API_KEY in .env');
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  const response = await axios.get(url);
  if (response.data.status !== 'OK') {
    console.error('Geocoding error response:', response.data);
    throw new Error('Could not geocode the provided address.');
  }

  const location = response.data.results[0].geometry.location;
  return {
    lat: location.lat,
    lng: location.lng,
  };
}
