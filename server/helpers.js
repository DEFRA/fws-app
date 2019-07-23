function groupBy (arr, key) {
  return arr.reduce(function (acc, curr) {
    (acc[curr[key]] = acc[curr[key]] || []).push(curr)
    return acc
  }, {})
}

function getTargetAreaFilter (query, area) {
  return ta => {
    if (area) {
      if (ta.owner_area !== area) {
        return false
      }
    }

    if (query) {
      if (!ta.ta_name.includes(query) && !ta.ta_code.includes(query)) {
        return false
      }
    }

    return true
  }
}

module.exports = { groupBy, getTargetAreaFilter }
