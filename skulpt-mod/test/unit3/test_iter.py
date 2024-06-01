# Test iterators.

import sys
import unittest

# Test result of triple loop (too big to inline)
TRIPLETS = [(0, 0, 0), (0, 0, 1), (0, 0, 2),
            (0, 1, 0), (0, 1, 1), (0, 1, 2),
            (0, 2, 0), (0, 2, 1), (0, 2, 2),

            (1, 0, 0), (1, 0, 1), (1, 0, 2),
            (1, 1, 0), (1, 1, 1), (1, 1, 2),
            (1, 2, 0), (1, 2, 1), (1, 2, 2),

            (2, 0, 0), (2, 0, 1), (2, 0, 2),
            (2, 1, 0), (2, 1, 1), (2, 1, 2),
            (2, 2, 0), (2, 2, 1), (2, 2, 2)]

# Helper classes

class BasicIterClass:
    def __init__(self, n):
        self.n = n
        self.i = 0
    def __next__(self):
        res = self.i
        if res >= self.n:
            raise StopIteration
        self.i = res + 1
        return res
    def __iter__(self):
        return self

class IteratingSequenceClass:
    def __init__(self, n):
        self.n = n
    def __iter__(self):
        return BasicIterClass(self.n)

class SequenceClass:
    def __init__(self, n):
        self.n = n
    def __getitem__(self, i):
        if 0 <= i < self.n:
            return i
        else:
            raise IndexError

class UnlimitedSequenceClass:
    def __getitem__(self, i):
        return i

class DefaultIterClass:
    pass

class NoIterClass:
    def __getitem__(self, i):
        return i
    __iter__ = None

# Main test suite

class TestCase(unittest.TestCase):

    # # Helper to check that an iterator returns a given sequence
    # def check_iterator(self, it, seq):
    #     res = []
    #     while 1:
    #         try:
    #             val = next(it)
    #         except StopIteration:
    #             break
    #         res.append(val)
    #     self.assertEqual(res, seq)

    # # Helper to check that a for loop generates a given sequence
    # def check_for_loop(self, expr, seq):
    #     res = []
    #     for val in expr:
    #         res.append(val)
    #     self.assertEqual(res, seq)


    # # Test basic use of iter() function
    # def test_iter_basic(self):
    #     self.check_iterator(iter(range(10)), list(range(10)))

    # Test that iter(iter(x)) is the same as iter(x)
    def test_iter_idempotency(self):
        seq = list(range(10))
        it = iter(seq)
        it2 = iter(it)
        self.assertTrue(it is it2)

    # # Test that for loops over iterators work
    # def test_iter_for_loop(self):
    #     self.check_for_loop(iter(range(10)), list(range(10)))

    # Test several independent iterators over the same list
    def test_iter_independence(self):
        seq = range(3)
        res = []
        for i in iter(seq):
            for j in iter(seq):
                for k in iter(seq):
                    res.append((i, j, k))
        self.assertEqual(res, TRIPLETS)

    # Test triple list comprehension using iterators
    def test_nested_comprehensions_iter(self):
        seq = range(3)
        res = [(i, j, k)
               for i in iter(seq) for j in iter(seq) for k in iter(seq)]
        self.assertEqual(res, TRIPLETS)

    # Test triple list comprehension without iterators
    def test_nested_comprehensions_for(self):
        seq = range(3)
        res = [(i, j, k) for i in seq for j in seq for k in seq]
        self.assertEqual(res, TRIPLETS)

    # # Test a class with __iter__ in a for loop
    # def test_iter_class_for(self):
    #     self.check_for_loop(IteratingSequenceClass(10), list(range(10)))
    #
    # # Test a class with __iter__ with explicit iter()
    # def test_iter_class_iter(self):
    #     self.check_iterator(iter(IteratingSequenceClass(10)), list(range(10)))
    #
    # # Test for loop on a sequence class without __iter__
    # def test_seq_class_for(self):
    #     self.check_for_loop(SequenceClass(10), list(range(10)))
    #
    # # Test iter() on a sequence class without __iter__
    # def test_seq_class_iter(self):
    #     self.check_iterator(iter(SequenceClass(10)), list(range(10)))

    def test_mutating_seq_class_exhausted_iter(self):
        a = SequenceClass(5)
        exhit = iter(a)
        empit = iter(a)
        for x in exhit:  # exhaust the iterator
            next(empit)  # not exhausted
        a.n = 7
        # self.assertEqual(list(exhit), [])
        self.assertEqual(list(empit), [5, 6])
        self.assertEqual(list(a), [0, 1, 2, 3, 4, 5, 6])

    # # Test a new_style class with __iter__ but no next() method
    # def test_new_style_iter_class(self):
    #     class IterClass(object):
    #         def __iter__(self):
    #             return self
    #     self.assertRaises(TypeError, iter, IterClass())

    # # Test two-argument iter() with callable instance
    # def test_iter_callable(self):
    #     class C:
    #         def __init__(self):
    #             self.i = 0
    #         def __call__(self):
    #             i = self.i
    #             self.i = i + 1
    #             if i > 100:
    #                 raise IndexError # Emergency stop
    #             return i
    #     self.check_iterator(iter(C(), 10), list(range(10)), pickle=False)
    #
    # # Test two-argument iter() with function
    # def test_iter_function(self):
    #     def spam(state=[0]):
    #         i = state[0]
    #         state[0] = i+1
    #         return i
    #     self.check_iterator(iter(spam, 10), list(range(10)), pickle=False)

    # # Test two-argument iter() with function that raises StopIteration
    # def test_iter_function_stop(self):
    #     def spam(state=[0]):
    #         i = state[0]
    #         if i == 10:
    #             raise StopIteration
    #         state[0] = i+1
    #         return i
    #     self.check_iterator(iter(spam, 20), list(range(10)), pickle=False)

    # Test exception propagation through function iterator
    def test_exception_function(self):
        def spam(state=[0]):
            i = state[0]
            state[0] = i+1
            if i == 10:
                raise RuntimeError
            return i
        res = []
        try:
            for x in iter(spam, 20):
                res.append(x)
        except RuntimeError:
            self.assertEqual(res, list(range(10)))
        else:
            self.fail("should have raised RuntimeError")

    # Test exception propagation through sequence iterator
    def test_exception_sequence(self):
        class MySequenceClass(SequenceClass):
            def __getitem__(self, i):
                if i == 10:
                    raise RuntimeError
                return SequenceClass.__getitem__(self, i)
        res = []
        try:
            for x in MySequenceClass(20):
                res.append(x)
        except RuntimeError:
            self.assertEqual(res, list(range(10)))
        else:
            self.fail("should have raised RuntimeError")

    # # Test for StopIteration from __getitem__
    # def test_stop_sequence(self):
    #     class MySequenceClass(SequenceClass):
    #         def __getitem__(self, i):
    #             if i == 10:
    #                 raise StopIteration
    #             return SequenceClass.__getitem__(self, i)
    #     self.check_for_loop(MySequenceClass(20), list(range(10)), pickle=False)
    #
    # # Test a big range
    # def test_iter_big_range(self):
    #     self.check_for_loop(iter(range(10000)), list(range(10000)))
    #
    # # Test an empty list
    # def test_iter_empty(self):
    #     self.check_for_loop(iter([]), [])
    #
    # # Test a tuple
    # def test_iter_tuple(self):
    #     self.check_for_loop(iter((0,1,2,3,4,5,6,7,8,9)), list(range(10)))
    #
    # # Test a range
    # def test_iter_range(self):
    #     self.check_for_loop(iter(range(10)), list(range(10)))
    #
    # # Test a string
    # def test_iter_string(self):
    #     self.check_for_loop(iter("abcde"), ["a", "b", "c", "d", "e"])
    #
    # # Test a directory
    # def test_iter_dict(self):
    #     dict = {}
    #     for i in range(10):
    #         dict[i] = None
    #     self.check_for_loop(dict, list(dict.keys()))

    # Test list()'s use of iterators.
    def test_builtin_list(self):
        self.assertEqual(list(SequenceClass(5)), list(range(5)))
        self.assertEqual(list(SequenceClass(0)), [])
        self.assertEqual(list(()), [])

        d = {"one": 1, "two": 2, "three": 3}
        self.assertEqual(list(d), list(d.keys()))

        self.assertRaises(TypeError, list, list)
        self.assertRaises(TypeError, list, 42)

    # Test tuples()'s use of iterators.
    def test_builtin_tuple(self):
        self.assertEqual(tuple(SequenceClass(5)), (0, 1, 2, 3, 4))
        self.assertEqual(tuple(SequenceClass(0)), ())
        self.assertEqual(tuple([]), ())
        self.assertEqual(tuple(()), ())
        self.assertEqual(tuple("abc"), ("a", "b", "c"))

        d = {"one": 1, "two": 2, "three": 3}
        self.assertEqual(tuple(d), tuple(d.keys()))

        self.assertRaises(TypeError, tuple, list)
        self.assertRaises(TypeError, tuple, 42)

    # Test filter()'s use of iterators.
    def test_builtin_filter(self):
        self.assertEqual(list(filter(None, SequenceClass(5))),
                         list(range(1, 5)))
        self.assertEqual(list(filter(None, SequenceClass(0))), [])
        self.assertEqual(list(filter(None, ())), [])
        self.assertEqual(list(filter(None, "abc")), ["a", "b", "c"])

        d = {"one": 1, "two": 2, "three": 3}
        self.assertEqual(list(filter(None, d)), list(d.keys()))

        self.assertRaises(TypeError, filter, None, list)
        self.assertRaises(TypeError, filter, None, 42)

        # class Boolean:
        #     def __init__(self, truth):
        #         self.truth = truth
        #     def __bool__(self):
        #         return self.truth
        # bTrue = Boolean(True)
        # bFalse = Boolean(False)
        #
        # class Seq:
        #     def __init__(self, *args):
        #         self.vals = args
        #     def __iter__(self):
        #         class SeqIter:
        #             def __init__(self, vals):
        #                 self.vals = vals
        #                 self.i = 0
        #             def __iter__(self):
        #                 return self
        #             def __next__(self):
        #                 i = self.i
        #                 self.i = i + 1
        #                 if i < len(self.vals):
        #                     return self.vals[i]
        #                 else:
        #                     raise StopIteration
        #         return SeqIter(self.vals)
        #
        # seq = Seq(*([bTrue, bFalse] * 25))
        # self.assertEqual(list(filter(lambda x: not x, seq)), [bFalse]*25)
        # self.assertEqual(list(filter(lambda x: not x, iter(seq))), [bFalse]*25)

    # Test max() and min()'s use of iterators.
    def test_builtin_max_min(self):
        self.assertEqual(max(SequenceClass(5)), 4)
        self.assertEqual(min(SequenceClass(5)), 0)
        self.assertEqual(max(8, -1), 8)
        self.assertEqual(min(8, -1), -1)

        d = {"one": 1, "two": 2, "three": 3}
        self.assertEqual(max(d), "two")
        self.assertEqual(min(d), "one")
        self.assertEqual(max(d.values()), 3)
        self.assertEqual(min(iter(d.values())), 1)

    # Test map()'s use of iterators.
    def test_builtin_map(self):
        self.assertEqual(list(map(lambda x: x+1, SequenceClass(5))),
                         list(range(1, 6)))

        d = {"one": 1, "two": 2, "three": 3}
        self.assertEqual(list(map(lambda k, d=d: (k, d[k]), d)),
                         list(d.items()))
        dkeys = list(d.keys())
        expected = [(i < len(d) and dkeys[i] or None,
                     i,
                     i < len(d) and dkeys[i] or None)
                    for i in range(3)]

    # Test zip()'s use of iterators.
    def test_builtin_zip(self):
        self.assertEqual(list(zip()), [])
        self.assertEqual(list(zip(*[])), [])
        self.assertEqual(list(zip(*[(1, 2), 'ab'])), [(1, 'a'), (2, 'b')])

        self.assertRaises(TypeError, zip, None)
        self.assertRaises(TypeError, zip, range(10), 42)
        self.assertRaises(TypeError, zip, range(10), zip)

        # self.assertEqual(list(zip(IteratingSequenceClass(3))),
        #                  [(0,), (1,), (2,)])
        self.assertEqual(list(zip(SequenceClass(3))),
                         [(0,), (1,), (2,)])

        d = {"one": 1, "two": 2, "three": 3}
        self.assertEqual(list(d.items()), list(zip(d, d.values())))

        # Generate all ints starting at constructor arg.
        class IntsFrom:
            def __init__(self, start):
                self.i = start

            def __iter__(self):
                return self

            def __next__(self):
                i = self.i
                self.i = i+1
                return i

        self.assertEqual(list(zip(range(5))), [(i,) for i in range(5)])

        # Classes that lie about their lengths.
        class NoGuessLen5:
            def __getitem__(self, i):
                if i >= 5:
                    raise IndexError
                return i

        class Guess3Len5(NoGuessLen5):
            def __len__(self):
                return 3

        class Guess30Len5(NoGuessLen5):
            def __len__(self):
                return 30

        def lzip(*args):
            return list(zip(*args))

        self.assertEqual(len(Guess3Len5()), 3)
        self.assertEqual(len(Guess30Len5()), 30)
        self.assertEqual(lzip(NoGuessLen5()), lzip(range(5)))
        self.assertEqual(lzip(Guess3Len5()), lzip(range(5)))
        self.assertEqual(lzip(Guess30Len5()), lzip(range(5)))

        expected = [(i, i) for i in range(5)]
        for x in NoGuessLen5(), Guess3Len5(), Guess30Len5():
            for y in NoGuessLen5(), Guess3Len5(), Guess30Len5():
                self.assertEqual(lzip(x, y), expected)

    def test_unicode_join_endcase(self):

        # This class inserts a Unicode object into its argument's natural
        # iteration, in the 3rd position.
        class OhPhooey:
            def __init__(self, seq):
                self.it = iter(seq)
                self.i = 0

            def __iter__(self):
                return self

            def __next__(self):
                i = self.i
                self.i = i+1
                if i == 2:
                    return "fooled you!"
                return next(self.it)

    # Test iterators with 'x in y' and 'x not in y'.
    def test_in_and_not_in(self):
        # for sc5 in IteratingSequenceClass(5), SequenceClass(5):
        #     for i in range(5):
        #         self.assertIn(i, sc5)
        #     for i in "abc", -1, 5, 42.42, (3, 4), [], {1: 1}, 3-12j, sc5:
        #         self.assertNotIn(i, sc5)
        #
        self.assertRaises(TypeError, lambda: 3 in 12)
        self.assertRaises(TypeError, lambda: 3 not in map)

        d = {"one": 1, "two": 2, "three": 3, 1j: 2j}
        for k in d:
            self.assertIn(k, d)
            self.assertNotIn(k, d.values())
        for v in d.values():
            self.assertIn(v, d.values())
            self.assertNotIn(v, d)
        for k, v in d.items():
            self.assertIn((k, v), d.items())
            self.assertNotIn((v, k), d.items())


    # Test iterators with operator.countOf (PySequence_Count).
    def test_countOf(self):
        from operator import countOf
        self.assertEqual(countOf([1,2,2,3,2,5], 2), 3)
        self.assertEqual(countOf((1,2,2,3,2,5), 2), 3)
        self.assertEqual(countOf("122325", "2"), 3)
        self.assertEqual(countOf("122325", "6"), 0)

        self.assertRaises(TypeError, countOf, 42, 1)
        self.assertRaises(TypeError, countOf, countOf, countOf)

        d = {"one": 3, "two": 3, "three": 3, 1j: 2j}
        for k in d:
            self.assertEqual(countOf(d, k), 1)
        self.assertEqual(countOf(d.values(), 3), 3)
        self.assertEqual(countOf(d.values(), 2j), 1)
        self.assertEqual(countOf(d.values(), 1j), 0)


    # Test iterators with operator.indexOf (PySequence_Index).
    def test_indexOf(self):
        from operator import indexOf
        self.assertEqual(indexOf([1,2,2,3,2,5], 1), 0)
        self.assertEqual(indexOf((1,2,2,3,2,5), 2), 1)
        self.assertEqual(indexOf((1,2,2,3,2,5), 3), 3)
        self.assertEqual(indexOf((1,2,2,3,2,5), 5), 5)
        self.assertRaises(ValueError, indexOf, (1,2,2,3,2,5), 0)
        self.assertRaises(ValueError, indexOf, (1,2,2,3,2,5), 6)

        self.assertEqual(indexOf("122325", "2"), 1)
        self.assertEqual(indexOf("122325", "5"), 5)
        self.assertRaises(ValueError, indexOf, "122325", "6")

        self.assertRaises(TypeError, indexOf, 42, 1)
        self.assertRaises(TypeError, indexOf, indexOf, indexOf)


        iclass = IteratingSequenceClass(3)
        # for i in range(3):
        #     self.assertEqual(indexOf(iclass, i), i)
        # self.assertRaises(ValueError, indexOf, iclass, -1)


    # Test iterators on RHS of unpacking assignments.
    def test_unpack_iter(self):
        a, b = 1, 2
        self.assertEqual((a, b), (1, 2))

        # a, b, c = IteratingSequenceClass(3)
        # self.assertEqual((a, b, c), (0, 1, 2))
        #
        # try:    # too many values
        #     a, b = IteratingSequenceClass(3)
        # except ValueError:
        #     pass
        # else:
        #     self.fail("should have raised ValueError")
        #
        # try:    # not enough values
        #     a, b, c = IteratingSequenceClass(2)
        # except ValueError:
        #     pass
        # else:
        #     self.fail("should have raised ValueError")
        #
        # try:    # not iterable
        #     a, b, c = len
        # except TypeError:
        #     pass
        # else:
        #     self.fail("should have raised TypeError")

        a, b, c = {1: 42, 2: 42, 3: 42}.values()
        self.assertEqual((a, b, c), (42, 42, 42))


        # (a, b), (c,) = IteratingSequenceClass(2), {42: 24}
        # self.assertEqual((a, b, c), (0, 1, 42))


    def test_ref_counting_behavior(self):
        class C(object):
            count = 0
            def __new__(cls):
                cls.count += 1
                return object.__new__(cls)
            def __del__(self):
                cls = self.__class__
                assert cls.count > 0
                cls.count -= 1
        # x = C()
        # self.assertEqual(C.count, 1)
        # del x
        # self.assertEqual(C.count, 0)
        # l = [C(), C(), C()]
        # self.assertEqual(C.count, 3)
        # try:
        #     a, b = iter(l)
        # except ValueError:
        #     pass
        # del l
        # self.assertEqual(C.count, 0)


    # Make sure StopIteration is a "sink state".
    # This tests various things that weren't sink states in Python 2.2.1,
    # plus various things that always were fine.

    def test_sinkstate_list(self):
        # This used to fail
        a = list(range(5))
        b = iter(a)
        self.assertEqual(list(b), list(range(5)))
        a.extend(range(5, 10))
        self.assertEqual(list(b), [])

    def test_sinkstate_tuple(self):
        a = (0, 1, 2, 3, 4)
        b = iter(a)
        self.assertEqual(list(b), list(range(5)))
        self.assertEqual(list(b), [])

    def test_sinkstate_string(self):
        a = "abcde"
        b = iter(a)
        self.assertEqual(list(b), ['a', 'b', 'c', 'd', 'e'])
        self.assertEqual(list(b), [])

    def test_sinkstate_sequence(self):
        # This used to fail
        a = SequenceClass(5)
        b = iter(a)
        self.assertEqual(list(b), list(range(5)))
        a.n = 10
        # self.assertEqual(list(b), [])

    def test_sinkstate_callable(self):
        # This used to fail
        def spam(state=[0]):
            i = state[0]
            state[0] = i+1
            if i == 10:
                raise AssertionError("shouldn't have gotten this far")
            return i
        b = iter(spam, 5)
        self.assertEqual(list(b), list(range(5)))
        self.assertEqual(list(b), [])

    def test_sinkstate_dict(self):
        # XXX For a more thorough test, see towards the end of:
        # http://mail.python.org/pipermail/python-dev/2002-July/026512.html
        a = {1:1, 2:2, 0:0, 4:4, 3:3}
        for b in iter(a), a.keys(), a.items(), a.values():
            b = iter(a)
            self.assertEqual(len(list(b)), 5)
            self.assertEqual(list(b), [])

    def test_sinkstate_yield(self):
        def gen():
            for i in range(5):
                yield i
        b = gen()
        self.assertEqual(list(b), list(range(5)))
        self.assertEqual(list(b), [])

    def test_sinkstate_range(self):
        a = range(5)
        b = iter(a)
        self.assertEqual(list(b), list(range(5)))
        self.assertEqual(list(b), [])

    def test_sinkstate_enumerate(self):
        a = range(5)
        e = enumerate(a)
        b = iter(e)
        self.assertEqual(list(b), list(zip(range(5), range(5))))
        self.assertEqual(list(b), [])

    def test_extending_list_with_iterator_does_not_segfault(self):
        # The code to extend a list with an iterator has a fair
        # amount of nontrivial logic in terms of guessing how
        # much memory to allocate in advance, "stealing" refs,
        # and then shrinking at the end.  This is a basic smoke
        # test for that scenario.
        def gen():
            for i in range(500):
                yield i
        lst = [0] * 500
        for i in range(240):
            lst.pop(0)
        lst.extend(gen())
        self.assertEqual(len(lst), 760)

    def test_iter_neg_setstate(self):
        it = iter(UnlimitedSequenceClass())
        # it.__setstate__(-42)
        self.assertEqual(next(it), 0)
        self.assertEqual(next(it), 1)

    def test_error_iter(self):
        for typ in (DefaultIterClass, NoIterClass):
            self.assertRaises(TypeError, iter, typ())


if __name__ == "__main__":
    unittest.main()
