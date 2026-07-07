import * as guRepo from './gu.repository.js';
import type { GuTemplate, PlayerGu, GuSynergy } from '@co-dao/shared';
import { playerRepository } from '../player/player.repository.js';

// ── Template ──
export async function getAllTemplates(): Promise<GuTemplate[]> {
  return guRepo.getAllGuTemplates();
}

export async function getTemplateById(id: string): Promise<GuTemplate | null> {
  return guRepo.getGuTemplateById(id);
}

// ── Player Gu ──
export async function getPlayerGuList(playerId: string): Promise<PlayerGu[]> {
  const playerGuList = await guRepo.getPlayerGuList(playerId);

  return Promise.all(
    playerGuList.map(async (pgu) => {
      const template = await guRepo.getGuTemplateById(pgu.guTemplateId);
      const stats = await guRepo.getGuStats(pgu.guTemplateId);
      const skills = await guRepo.getGuSkills(pgu.guTemplateId);
      return {
        ...pgu,
        guTemplate: template ?? undefined,
        stats: stats ?? undefined,
        skills,
      };
    }),
  );
}

export async function equipGu(
  playerId: string,
  playerGuId: string,
  slotIndex: number,
  _maxSlots: number,
): Promise<{ success: boolean; code?: string; message?: string }> {
  const pgu = await guRepo.getPlayerGuById(playerGuId);
  if (!pgu || pgu.playerId !== playerId) {
    return { success: false, code: 'GU_NOT_FOUND', message: 'Cổ Trùng không tồn tại' };
  }

  const player = await playerRepository.findById(playerId);
  if (!player) {
    return { success: false, code: 'PLAYER_NOT_FOUND', message: 'Người chơi không tồn tại' };
  }

  const maxSlots = player.realm;

  if (slotIndex < 0 || slotIndex >= maxSlots) {
    return { success: false, code: 'GU_SLOT_FULL', message: `Số ô trang bị tối đa cho ${player.realm} Chuyển là ${maxSlots}` };
  }

  // Check if the Gu is already equipped
  if (pgu.isEquipped === 'true') {
    return { success: false, code: 'GU_ALREADY_EQUIPPED', message: 'Cổ Trùng này đã được trang bị' };
  }

  // Check realm requirement
  const template = await guRepo.getGuTemplateById(pgu.guTemplateId);
  if (template && template.rank > player.realm) {
    return { success: false, code: 'REALM_TOO_LOW', message: `Yêu cầu cảnh giới đạt ${template.rank} Chuyển mới có thể trang bị Cổ Trùng ${template.name}` };
  }

  await guRepo.equipPlayerGu(playerGuId, slotIndex);
  return { success: true };
}

export async function unequipGu(playerId: string, playerGuId: string): Promise<{ success: boolean; code?: string; message?: string }> {
  const pgu = await guRepo.getPlayerGuById(playerGuId);
  if (!pgu || pgu.playerId !== playerId) {
    return { success: false, code: 'GU_NOT_FOUND', message: 'Cổ Trùng không tồn tại' };
  }

  if (pgu.isEquipped !== 'true') {
    return { success: false, code: 'GU_NOT_EQUIPPED', message: 'Cổ Trùng này chưa được trang bị' };
  }

  await guRepo.unequipPlayerGu(playerGuId);
  return { success: true };
}

export async function enhanceGu(
  playerId: string,
  playerGuId: string,
): Promise<{ success: boolean; code?: string; message?: string; newEnhancement?: number }> {
  const pgu = await guRepo.getPlayerGuById(playerGuId);
  if (!pgu || pgu.playerId !== playerId) {
    return { success: false, code: 'GU_NOT_FOUND', message: 'Cổ Trùng không tồn tại' };
  }

  const template = await guRepo.getGuTemplateById(pgu.guTemplateId);
  const maxEnhance = template?.maxEnhance ?? 20;

  if (pgu.enhancement >= maxEnhance) {
    return { success: false, code: 'MAX_ENHANCE', message: `Đã đạt cường hóa tối đa (+${maxEnhance})` };
  }

  const newEnhancement = pgu.enhancement + 1;
  await guRepo.enhancePlayerGu(playerGuId, newEnhancement);

  return { success: true, newEnhancement };
}

export async function getEquippedSynergies(playerId: string): Promise<GuSynergy[]> {
  const playerGuList = await guRepo.getPlayerGuList(playerId);
  const equippedIds = playerGuList
    .filter((pgu) => pgu.isEquipped === 'true')
    .map((pgu) => pgu.guTemplateId);

  if (equippedIds.length < 2) {
    return [];
  }

  const allSynergies = await guRepo.getAllSynergies();
  return allSynergies.filter(
    (syn) => equippedIds.includes(syn.guA) && equippedIds.includes(syn.guB),
  );
}
