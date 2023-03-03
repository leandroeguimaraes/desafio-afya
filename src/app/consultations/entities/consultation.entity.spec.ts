import { Consultation } from './consultation.entity';

describe('Consultation entity', () => {
  let consultation: Consultation;

  beforeEach(() => {
    consultation = new Consultation();
    consultation.id = 1;
    consultation.userId = 1;
    consultation.patientId = 1;
    consultation.scheduleId = 1;
    consultation.notes = 'Test notes';
    consultation.createdAt = new Date().toDateString();
    consultation.updatedAt = new Date().toDateString();
    consultation.deletedAt = null;
    consultation.schedule = null;
    consultation.patient = null;
    consultation.user = null;
  });

  describe('Properties', () => {
    it('should have an id property', () => {
      expect(consultation).toHaveProperty('id');
    });
    it('should have a userId property', () => {
      expect(consultation).toHaveProperty('userId');
    });

    it('should have a patientId property', () => {
      expect(consultation).toHaveProperty('patientId');
    });

    it('should have a scheduleId property', () => {
      expect(consultation).toHaveProperty('scheduleId');
    });

    it('should have a notes property', () => {
      expect(consultation).toHaveProperty('notes');
    });

    it('should have a createdAt property', () => {
      expect(consultation).toHaveProperty('createdAt');
    });

    it('should have an updatedAt property', () => {
      expect(consultation).toHaveProperty('updatedAt');
    });

    it('should have a deletedAt property', () => {
      expect(consultation).toHaveProperty('deletedAt');
    });

    it('should have a schedule property', () => {
      expect(consultation).toHaveProperty('schedule');
    });

    it('should have a patient property', () => {
      expect(consultation).toHaveProperty('patient');
    });

    it('should have a user property', () => {
      expect(consultation).toHaveProperty('user');
    });
  });
});
