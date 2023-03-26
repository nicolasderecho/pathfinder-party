import type { PrismaClient } from "@prisma/client";
import {
  MAGE, MALE_HUMAN, MALE, ADD_ARCANE_CHECK_ACID_COLD, ADD_ARCANE_CHECK_ELECTRIC_FIRE, ADD_ARCANE_CHECK, RISE_OF_THE_RUNELORDS, EVADE_MONSTER, BEGINNING_RECHARGE_CARD,
  BLESSING_CARD_TYPE, ARMOR_CARD_TYPE, WEAPON_CARD_TYPE, ITEM_CARD_TYPE, ALLY_CARD_TYPE, SPELL_CARD_TYPE,
  STRENGTH, DEXTERITY, CONSTITUTION, INTELIGENCE, WISDOM, CHARISMA, ARCANE, KNOWLEDGE,
  HAND_SIZE, SPELL_CHECK_TOP_CARD, ACQUIRE_MAGIC_CARD, ADD_TO_RECHARGE_CARD, EVOCATOR, ILLUSIONIST, ACQUIRE_SPELL, ACQUIRE_SPELL_ALLY
} from "../../../app/utils/constants/rise_of_the_runelords"

export async function createEzrenRoRTemplate(prisma: PrismaClient) {
  let ezren = await prisma.character.findFirst({ where: { name: "ezren", version: RISE_OF_THE_RUNELORDS } })
  if (!ezren) {
    ezren = await prisma.character.create({
      include: { CharacterCard: true },
      data: { name: "ezren", version: RISE_OF_THE_RUNELORDS, race: [MALE, MALE_HUMAN, MAGE] }
    });
    await prisma.characterSkill.createMany({
      data: [
        { code: STRENGTH, die: 6, slots: 1, characterId: ezren.id },
        { code: DEXTERITY, die: 6, slots: 3, characterId: ezren.id },
        { code: CONSTITUTION, die: 4, slots: 2, characterId: ezren.id },
        { code: INTELIGENCE, die: 12, slots: 4, characterId: ezren.id },
        { code: ARCANE, baseSkill: INTELIGENCE, slots: 0, plus: 2, characterId: ezren.id },
        { code: KNOWLEDGE, baseSkill: INTELIGENCE, slots: 0, plus: 2, characterId: ezren.id },
        { code: WISDOM, die: 8, slots: 2, characterId: ezren.id },
        { code: CHARISMA, die: 6, slots: 3, characterId: ezren.id },
      ]
    })

    await prisma.characterCard.createMany({
      data: [
        { cardType: WEAPON_CARD_TYPE, value: 1, slots: 1, characterId: ezren.id },
        { cardType: SPELL_CARD_TYPE, value: 8, slots: 3, characterId: ezren.id },
        { cardType: ARMOR_CARD_TYPE, value: 0, slots: 1, characterId: ezren.id },
        { cardType: ITEM_CARD_TYPE, value: 3, slots: 3, characterId: ezren.id },
        { cardType: ALLY_CARD_TYPE, value: 3, slots: 2, characterId: ezren.id },
        { cardType: BLESSING_CARD_TYPE, value: 0, slots: 0, characterId: ezren.id },
      ]
    })

    await prisma.characterPower.createMany({
      data: [
        { code: HAND_SIZE, initialValue: "6", characterId: ezren.id, slots: 2, innate: true },
        { code: SPELL_CHECK_TOP_CARD, characterId: ezren.id, innate: true },
        { code: ACQUIRE_MAGIC_CARD, characterId: ezren.id, innate: true },
        { code: ADD_TO_RECHARGE_CARD, characterId: ezren.id, slots: 2 }
      ]
    })

    const illusionist = await prisma.characterRole.create({ data: { code: ILLUSIONIST, characterId: ezren.id } })

    await prisma.characterRolePower.createMany({
      data: [
        { code: HAND_SIZE, initialValue: "6", characterRoleId: illusionist.id, slots: 2, innate: true },
        { code: SPELL_CHECK_TOP_CARD, characterRoleId: illusionist.id, slots: 1, innate: true },
        { code: ACQUIRE_MAGIC_CARD, characterRoleId: illusionist.id, innate: true },
        { code: ADD_TO_RECHARGE_CARD, characterRoleId: illusionist.id, slots: 4 },
        { code: EVADE_MONSTER, characterRoleId: illusionist.id, slots: 1 },
        { code: BEGINNING_RECHARGE_CARD, characterRoleId: illusionist.id, slots: 1 },
      ]
    })

    const illusionistAcquireSpellOrAlly = await prisma.characterRolePower.create({ data: { code: ACQUIRE_SPELL, characterRoleId: illusionist.id, slots: 2 } })
    await prisma.characterRolePower.create({ data: { code: ACQUIRE_SPELL_ALLY, characterRoleId: illusionist.id, slots: 1, parentId: illusionistAcquireSpellOrAlly.id } })


    const evocator = await prisma.characterRole.create({ data: { code: EVOCATOR, characterId: ezren.id } })

    await prisma.characterRolePower.createMany({
      data: [
        { code: HAND_SIZE, initialValue: "6", characterRoleId: evocator.id, slots: 3, innate: true },
        { code: SPELL_CHECK_TOP_CARD, characterRoleId: evocator.id, innate: true },
        { code: ACQUIRE_MAGIC_CARD, characterRoleId: evocator.id, innate: true },
        { code: ADD_TO_RECHARGE_CARD, characterRoleId: evocator.id, slots: 4 },
        { code: ACQUIRE_SPELL, characterRoleId: evocator.id, slots: 2 },
      ]
    })

    const evocatorAddArcaneCheck = await prisma.characterRolePower.create({ data: { code: ADD_ARCANE_CHECK, characterRoleId: evocator.id, slots: 1 } })
    await prisma.characterRolePower.create({ data: { code: ADD_ARCANE_CHECK_ACID_COLD, characterRoleId: evocator.id, slots: 1, parentId: evocatorAddArcaneCheck.id } })
    await prisma.characterRolePower.create({ data: { code: ADD_ARCANE_CHECK_ELECTRIC_FIRE, characterRoleId: evocator.id, slots: 1, parentId: evocatorAddArcaneCheck.id } })

  }
}