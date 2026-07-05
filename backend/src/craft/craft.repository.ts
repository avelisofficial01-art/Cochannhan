import { eq } from 'drizzle-orm';
import { db } from '../database/connection.js';
import {
  craftRecipes,
  recipeMaterials,
  craftLogs,
} from '../database/schema/index.js';

// ── Helpers ──

function toCamelRecipe(row: typeof craftRecipes.$inferSelect): Record<string, unknown> {
  return {
    id: row.id,
    name: row.name,
    resultType: row.result_type,
    resultId: row.result_id,
    resultQuantity: row.result_quantity,
    requiredGold: row.required_gold,
    successRate: row.success_rate,
    minRealm: row.min_realm,
    description: row.description,
  };
}

function toCamelMaterial(row: typeof recipeMaterials.$inferSelect): Record<string, unknown> {
  return {
    id: row.id,
    recipeId: row.recipe_id,
    itemId: row.item_id,
    quantity: row.quantity,
  };
}

// ── Recipes ──

export async function getAllRecipes(): Promise<Record<string, unknown>[]> {
  const rows = await db.select().from(craftRecipes);
  return rows.map(toCamelRecipe);
}

export async function getRecipeById(id: string): Promise<Record<string, unknown> | null> {
  const rows = await db.select().from(craftRecipes).where(eq(craftRecipes.id, id)).limit(1);
  return rows.length > 0 ? toCamelRecipe(rows[0]) : null;
}

// ── Recipe Materials ──

export async function getMaterialsForRecipe(recipeId: string): Promise<Record<string, unknown>[]> {
  const rows = await db
    .select()
    .from(recipeMaterials)
    .where(eq(recipeMaterials.recipe_id, recipeId));
  return rows.map(toCamelMaterial);
}

// ── Full recipe with materials ──

export async function getRecipeWithMaterials(id: string): Promise<Record<string, unknown> | null> {
  const recipe = await getRecipeById(id);
  if (!recipe) return null;

  const materials = await getMaterialsForRecipe(id);
  // Cast recipe to mutable
  const recipeObj = recipe as Record<string, unknown>;
  recipeObj.materials = materials;
  return recipeObj;
}

// ── Craft Logs ──

export async function logCraft(
  playerId: string,
  recipeId: string,
  success: boolean,
): Promise<void> {
  await db.insert(craftLogs).values({
    player_id: playerId,
    recipe_id: recipeId,
    success: success ? 'true' : 'false',
  });
}
