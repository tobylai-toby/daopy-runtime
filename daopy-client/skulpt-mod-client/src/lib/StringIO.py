"File-like objects that read from or write to a string buffer.\n\nThis implements (nearly) all stdio methods.\n\nf = StringIO()      # ready for writing\nf = StringIO(buf)   # ready for reading\nf.close()           # explicitly release resources held\nflag = f.isatty()   # always false\npos = f.tell()      # get current position\nf.seek(pos)         # set current position\nf.seek(pos, mode)   # mode 0: absolute; 1: relative; 2: relative to EOF\nbuf = f.read()      # read until EOF\nbuf = f.read(n)     # read up to n bytes\nbuf = f.readline()  # read until end of line ('\\n') or EOF\nlist = f.readlines()# list of f.readline() results until EOF\nf.truncate([size])  # truncate file at to at most size (default: current pos)\nf.write(buf)        # write at current position\nf.writelines(list)  # for line in list: f.write(line)\nf.getvalue()        # return whole file's contents as a string\n\nNotes:\n- Using a real file is often faster (but less convenient).\n- There's also a much faster implementation in C, called cStringIO, but\n  it's not subclassable.\n- fileno() is left unimplemented so that code which uses it triggers\n  an exception early.\n- Seeking far beyond EOF and then writing will insert real null\n  bytes that occupy space in the buffer.\n- There's a simple test set (see end of this file).\n"
_A=None
__all__=['StringIO']
def _complain_ifclosed(closed):
	if closed:raise ValueError('I/O operation on closed file')
class StringIO:
	'class StringIO([buffer])\n\n    When a StringIO object is created, it can be initialized to an existing\n    string by passing the string to the constructor. If no string is given,\n    the StringIO will start empty.\n\n    The StringIO object can accept either Unicode or 8-bit strings, but\n    mixing the two may take some care. If both are used, 8-bit strings that\n    cannot be interpreted as 7-bit ASCII (that use the 8th bit) will cause\n    a UnicodeError to be raised when getvalue() is called.\n    '
	def __init__(A,buf=''):
		B=buf
		if not isinstance(B,str):B=str(B)
		A.buf=B;A.len=len(B);A.buflist=[];A.pos=0;A.closed=False;A.softspace=0
	def __iter__(A):return A
	def next(A):
		'A file object is its own iterator, for example iter(f) returns f\n        (unless f is closed). When a file is used as an iterator, typically\n        in a for loop (for example, for line in f: print line), the next()\n        method is called repeatedly. This method returns the next input line,\n        or raises StopIteration when EOF is hit.\n        ';_complain_ifclosed(A.closed);B=A.readline()
		if not B:raise StopIteration
		return B
	def close(A):
		'Free the memory buffer.\n        '
		if not A.closed:A.closed=True;A.buf=_A;A.pos=_A
	def isatty(A):'Returns False because StringIO objects are not connected to a\n        tty-like device.\n        ';_complain_ifclosed(A.closed);return False
	def seek(A,pos,mode=0):
		"Set the file's current position.\n\n        The mode argument is optional and defaults to 0 (absolute file\n        positioning); other values are 1 (seek relative to the current\n        position) and 2 (seek relative to the file's end).\n\n        There is no return value.\n        ";B=pos;_complain_ifclosed(A.closed)
		if A.buflist:A.buf+=''.join(A.buflist);A.buflist=[]
		if mode==1:B+=A.pos
		elif mode==2:B+=A.len
		A.pos=max(0,B)
	def tell(A):"Return the file's current position.";_complain_ifclosed(A.closed);return A.pos
	def read(A,n=-1):
		'Read at most size bytes from the file\n        (less if the read hits EOF before obtaining size bytes).\n\n        If the size argument is negative or omitted, read all data until EOF\n        is reached. The bytes are returned as a string object. An empty\n        string is returned when EOF is encountered immediately.\n        ';_complain_ifclosed(A.closed)
		if A.buflist:A.buf+=''.join(A.buflist);A.buflist=[]
		if n is _A or n<0:B=A.len
		else:B=min(A.pos+n,A.len)
		C=A.buf[A.pos:B];A.pos=B;return C
	def readline(A,length=_A):
		"Read one entire line from the file.\n\n        A trailing newline character is kept in the string (but may be absent\n        when a file ends with an incomplete line). If the size argument is\n        present and non-negative, it is a maximum byte count (including the\n        trailing newline) and an incomplete line may be returned.\n\n        An empty string is returned only when EOF is encountered immediately.\n\n        Note: Unlike stdio's fgets(), the returned string contains null\n        characters ('\\0') if they occurred in the input.\n        ";C=length;_complain_ifclosed(A.closed)
		if A.buflist:A.buf+=''.join(A.buflist);A.buflist=[]
		D=A.buf.find('\n',A.pos)
		if D<0:B=A.len
		else:B=D+1
		if C is not _A and C>=0:
			if A.pos+C<B:B=A.pos+C
		E=A.buf[A.pos:B];A.pos=B;return E
	def readlines(B,sizehint=0):
		'Read until EOF using readline() and return a list containing the\n        lines thus read.\n\n        If the optional sizehint argument is present, instead of reading up\n        to EOF, whole lines totalling approximately sizehint bytes (or more\n        to accommodate a final whole line).\n        ';C=0;D=[];A=B.readline()
		while A:
			D.append(A);C+=len(A)
			if 0<sizehint<=C:break
			A=B.readline()
		return D
	def truncate(A,size=_A):
		"Truncate the file's size.\n\n        If the optional size argument is present, the file is truncated to\n        (at most) that size. The size defaults to the current position.\n        The current file position is not changed unless the position\n        is beyond the new file size.\n\n        If the specified size exceeds the file's current size, the\n        file remains unchanged.\n        ";B=size;_complain_ifclosed(A.closed)
		if B is _A:B=A.pos
		elif B<0:raise IOError(22,'Negative size not allowed')
		elif B<A.pos:A.pos=B
		A.buf=A.getvalue()[:B];A.len=B
	def write(A,s):
		'Write a string to the file.\n\n        There is no return value.\n        ';_complain_ifclosed(A.closed)
		if not s:return
		if not isinstance(s,str):s=str(s)
		C=A.pos;B=A.len
		if C==B:A.buflist.append(s);A.len=A.pos=C+len(s);return
		if C>B:A.buflist.append('\x00'*(C-B));B=C
		D=C+len(s)
		if C<B:
			if A.buflist:A.buf+=''.join(A.buflist)
			A.buflist=[A.buf[:C],s,A.buf[D:]];A.buf=''
			if D>B:B=D
		else:A.buflist.append(s);B=D
		A.len=B;A.pos=D
	def writelines(A,iterable):
		'Write a sequence of strings to the file. The sequence can be any\n        iterable object producing strings, typically a list of strings. There\n        is no return value.\n\n        (The name is intended to match readlines(); writelines() does not add\n        line separators.)\n        ';B=A.write
		for C in iterable:B(C)
	def flush(A):'Flush the internal buffer\n        ';_complain_ifclosed(A.closed)
	def getvalue(A):
		'\n        Retrieve the entire contents of the "file" at any time before\n        the StringIO object\'s close() method is called.\n\n        The StringIO object can accept either Unicode or 8-bit strings,\n        but mixing the two may take some care. If both are used, 8-bit\n        strings that cannot be interpreted as 7-bit ASCII (that use the\n        8th bit) will cause a UnicodeError to be raised when getvalue()\n        is called.\n        ';_complain_ifclosed(A.closed)
		if A.buflist:A.buf+=''.join(A.buflist);A.buflist=[]
		return A.buf