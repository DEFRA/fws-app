const mocks = {}

module.exports = {
  get mocks () {
    return mocks
  },
  set mocks (mock) {
    mocks.push(mock)
  },
  clearMocks: function (mock) {
    if (mock) {
      mocks[mock].revert()
    } else {
      mocks.forEach(function (item) {
        item.revert()
      })
    }
  }
}
