import { ClassroomService } from '../services/classroomService';

describe('Integration Services — Classroom', () => {
  it('should validate explanation response formats properly', () => {
    const mockResponse = {
      topic: 'Kinematics',
      language: 'en',
      diagram_type: 'projectile',
      phases: [
        {
          phase: 0,
          name: 'start',
          speak: 'Let us start.',
          key_point: 'Start key point',
          teacher_position: 'left',
          diagram_action: 'show_initial',
        },
      ],
    };

    const validated = ClassroomService.validateExplanation(mockResponse);
    expect(validated.topic).toBe('Kinematics');
    expect(validated.diagram_type).toBe('projectile');
    expect(validated.phases).toHaveLength(1);
    expect(validated.phases[0].speak).toBe('Let us start.');
  });

  it('should handle validation overrides for fallback formats', () => {
    const invalidResponse = {
      topic: 'Kinematics',
      // Missing diagram_type and phases list
    };

    const validated = ClassroomService.validateExplanation(invalidResponse);
    // Should fallback to parsing properties gracefully
    expect(validated.topic).toBe('Kinematics');
  });
});
