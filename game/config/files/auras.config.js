const _ = require('lodash')
const {
  msOneMin,
} = require('../../../helpers/files/date.helper')

const auraById = {
  auras_new_follower: {
    aura_class: 'xpbonus_multiplier',
    itvTic: msOneMin,
    ticTotal: 60,
    params: { group: 10 },
  },
  auras_new_subscriber: {
    aura_class: 'xpbonus_multiplier',
    itvTic: msOneMin,
    ticTotal: 60,
    params: { group: 10 },
  },
  auras_new_discord: {
    aura_class: 'xpbonus_multiplier',
    itvTic: msOneMin,
    ticTotal: 60,
    params: { group: 10 },
  },
}

const auraByClass = {}
const auraIdsByClass = {}
_.forEach(auraById, (aura, aura_id) => {
  if (!auraByClass[aura.aura_class]) { auraByClass[aura.aura_class] = [] }
  if (!auraIdsByClass[aura.aura_class]) { auraIdsByClass[aura.aura_class] = [] }
  auraByClass[aura.aura_class].push({
    ...aura,
    aura_id,
  })
  auraIdsByClass[aura.aura_class].push(aura_id)
})

module.exports = {
  layout: {
    byId: auraById,
    byClass: auraByClass,
    idsByClass: auraIdsByClass,
  },
}
