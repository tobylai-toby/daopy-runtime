import unittest

class FileTests(unittest.TestCase):

    def test_with_open(self):
        with open("src/lib/StringIO.py", "r") as stdin:
            res = stdin.readline()

        self.assertEqual(res, "r\"\"\"File-like objects that read from or write to a string buffer.\n")


    def test_file_repr(self):
        with open("src/lib/StringIO.py", "r") as file:
             self.assertEqual(repr(file), "<openfile 'src/lib/StringIO.py', mode 'r'>")


    def test_file_functions(self):
        with open("src/lib/StringIO.py", "r") as file:
            file.seek(9)
            self.assertEqual(file.tell(), 9)
            self.assertEqual(file.read(4), "like")

        self.assertRaises(ValueError, file.read)

    def test_iter(self):
        F=open("test/unit/file.txt")
        header=F.readline()
        res = ""
        for line in F:
            res += line.strip()

        self.assertEqual("23",res)

    def test_iter2(self):
        F=open("test/unit/file.txt")
        header=F.readline()
        res = ""
        for line in F.readlines():
            res += line.strip()

        self.assertEqual("23",res)



if __name__ == "__main__":
    unittest.main()