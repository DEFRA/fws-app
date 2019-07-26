const moment = require('moment-timezone')
const { dateFormat } = require('./constants')

function groupBy (arr, key) {
  return arr.reduce(function (acc, curr) {
    (acc[curr[key]] = acc[curr[key]] || []).push(curr)
    return acc
  }, {})
}

function sortBy (property) {
  let sortOrder = 1

  if (property[0] === '-') {
    sortOrder = -1
    property = property.substr(1)
  }

  return function (a, b) {
    /* Works with strings and numbers */
    const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
    return result * sortOrder
  }
}

function sortByMultiple () {
  const props = arguments
  return function (obj1, obj2) {
    let i = 0
    let result = 0
    const numberOfProperties = props.length

    while (result === 0 && i < numberOfProperties) {
      result = sortBy(props[i])(obj1, obj2)
      i++
    }
    return result
  }
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

function formatUTCDate (str) {
  return moment.utc(str).tz('Europe/London').format(dateFormat)
}

module.exports = {
  groupBy,
  getTargetAreaFilter,
  sortBy,
  sortByMultiple,
  formatUTCDate
}
