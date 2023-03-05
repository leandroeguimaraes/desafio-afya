import { Schedule } from './schedule.entity';

describe('Schedule entity', () => {
  let schedule: Schedule;

  beforeEach(() => {
    schedule = new Schedule();
    schedule.id = 1;
    schedule.userId = 1;
    schedule.patientId = 1;
    schedule.date = new Date('2000-01-01');
    schedule.createdAt = new Date();
    schedule.updatedAt = new Date();
    schedule.deletedAt = null;
    schedule.patient = null;
    schedule.user = null;
  });

  describe('Properties', () => {
    it('should have an id property', () => {
      expect(schedule).toHaveProperty('id');
    });
    it('should have a userId property', () => {
      expect(schedule).toHaveProperty('userId');
    });
    it('should have a patientId property', () => {
      expect(schedule).toHaveProperty('patientId');
    });

    it('should have a date property', () => {
      expect(schedule).toHaveProperty('date');
    });

    it('should have a createdAt property', () => {
      expect(schedule).toHaveProperty('createdAt');
    });

    it('should have an updatedAt property', () => {
      expect(schedule).toHaveProperty('updatedAt');
    });

    it('should have a deletedAt property', () => {
      expect(schedule).toHaveProperty('deletedAt');
    });

    it('should have a patient property', () => {
      expect(schedule).toHaveProperty('patient');
    });

    it('should have a user property', () => {
      expect(schedule).toHaveProperty('user');
    });
  });
});
