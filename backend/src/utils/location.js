// Utility functions for location-based calculations.

/**
 * Calculates the distance between two GPS coordinates in kilometers using the Haversine formula.
 * @param {number} lat1 Latitude of the first point.
 * @param {number} lon1 Longitude of the first point.
 * @param {number} lat2 Latitude of the second point.
 * @param {number} lon2 Longitude of the second point.
 * @returns {number} The distance in kilometers.
 */
function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * A simple wrapper function to get the distance in meters.
 * @param {object} coords1 - { latitude, longitude }
 * @param {object} coords2 - { latitude, longitude }
 * @returns {number} The distance in meters.
 */
function getDistanceInMeters(coords1, coords2) {
    if (!coords1 || !coords2) return Infinity;
    const distanceKm = getDistanceInKm(coords1.latitude, coords1.longitude, coords2.latitude, coords2.longitude);
    return distanceKm * 1000;
}

module.exports = {
  getDistanceInMeters,
};
