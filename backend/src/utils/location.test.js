const { getDistanceInMeters } = require('./location');

describe('getDistanceInMeters', () => {
  it('should return 0 for the same coordinates', () => {
    const coords1 = { latitude: 13.746864, longitude: 100.535235 };
    const coords2 = { latitude: 13.746864, longitude: 100.535235 };
    expect(getDistanceInMeters(coords1, coords2)).toBe(0);
  });

  it('should return a non-zero value for different coordinates', () => {
    // A point roughly 1km away
    const coords1 = { latitude: 13.746864, longitude: 100.535235 }; // CP Tower
    const coords2 = { latitude: 13.7451, longitude: 100.5269 };   // MBK Center
    const distance = getDistanceInMeters(coords1, coords2);
    expect(distance).toBeGreaterThan(900); // Roughly 930m
    expect(distance).toBeLessThan(1000);
  });

  it('should handle null or undefined inputs gracefully', () => {
    const coords1 = { latitude: 13.746864, longitude: 100.535235 };
    expect(getDistanceInMeters(coords1, null)).toBe(Infinity);
    expect(getDistanceInMeters(undefined, coords1)).toBe(Infinity);
  });
});
