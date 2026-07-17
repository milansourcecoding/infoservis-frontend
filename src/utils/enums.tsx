export const StatusDokumenta = {
  None: 0,
  Processing: 1,
  Zavrsen: 2,
  Storniran: 3
}

export const UpravnikType = {
  None: 0,
  DomaceLice: 1,
  ProfesionalniUpravnik: 2
}

export const NacinPlacanja = {
  None: 0,
  Virmanski: 1,
  Gotovina: 2,
  Avansno: 3
}

export const RemoveAction = {
  Delete: 0,
  Activate: 1,
  Deactivate: 2,
  Storniraj: 3
}

export const RoleType = {
  Resident: 'resident',
  Manager: 'manager',
  OrganizationAdmin: 'organization_admin',
  Worker: 'worker',
  Technician: 'technician',
  Cleaner: 'cleaner',
  Accountant: 'accountant',
  SuperAdmin: 'super_admin',
}

export const ManagerType = {
  ProfessionalManager: 'professional_manager',
  ResidentManager: 'resident_manager'
}

export const UnitType = {
     Apartment: 'apartment',
     Basement: 'basement',
     Attic: 'attic',
     Commercial: 'commercial',
     Garage: 'garage',
     Office: 'office',
     Storage: 'storage',
     Common: 'common',
     BoilerRoom: 'boiler_room',
     LaundryRoom: 'laundry_room',
     SecurityRoom: 'security_room',
     TechnicalRoom: 'technical_room',
     ParkingSpace: 'parking_space',
     Other: 'other'
}