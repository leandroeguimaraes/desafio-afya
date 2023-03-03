import { Patient } from './patient.entity';

describe('Patient entity', () => {
  let patient: Patient;

  beforeEach(() => {
    patient = new Patient();
    patient.id = 1;
    patient.name = 'John Doe';
    patient.email = 'johndoe@example.com';
    patient.phone = '1123456789';
    patient.birthDate = new Date('2000-01-01');
    patient.gender = 'Masculino';
    patient.height = 1.75;
    patient.weight = 70.5;
    patient.createdAt = new Date().toDateString();
    patient.updatedAt = new Date().toDateString();
    patient.deletedAt = null;
    patient.user = null;
  });

  describe('Properties', () => {
    it('should have an id property', () => {
      expect(patient).toHaveProperty('id');
    });
    it('should have a name property', () => {
      expect(patient).toHaveProperty('name');
    });

    it('should have an email property', () => {
      expect(patient).toHaveProperty('email');
    });

    it('should have a phone property', () => {
      expect(patient).toHaveProperty('phone');
    });

    it('should have a birthDate property', () => {
      expect(patient).toHaveProperty('birthDate');
    });

    it('should have a gender property', () => {
      expect(patient).toHaveProperty('gender');
    });

    it('should have a height property', () => {
      expect(patient).toHaveProperty('height');
    });

    it('should have a weight property', () => {
      expect(patient).toHaveProperty('weight');
    });

    it('should have a createdAt property', () => {
      expect(patient).toHaveProperty('createdAt');
    });

    it('should have an updatedAt property', () => {
      expect(patient).toHaveProperty('updatedAt');
    });

    it('should have a deletedAt property', () => {
      expect(patient).toHaveProperty('deletedAt');
    });

    it('should have a user property', () => {
      expect(patient).toHaveProperty('user');
    });
  });
});
