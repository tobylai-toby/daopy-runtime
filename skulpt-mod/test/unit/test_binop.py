"""Tests for binary operators on subtypes of built-in types."""

import unittest
# from test import test_support

# Adapted from Python 2.7.x test_binop.py

# As binary operators correclty handle magic methods, they should be tested
# using this unit test.


def gcd(a, b):
    """Greatest common divisor using Euclid's algorithm."""
    while a:
        a, b = b % a, a
    return b


def isint(x):
    """Test whether an object is an instance of int or long."""
    return isinstance(x, int) or isinstance(x, long)


def isnum(x):
    """Test whether an object is an instance of a built-in numeric type."""
    # for T in int, long, float, complex:
    # TODO: 'complex' removed until skulpt supports complex numbers
    for T in int, long, float:
        if isinstance(x, T):
            return 1
    return 0


def isRat(x):
    """Test wheter an object is an instance of the Rat class."""
    return isinstance(x, Rat)


class Rat(object):

    """Rational number implemented as a normalized pair of longs."""

    __slots__ = ['_Rat__num', '_Rat__den']

    def __init__(self, num=0L, den=1L):
        """Constructor: Rat([num[, den]]).

        The arguments must be ints or longs, and default to (0, 1)."""
        if not isint(num):
            # raise TypeError, "Rat numerator must be int or long (%r)" % num
            raise TypeError, "Rat numerator must be int or long"
        if not isint(den):
            # raise TypeError, "Rat denominator must be int or long (%r)" % den
            raise TypeError, "Rat denominator must be int or long"
        # But the zero is always on
        if den == 0:
            raise ZeroDivisionError, "zero denominator"
        g = gcd(den, num)
        self.__num = long(num // g)
        self.__den = long(den // g)

    def _get_num(self):
        """Accessor function for read-only 'num' attribute of Rat."""
        return self.__num
    # TODO: incorporate property when skulpt has implemented
    # num = property(_get_num, None)

    def _get_den(self):
        """Accessor function for read-only 'den' attribute of Rat."""
        return self.__den
    # TODO: incorporate property when skulpt has implemented
    # den = property(_get_den, None)

    def __repr__(self):
        """Convert a Rat to an string resembling a Rat constructor call."""
        return "Rat(%d, %d)" % (self.__num, self.__den)

    def __str__(self):
        """Convert a Rat to a string resembling a decimal numeric value."""
        # TODO: change line when float correctly calls magic methods
        # return str(float(self))
        return str(self.__float__())

    def __float__(self):
        """Convert a Rat to a float."""
        return self.__num * 1.0 / self.__den

    def __int__(self):
        """Convert a Rat to an int; self._get_den() must be 1."""
        if self.__den == 1:
            try:
                return int(self.__num)
            except OverflowError:
                raise OverflowError, ("%s too large to convert to int" %
                                      repr(self))
        raise ValueError, "can't convert %s to int" % repr(self)

    def __long__(self):
        """Convert a Rat to an long; self._get_den() must be 1."""
        if self.__den == 1:
            return long(self.__num)
        raise ValueError, "can't convert %s to long" % repr(self)

    def __add__(self, other):
        """Add two Rats, or a Rat and a number."""
        if isint(other):
            other = Rat(other)
        if isRat(other):
            return Rat(self.__num * other.__den + other.__num * self.__den,
                       self.__den * other.__den)
        if isnum(other):
            # TODO: change line when float correctly calls magic methods
            # return float(self) + other
            return self.__float__() + other
        return NotImplemented

    __radd__ = __add__

    def __sub__(self, other):
        """Subtract two Rats, or a Rat and a number."""
        if isint(other):
            other = Rat(other)
        if isRat(other):
            return Rat(self.__num * other.__den - other.__num * self.__den,
                       self.__den * other.__den)
        if isnum(other):
            # TODO: change line when float correctly calls magic methods
            # return float(self) - other
            return self.__float__() - other
        return NotImplemented

    def __rsub__(self, other):
        """Subtract two Rats, or a Rat and a number (reversed args)."""
        if isint(other):
            other = Rat(other)
        if isRat(other):
            return Rat(other.__num * self.__den - self.__num * other.__den,
                       self.__den * other.__den)
        if isnum(other):
            # TODO: change line when float correctly calls magic methods
            # return other - float(self)
            return other - self.__float__()
        return NotImplemented

    def __mul__(self, other):
        """Multiply two Rats, or a Rat and a number."""
        if isRat(other):
            return Rat(self.__num * other.__num, self.__den * other.__den)
        if isint(other):
            return Rat(self.__num * other, self.__den)
        if isnum(other):
            # TODO: change line when float correctly calls magic methods
            # return float(self)*other
            return self.__float__() * other
        return NotImplemented

    __rmul__ = __mul__

    def __truediv__(self, other):
        """Divide two Rats, or a Rat and a number."""
        if isRat(other):
            return Rat(self.__num * other.__den, self.__den * other.__num)
        if isint(other):
            return Rat(self.__num, self.__den * other)
        if isnum(other):
            return float(self) / other
        return NotImplemented

    __div__ = __truediv__

    def __rtruediv__(self, other):
        """Divide two Rats, or a Rat and a number (reversed args)."""
        if isRat(other):
            return Rat(other.__num * self.__den, other.__den * self.__num)
        if isint(other):
            return Rat(other * self.__den, self.__num)
        if isnum(other):
            # TODO: change line when float correctly calls magic methods
            # return other / float(self)
            return other / self.__float__()
        return NotImplemented

    __rdiv__ = __rtruediv__

    def __floordiv__(self, other):
        """Divide two Rats, returning the floored result."""
        if isint(other):
            other = Rat(other)
        elif not isRat(other):
            return NotImplemented
        x = self / other
        return x.__num // x.__den

    def __rfloordiv__(self, other):
        """Divide two Rats, returning the floored result (reversed args)."""
        x = other / self
        return x.__num // x.__den

    def __divmod__(self, other):
        """Divide two Rats, returning quotient and remainder."""
        if isint(other):
            other = Rat(other)
        elif not isRat(other):
            return NotImplemented
        x = self // other
        return (x, self - other * x)

    def __rdivmod__(self, other):
        """Divide two Rats, returning quotient and remainder (reversed args)."""
        if isint(other):
            other = Rat(other)
        elif not isRat(other):
            return NotImplemented
        return divmod(other, self)

    def __mod__(self, other):
        """Take one Rat modulo another."""
        return divmod(self, other)[1]

    def __rmod__(self, other):
        """Take one Rat modulo another (reversed args)."""
        return divmod(other, self)[1]

    def __eq__(self, other):
        """Compare two Rats for equality."""
        if isint(other):
            return self.__den == 1 and self.__num == other
        if isRat(other):
            return self.__num == other.__num and self.__den == other.__den
        if isnum(other):
            # TODO: change line when float correctly calls magic methods
            # return float(self) == other
            return self.__float__() == other
        return NotImplemented

    def __ne__(self, other):
        """Compare two Rats for inequality."""
        return not self == other

    # Silence Py3k warning
    __hash__ = None


class RatTestCase(unittest.TestCase):

    """Unit tests for Rat class and its support utilities."""

    def test_gcd(self):
        self.assertEqual(gcd(10, 12), 2)
        self.assertEqual(gcd(10, 15), 5)
        self.assertEqual(gcd(10, 11), 1)
        self.assertEqual(gcd(100, 15), 5)
        self.assertEqual(gcd(-10, 2), -2)
        self.assertEqual(gcd(10, -2), 2)
        self.assertEqual(gcd(-10, -2), -2)
        for i in range(1, 20):
            for j in range(1, 20):
                self.assertTrue(gcd(i, j) > 0)
                self.assertTrue(gcd(-i, j) < 0)
                self.assertTrue(gcd(i, -j) > 0)
                self.assertTrue(gcd(-i, -j) < 0)

    def test_constructor(self):
        # TODO: replace _get_num() with num and _get_den with den
        # when skulpt implements property
        a = Rat(10, 15)
        self.assertEqual(a._get_num(), 2)
        self.assertEqual(a._get_den(), 3)
        a = Rat(10L, 15L)
        self.assertEqual(a._get_num(), 2)
        self.assertEqual(a._get_den(), 3)
        a = Rat(10, -15)
        self.assertEqual(a._get_num(), -2)
        self.assertEqual(a._get_den(), 3)
        a = Rat(-10, 15)
        self.assertEqual(a._get_num(), -2)
        self.assertEqual(a._get_den(), 3)
        a = Rat(-10, -15)
        self.assertEqual(a._get_num(), 2)
        self.assertEqual(a._get_den(), 3)
        a = Rat(7)
        self.assertEqual(a._get_num(), 7)
        self.assertEqual(a._get_den(), 1)
        try:
            a = Rat(1, 0)
        except ZeroDivisionError:
            pass
        else:
            self.fail("Rat(1, 0) didn't raise ZeroDivisionError")
        # TODO: re-add 0j when skulpt implements complex numbers
        # for bad in "0", 0.0, 0j, (), [], {}, None, Rat, unittest:
        for bad in "0", 0.0, (), [], {}, None, Rat, unittest:
            try:
                a = Rat(bad)
            except TypeError:
                pass
            else:
                self.fail("Rat(%r) didn't raise TypeError" % bad)
            try:
                a = Rat(1, bad)
            except TypeError:
                pass
            else:
                self.fail("Rat(1, %r) didn't raise TypeError" % bad)

    # def test_add(self):
    #     self.assertEqual(Rat(2, 3) + Rat(1, 3), 1)
    #     self.assertEqual(Rat(2, 3) + 1, Rat(5, 3))
    #     self.assertEqual(1 + Rat(2, 3), Rat(5, 3))
    #     self.assertEqual(1.0 + Rat(1, 2), 1.5)
    #     self.assertEqual(Rat(1, 2) + 1.0, 1.5)

    # def test_sub(self):
    #     self.assertEqual(Rat(7, 2) - Rat(7, 5), Rat(21, 10))
    #     self.assertEqual(Rat(7, 5) - 1, Rat(2, 5))
    #     self.assertEqual(1 - Rat(3, 5), Rat(2, 5))
    #     self.assertEqual(Rat(3, 2) - 1.0, 0.5)
    #     self.assertEqual(1.0 - Rat(1, 2), 0.5)

    # def test_mul(self):
    #     self.assertEqual(Rat(2, 3) * Rat(5, 7), Rat(10, 21))
    #     self.assertEqual(Rat(10, 3) * 3, 10)
    #     self.assertEqual(3 * Rat(10, 3), 10)
    #     self.assertEqual(Rat(10, 5) * 0.5, 1.0)
    #     self.assertEqual(0.5 * Rat(10, 5), 1.0)

    # def test_div(self):
    #     self.assertEqual(Rat(10, 3) / Rat(5, 7), Rat(14, 3))
    #     self.assertEqual(Rat(10, 3) / 3, Rat(10, 9))
    #     self.assertEqual(2 / Rat(5), Rat(2, 5))
    #     self.assertEqual(3.0 * Rat(1, 2), 1.5)
    #     self.assertEqual(Rat(1, 2) * 3.0, 1.5)

    # def test_floordiv(self):
    #     self.assertEqual(Rat(10) // Rat(4), 2)
    #     self.assertEqual(Rat(10, 3) // Rat(4, 3), 2)
    #     self.assertEqual(Rat(10) // 4, 2)
    #     self.assertEqual(10 // Rat(4), 2)

#    def test_eq(self):
#         self.assertEqual(Rat(10), Rat(20, 2))
#         self.assertEqual(Rat(10), 10)
#         self.assertEqual(10, Rat(10))
#         self.assertEqual(Rat(10), 10.0)
#         self.assertEqual(10.0, Rat(10))

    def test_divmod(self):
        self.assertEqual(divmod(Rat(10), Rat(4)), (2, 2))
        self.assertEqual(divmod(Rat(10, 3), Rat(4, 3)), (2, Rat(2, 3)))
        self.assertEqual(divmod(Rat(10), 4), (2, 2))
        self.assertEqual(divmod(10, Rat(4)), (2, 2))
        self.assertEqual(divmod(10, 4), (2, 2))     
        self.assertEqual(divmod(5, 2.5), (2.0, 0.0))
        self.assertEqual(divmod(10, 4.5), (2.0, 1.0))        
        self.assertEqual(divmod(10, 5.5), (1.0, 4.5))
        self.assertEqual(divmod(10L, 4L), (2L, 2L))
        self.assertEqual(divmod(5L, 2.5), (2.0, 0.0))
        self.assertEqual(divmod(10L, 4.5), (2.0, 1.0))
        self.assertEqual(divmod(10L, 5.5), (1.0, 4.5))

    # XXX Ran out of steam; TO DO: mod, future division



class IntContainerNoOps(object):
    def __init__(self, v):
        self.v = v

class IntContainerOps(IntContainerNoOps):
    def __add__(self, x):
        return self.__class__(self.v + x.v)

class IntContainerIOps(IntContainerOps):
    def __iadd__(self, x):
        self.v += x.v
        return self


class IOpsTestCase(unittest.TestCase):
    def check_ops(self, Cls, is_same = False):
        self.assertEqual((Cls(2) + Cls(3)).v, 5)
        # TODO other ops

        x = Cls(2)
        y = x
        y += Cls(3)
        self.assertEqual(y.v, 5)
        self.assertIs(y, x) if is_same else self.assertIsNot(y, x)

    def test_ops(self):
        self.assertRaises(TypeError, lambda: IntContainerNoOps(2) + IntContainerNoOps(3))

        self.check_ops(IntContainerOps, False)

        #self.check_ops(IntContainerIOps, True)


if __name__ == "__main__":
    unittest.main()
