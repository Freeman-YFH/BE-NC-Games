const { createRefObj } = require("../func/func");

describe('createRefObj()', () => {
    it('should return object', () => {
        expect(createRefObj([])).toEqual([]);
    });

});