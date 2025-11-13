import { faker } from '@faker-js/faker';

export interface TestUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  bloodGroup: string;
  wilaya: string;
  daira: string;
  commune: string;
  lastDonation?: string;
  donationType: string;
  emergencyAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const donationTypes = ['Whole Blood', 'Plasma', 'Platelets'];

export function createTestUser(overrides?: Partial<TestUser>): TestUser {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    emailVerified: faker.datatype.boolean(),
    phoneVerified: faker.datatype.boolean(),
    bloodGroup: faker.helpers.arrayElement(bloodGroups),
    wilaya: faker.location.city(),
    daira: faker.location.county(),
    commune: faker.location.city(),
    lastDonation: faker.date.past().toISOString(),
    donationType: faker.helpers.arrayElement(donationTypes),
    emergencyAvailable: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}

export function createTestUserFormData(overrides?: Partial<TestUser>): FormData {
  const user = createTestUser(overrides);
  const formData = new FormData();
  
  formData.append('fullName', user.name);
  formData.append('email', user.email);
  formData.append('phone', user.phone);
  formData.append('password', 'password123');
  formData.append('confirmPassword', 'password123');
  formData.append('bloodGroup', user.bloodGroup);
  formData.append('wilaya', user.wilaya);
  formData.append('daira', user.daira);
  formData.append('commune', user.commune);
  formData.append('donationType', user.donationType);
  formData.append('emergencyAvailable', user.emergencyAvailable ? 'on' : 'off');
  
  if (user.lastDonation) {
    formData.append('lastDonation', user.lastDonation);
  }
  
  return formData;
}

