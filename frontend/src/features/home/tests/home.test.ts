import { WelcomeStatsSchema } from '../validators/home.schema';

describe('Home Feature Contracts', () => {
  it('should validate the correct shape of welcome stats data', () => {
    const mockStats = {
      studentsGlobally: '500K+',
      expertTutors: '150+',
      rating: 4.9,
    };

    const result = WelcomeStatsSchema.safeParse(mockStats);
    expect(result.success).toBe(true);
  });

  it('should reject invalid welcome stats data', () => {
    const mockInvalidStats = {
      studentsGlobally: 500000, // should be string
      expertTutors: '150+',
      rating: 6.0, // rating must be <= 5
    };

    const result = WelcomeStatsSchema.safeParse(mockInvalidStats);
    expect(result.success).toBe(false);
  });
});
