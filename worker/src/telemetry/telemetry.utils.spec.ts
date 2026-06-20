import { isAlert } from './telemtry.utils';

describe('isAlert', () => {
    it.each([
        { statusCode: 100, responseTimeMs: 1, expected: false, case: 'happy path' },
        { statusCode: 200, responseTimeMs: 2000, expected: false, case: 'at response time boundary' },
        { statusCode: 399, responseTimeMs: 500, expected: false, case: 'just below error status' },
        { statusCode: 400, responseTimeMs: 1, expected: true, case: 'at error status boundary' },
        { statusCode: 500, responseTimeMs: 1, expected: true, case: 'server error' },
        { statusCode: 200, responseTimeMs: 2001, expected: true, case: 'slow response' },
    ])(
        'returns $expected when statusCode=$statusCode and responseTimeMs=$responseTimeMs ($case)',
        ({ statusCode, responseTimeMs, expected }) => {
            expect(isAlert(statusCode, responseTimeMs)).toBe(expected);
        },
    );
});