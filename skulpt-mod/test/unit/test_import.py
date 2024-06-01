import unittest
import sys

class ImportDottedNamesTest(unittest.TestCase):

    def test_dotted_fromname(self):
        from unittest.gui import TestCaseGui
        self.assertTrue(TestCaseGui is not None)

class ImportFromModulesTest(unittest.TestCase):

    def test_from_submodule(self):
        # Try to delete the module from the internal module list
        # sys.modules is a reference on Sk.sysmodules 
        # Should allow a fresh import -> testing the intended feature
        try:
            del sys.modules["unittest"]
        except:
            pass

        try:
            del sys.modules["unittest.gui"]
        except:
            pass

        from unittest import gui as mystuff
        self.assertTrue(mystuff is not None)


class ImportRelativeTest(unittest.TestCase):

    def test_relative_import(self):
        import importable_module

        self.assertEqual(importable_module.version, "toplevel")

        import subpackage

        self.assertEqual(subpackage.imported_version, "subpackage")

        self.assertEqual(subpackage.implicit_import.__name__, "subpackage.implicit_import")



if __name__ == '__main__':
    unittest.main()
