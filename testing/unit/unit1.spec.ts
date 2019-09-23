//Note - If any additional paths are added, they must also be added
//to the moduleNameMapper in jest.  https://www.npmjs.com/package/ts-jest#module-path-mapping

function sum(a, b) {
    return a + b;
}

describe('Jest Test', () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(sum(1, 2)).toBe(3);
    });
});

