/**
 * Service to fetch user configurations, stats, or logs for the platform home screen.
 */
export const homeService = {
  async getWelcomeStats() {
    // Mock API response mimicking future real backend call
    return {
      success: true,
      data: {
        studentsGlobally: '500K+',
        expertTutors: '150+',
        rating: 4.9,
      },
    };
  },
};
