__author__ = 'albertjan'

# unit test files should be named test_<your name here>.py
# this ensures they will automatically be included in the
# npm test or npm run dist testing procedures
#

import unittest

class ListSort(unittest.TestCase):
    def test_sortReverseFalseShouldWork(self):
        x = [1,2,3]
        x.sort(reverse=False)
        self.assertEqual(x, [1,2,3])

    def test_revserNoneShouldThrowError(self):
        x = [1,2,3]
        try:
            x.sort(reverse=None)
        except TypeError as e:
            self.assertEqual(repr(e), "TypeError('an integer is required')")
            return

        self.fail("Test should have thrown exception")

    def test_reverseShouldAllowInts(self):
        x = [1,2,3]
        x.sort(reverse=-6)
        self.assertEqual(x, [3,2,1])
        x.sort(reverse=0)
        self.assertEqual(x, [1,2,3])

if __name__ == '__main__':
    unittest.main()
