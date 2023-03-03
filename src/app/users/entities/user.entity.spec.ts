import { User } from './user.entity';
import { EnumRole } from '../enum/roles.enum';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.id = 1;
    user.name = 'Doctor';
    user.email = 'doctor@gmail.com';
    user.password = '!Teste123';
    user.role = EnumRole.DOCTOR;
    user.createdAt = new Date().toDateString();
    user.updatedAt = new Date().toDateString();
    user.deletedAt = null;
    user.patients = null;
  });

  describe('Properties', () => {
    it('should have an id property', () => {
      expect(user).toHaveProperty('id');
    });

    it('should have a name property', () => {
      expect(user).toHaveProperty('name');
    });

    it('should have an email property', () => {
      expect(user).toHaveProperty('email');
    });

    it('should have a password property', () => {
      expect(user).toHaveProperty('password');
    });

    it('should have a role property', () => {
      expect(user).toHaveProperty('role');
    });

    it('should have a createdAt property', () => {
      expect(user).toHaveProperty('createdAt');
    });

    it('should have an updatedAt property', () => {
      expect(user).toHaveProperty('updatedAt');
    });

    it('should have a deletedAt property', () => {
      expect(user).toHaveProperty('deletedAt');
    });

    it('should have a patients property', () => {
      expect(user).toHaveProperty('patients');
    });
  });

  describe('Values', () => {
    it('should have default role as DOCTOR', () => {
      expect(user.role).toBe(EnumRole.DOCTOR);
    });
  });
});
