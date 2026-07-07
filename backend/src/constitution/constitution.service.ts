import * as constitutionRepo from './constitution.repository.js';

export async function listConstitutions() {
  return constitutionRepo.getAllConstitutions();
}

export async function getPlayerConstitution(playerId: string) {
  return constitutionRepo.getPlayerConstitution(playerId);
}

export async function chooseConstitution(playerId: string, constitutionId: number) {
  const constitution = await constitutionRepo.getConstitutionById(constitutionId);
  if (!constitution) {
    throw new Error('Constitution not found');
  }
  // Can only choose once — if already set, reject
  const existing = await constitutionRepo.getPlayerConstitution(playerId);
  if (existing !== null) {
    throw new Error('Constitution already chosen');
  }
  await constitutionRepo.setPlayerConstitution(playerId, constitutionId);
  return constitution;
}
