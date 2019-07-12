function groupBy (arr, key) {
  return arr.reduce(function (acc, curr) {
    (acc[curr[key]] = acc[curr[key]] || []).push(curr)
    return acc
  }, {})
}

module.exports = { groupBy }
