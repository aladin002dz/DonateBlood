import { faker } from '@faker-js/faker';
import type { DonorData } from '@/actions/search';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const donationTypes = ['Whole Blood', 'Plasma', 'Platelets'];

export function createTestDonor(overrides?: Partial<DonorData>): DonorData {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    bloodGroup: faker.helpers.arrayElement(bloodGroups),
    wilaya: faker.location.city(),
    daira: faker.location.county(),
    commune: faker.location.city(),
    donationType: faker.helpers.arrayElement(donationTypes),
    phone: faker.phone.number(),
    lastDonation: faker.date.past().toISOString(),
    emergencyAvailable: faker.datatype.boolean(),
    emailVerified: faker.datatype.boolean(),
    phoneVerified: faker.datatype.boolean(),
    ...overrides,
  };
}

export function createTestDonors(count: number, overrides?: Partial<DonorData>): DonorData[] {
  return Array.from({ length: count }, () => createTestDonor(overrides));
}

